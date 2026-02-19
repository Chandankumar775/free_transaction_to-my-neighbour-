// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EnergyToken
 * @dev Represents 1 kWh of energy as 1 unit.
 */
contract EnergyToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("Energy Token", "ETK") Ownable(initialOwner) {}

    /**
     * @dev Mint energy tokens to a user based on generation.
     * In a real system, this would be called by a verified Smart Meter.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens when energy is consumed.
     */
    function consume(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
