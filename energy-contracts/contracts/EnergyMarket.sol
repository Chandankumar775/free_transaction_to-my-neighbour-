// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract EnergyMarket is ReentrancyGuard {
    IERC20 public energyToken;

    struct Listing {
        address seller;
        uint256 amount;
        uint256 price; // Price in Wei for the entire amount
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public listingCount;

    event EnergyListed(uint256 indexed listingId, address indexed seller, uint256 amount, uint256 price);
    event EnergyBought(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 amount, uint256 price);
    event ListingCancelled(uint256 indexed listingId);

    constructor(address _energyToken) {
        energyToken = IERC20(_energyToken);
    }

    /**
     * @dev List energy for sale. Seller must approve the market contract to spend ETK.
     */
    function listEnergy(uint256 amount, uint256 price) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(price > 0, "Price must be > 0");
        require(energyToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        listingCount++;
        listings[listingCount] = Listing({
            seller: msg.sender,
            amount: amount,
            price: price,
            active: true
        });

        emit EnergyListed(listingCount, msg.sender, amount, price);
    }

    /**
     * @dev Buy listed energy.
     */
    function buyEnergy(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");

        listing.active = false;

        // Transfer energy tokens to buyer
        require(energyToken.transfer(msg.sender, listing.amount), "Energy transfer failed");

        // Transfer ETH to seller
        (bool sent, ) = payable(listing.seller).call{value: listing.price}("");
        require(sent, "ETH transfer failed");

        // Refund excess ETH if any
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }

        emit EnergyBought(listingId, msg.sender, listing.seller, listing.amount, listing.price);
    }

    /**
     * @dev Cancel a listing and retrieve tokens.
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.active, "Listing not active");

        listing.active = false;
        require(energyToken.transfer(msg.sender, listing.amount), "Transfer failed");

        emit ListingCancelled(listingId);
    }
}
