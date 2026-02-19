// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AutoTrade
 * @dev Allows users to place standing buy / sell orders.
 *      An off-chain keeper (or any user) can call executeBuy / executeSell
 *      when market prices meet the order's stated conditions.
 *
 *  UNIT CONVENTION (keeps integer math safe):
 *    - `targetAmount` / `totalAmount` / `amount` → whole ETK tokens (e.g. 500 = 500 ETK)
 *    - `maxPricePerUnit` / `minPricePerUnit`     → Wei per 1 whole ETK
 *    - `depositedETH`                            → Wei (ETH × 1e18)
 *
 *  Token transfers scale up by TOKEN_DECIMALS when calling ERC20 transferFrom/transfer.
 *
 *  Buy order  → user deposits ETH upfront; ETK is delivered on match.
 *  Sell order → user deposits ETK upfront; ETH is delivered on match.
 */
contract AutoTrade is ReentrancyGuard {
    IERC20 public energyToken;
    uint256 private constant TOKEN_DECIMALS = 1e18;

    // ─── Structs ──────────────────────────────────────────────────────────────
    struct BuyOrder {
        address buyer;
        uint256 maxPricePerUnit; // max ETH (wei) willing to pay per 1 ETK unit
        uint256 targetAmount;   // total ETK units to acquire
        uint256 filledAmount;   // ETK units already received
        uint256 depositedETH;   // ETH locked in this contract
        bool active;
    }

    struct SellOrder {
        address seller;
        uint256 minPricePerUnit; // min ETH (wei) required per 1 ETK unit
        uint256 totalAmount;     // ETK units deposited
        uint256 soldAmount;      // ETK units already sold
        bool active;
    }

    mapping(uint256 => BuyOrder) public buyOrders;
    mapping(uint256 => SellOrder) public sellOrders;

    uint256 public buyOrderCount;
    uint256 public sellOrderCount;

    // ─── Events ───────────────────────────────────────────────────────────────
    event BuyOrderPlaced(
        uint256 indexed orderId,
        address indexed buyer,
        uint256 maxPricePerUnit,
        uint256 targetAmount,
        uint256 depositedETH
    );
    event SellOrderPlaced(
        uint256 indexed orderId,
        address indexed seller,
        uint256 minPricePerUnit,
        uint256 totalAmount
    );
    event BuyOrderExecuted(uint256 indexed orderId, uint256 amountFilled, uint256 ethSpent);
    event SellOrderExecuted(uint256 indexed orderId, uint256 amountSold, uint256 ethReceived);
    event BuyOrderCancelled(uint256 indexed orderId, uint256 ethRefunded);
    event SellOrderCancelled(uint256 indexed orderId, uint256 tokensRefunded);

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor(address _energyToken) {
        energyToken = IERC20(_energyToken);
    }

    // ── Place Orders ─────────────────────────────────────────────────────────

    /**
     * @dev Place an automated buy order.
     *      Caller deposits `maxPricePerUnit * targetAmount` ETH up front.
     */
    function placeBuyOrder(uint256 maxPricePerUnit, uint256 targetAmount)
        external
        payable
        nonReentrant
    {
        require(maxPricePerUnit > 0, "Price must be > 0");
        require(targetAmount > 0, "Amount must be > 0");

        uint256 required = maxPricePerUnit * targetAmount;
        require(msg.value >= required, "Insufficient ETH deposit");

        buyOrderCount++;
        buyOrders[buyOrderCount] = BuyOrder({
            buyer: msg.sender,
            maxPricePerUnit: maxPricePerUnit,
            targetAmount: targetAmount,
            filledAmount: 0,
            depositedETH: required,
            active: true
        });

        // Refund excess ETH
        if (msg.value > required) {
            payable(msg.sender).transfer(msg.value - required);
        }

        emit BuyOrderPlaced(buyOrderCount, msg.sender, maxPricePerUnit, targetAmount, required);
    }

    /**
     * @dev Place an automated sell order. Caller deposits `totalAmount` ETK tokens.
     */
    function placeSellOrder(uint256 minPricePerUnit, uint256 totalAmount)
        external
        nonReentrant
    {
        require(minPricePerUnit > 0, "Price must be > 0");
        require(totalAmount > 0, "Amount must be > 0");
        // Scale to 18-decimal base units for ERC20 transfer
        require(
            energyToken.transferFrom(msg.sender, address(this), totalAmount * TOKEN_DECIMALS),
            "Token transfer failed"
        );

        sellOrderCount++;
        sellOrders[sellOrderCount] = SellOrder({
            seller: msg.sender,
            minPricePerUnit: minPricePerUnit,
            totalAmount: totalAmount,
            soldAmount: 0,
            active: true
        });

        emit SellOrderPlaced(sellOrderCount, msg.sender, minPricePerUnit, totalAmount);
    }

    // ── Execute (Match) Orders ───────────────────────────────────────────────

    /**
     * @dev Execute a buy order at a given `pricePerUnit`.
     *      Anyone (keeper / bot) can call this when conditions are met.
     *      Seller sends tokens directly; ETH is pulled from the order deposit.
     *
     *      `pricePerUnit` <= order.maxPricePerUnit must hold.
     *      Caller must have approved `amount` ETK to this contract.
     */
    function executeBuyOrder(
        uint256 orderId,
        uint256 amount,
        uint256 pricePerUnit
    ) external nonReentrant {
        BuyOrder storage order = buyOrders[orderId];
        require(order.active, "Order not active");
        require(pricePerUnit <= order.maxPricePerUnit, "Price too high");
        require(amount > 0 && amount <= order.targetAmount - order.filledAmount, "Invalid amount");

        uint256 ethCost = pricePerUnit * amount;
        require(order.depositedETH >= ethCost, "Not enough ETH in order");

        // Pull tokens from executor (scale to 18-decimal base units)
        require(
            energyToken.transferFrom(msg.sender, order.buyer, amount * TOKEN_DECIMALS),
            "Token transfer failed"
        );

        order.filledAmount += amount;
        order.depositedETH -= ethCost;

        // Pay ETH to executor
        payable(msg.sender).transfer(ethCost);

        if (order.filledAmount >= order.targetAmount) {
            order.active = false;
        }

        emit BuyOrderExecuted(orderId, amount, ethCost);
    }

    /**
     * @dev Execute a sell order at a given `pricePerUnit`.
     *      Caller (buyer) sends ETH; tokens are transferred from the locked deposit.
     *
     *      `pricePerUnit` >= order.minPricePerUnit must hold.
     */
    function executeSellOrder(uint256 orderId, uint256 amount)
        external
        payable
        nonReentrant
    {
        SellOrder storage order = sellOrders[orderId];
        require(order.active, "Order not active");
        require(amount > 0 && amount <= order.totalAmount - order.soldAmount, "Invalid amount");

        uint256 pricePerUnit = msg.value / amount;
        require(pricePerUnit >= order.minPricePerUnit, "Price too low");

        order.soldAmount += amount;

        // Transfer ETK to buyer (scale to 18-decimal base units)
        require(energyToken.transfer(msg.sender, amount * TOKEN_DECIMALS), "Token transfer failed");

        // Pay ETH to seller
        uint256 ethDue = order.minPricePerUnit * amount;
        payable(order.seller).transfer(ethDue);

        // Refund excess ETH to buyer
        if (msg.value > ethDue) {
            payable(msg.sender).transfer(msg.value - ethDue);
        }

        if (order.soldAmount >= order.totalAmount) {
            order.active = false;
        }

        emit SellOrderExecuted(orderId, amount, ethDue);
    }

    // ── Cancel Orders ────────────────────────────────────────────────────────

    /**
     * @dev Cancel a buy order and refund remaining ETH.
     */
    function cancelBuyOrder(uint256 orderId) external nonReentrant {
        BuyOrder storage order = buyOrders[orderId];
        require(order.buyer == msg.sender, "Not your order");
        require(order.active, "Order not active");

        order.active = false;
        uint256 refund = order.depositedETH;
        order.depositedETH = 0;

        payable(msg.sender).transfer(refund);

        emit BuyOrderCancelled(orderId, refund);
    }

    /**
     * @dev Cancel a sell order and refund remaining tokens.
     */
    function cancelSellOrder(uint256 orderId) external nonReentrant {
        SellOrder storage order = sellOrders[orderId];
        require(order.seller == msg.sender, "Not your order");
        require(order.active, "Order not active");

        order.active = false;
        uint256 remaining = order.totalAmount - order.soldAmount;

        require(energyToken.transfer(msg.sender, remaining * TOKEN_DECIMALS), "Token refund failed");

        emit SellOrderCancelled(orderId, remaining);
    }

    // ── View Helpers ─────────────────────────────────────────────────────────

    function getBuyOrder(uint256 orderId)
        external
        view
        returns (BuyOrder memory)
    {
        return buyOrders[orderId];
    }

    function getSellOrder(uint256 orderId)
        external
        view
        returns (SellOrder memory)
    {
        return sellOrders[orderId];
    }
}
