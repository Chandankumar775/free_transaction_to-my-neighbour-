// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title EnergyStaking
 * @dev Stake ETK tokens and earn rewards over time.
 *      Reward rate = rewardRatePerSecond * stakedAmount / 1e18 (per second)
 */
contract EnergyStaking is ReentrancyGuard, Ownable {
    IERC20 public energyToken;

    /// @dev Reward tokens emitted per second per staked token (scaled by 1e18).
    ///      Default: 1e14 ≈ 0.0001 ETK/s per staked ETK → ~315% APY (demo friendly).
    uint256 public rewardRatePerSecond;

    uint256 public totalStaked;

    struct StakeInfo {
        uint256 amount;        // staked ETK (in wei units)
        uint256 lastStakeTime; // timestamp of last interaction
    }

    mapping(address => StakeInfo) public stakes;

    // ─── Reward pool tracking ────────────────────────────────────────────────
    uint256 public rewardPool; // ETK deposited by owner as rewards

    // ─── Events ──────────────────────────────────────────────────────────────
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardPoolFunded(uint256 amount);
    event RewardRateUpdated(uint256 newRate);

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor(address _energyToken, address initialOwner)
        Ownable(initialOwner)
    {
        energyToken = IERC20(_energyToken);
        rewardRatePerSecond = 1e14; // adjustable
    }

    // ── Core Functions ─────────────────────────────────────────────────────

    /**
     * @dev Stake `amount` ETK. Pending rewards are harvested first.
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");

        // Harvest first so the new stake doesn't earn from the past
        _harvest(msg.sender);

        require(
            energyToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        stakes[msg.sender].amount += amount;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Unstake `amount` ETK. Pending rewards are harvested first.
     */
    function unstake(uint256 amount) external nonReentrant {
        StakeInfo storage info = stakes[msg.sender];
        require(info.amount >= amount, "Insufficient staked balance");

        _harvest(msg.sender);

        info.amount -= amount;
        totalStaked -= amount;

        require(energyToken.transfer(msg.sender, amount), "Transfer failed");

        emit Unstaked(msg.sender, amount);
    }

    /**
     * @dev Harvest (claim) pending rewards without unstaking.
     */
    function claimReward() external nonReentrant {
        _harvest(msg.sender);
    }

    // ── View Functions ─────────────────────────────────────────────────────

    /**
     * @dev Returns the pending (unclaimed) reward for a user.
     */
    function pendingReward(address user) public view returns (uint256) {
        StakeInfo storage info = stakes[user];
        if (info.amount == 0 || info.lastStakeTime == 0) return 0;

        uint256 elapsed = block.timestamp - info.lastStakeTime;
        return (info.amount * rewardRatePerSecond * elapsed) / 1e18;
    }

    /**
     * @dev Returns staked amount and pending reward for a user.
     */
    function getStakeInfo(address user)
        external
        view
        returns (uint256 stakedAmount, uint256 pending)
    {
        return (stakes[user].amount, pendingReward(user));
    }

    // ── Owner Functions ────────────────────────────────────────────────────

    /**
     * @dev Owner funds the reward pool so the contract can pay out rewards.
     */
    function fundRewardPool(uint256 amount) external onlyOwner {
        require(
            energyToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        rewardPool += amount;
        emit RewardPoolFunded(amount);
    }

    /**
     * @dev Adjust reward emission rate.
     */
    function setRewardRate(uint256 _ratePerSecond) external onlyOwner {
        rewardRatePerSecond = _ratePerSecond;
        emit RewardRateUpdated(_ratePerSecond);
    }

    // ── Internal ───────────────────────────────────────────────────────────

    function _harvest(address user) internal {
        uint256 reward = pendingReward(user);
        stakes[user].lastStakeTime = block.timestamp;

        if (reward > 0 && rewardPool >= reward) {
            rewardPool -= reward;
            require(
                energyToken.transfer(user, reward),
                "Reward transfer failed"
            );
            emit RewardClaimed(user, reward);
        }
    }
}
