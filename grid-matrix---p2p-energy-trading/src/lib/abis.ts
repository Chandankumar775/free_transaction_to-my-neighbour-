/**
 * src/lib/abis.ts
 *
 * Minimal-but-complete ABIs for all deployed contracts.
 * These are generated from the Solidity source automatically on compile
 * (artifacts/contracts/…/name.json → abi field).
 * Hard-coded here so the frontend works without a build step.
 */

export const EnergyTokenABI = [
  // ERC-20 standard
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  // Extra
  "function mint(address to, uint256 amount)",
  "function consume(uint256 amount)",
  "function owner() view returns (address)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
] as const;

export const EnergyMarketABI = [
  "function listingCount() view returns (uint256)",
  "function listings(uint256 id) view returns (address seller, uint256 amount, uint256 price, bool active)",
  "function listEnergy(uint256 amount, uint256 price)",
  "function buyEnergy(uint256 listingId) payable",
  "function cancelListing(uint256 listingId)",
  "function energyToken() view returns (address)",
  // Events
  "event EnergyListed(uint256 indexed listingId, address indexed seller, uint256 amount, uint256 price)",
  "event EnergyBought(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 amount, uint256 price)",
  "event ListingCancelled(uint256 indexed listingId)",
] as const;

export const EnergyStakingABI = [
  "function stake(uint256 amount)",
  "function unstake(uint256 amount)",
  "function claimReward()",
  "function fundRewardPool(uint256 amount)",
  "function setRewardRate(uint256 _ratePerSecond)",
  "function pendingReward(address user) view returns (uint256)",
  "function getStakeInfo(address user) view returns (uint256 stakedAmount, uint256 pending)",
  "function stakes(address) view returns (uint256 amount, uint256 lastStakeTime)",
  "function totalStaked() view returns (uint256)",
  "function rewardPool() view returns (uint256)",
  "function rewardRatePerSecond() view returns (uint256)",
  "function energyToken() view returns (address)",
  // Events
  "event Staked(address indexed user, uint256 amount)",
  "event Unstaked(address indexed user, uint256 amount)",
  "event RewardClaimed(address indexed user, uint256 reward)",
  "event RewardPoolFunded(uint256 amount)",
] as const;

export const AutoTradeABI = [
  "function buyOrderCount() view returns (uint256)",
  "function sellOrderCount() view returns (uint256)",
  "function getBuyOrder(uint256 orderId) view returns (address buyer, uint256 maxPricePerUnit, uint256 targetAmount, uint256 filledAmount, uint256 depositedETH, bool active)",
  "function getSellOrder(uint256 orderId) view returns (address seller, uint256 minPricePerUnit, uint256 totalAmount, uint256 soldAmount, bool active)",
  "function placeBuyOrder(uint256 maxPricePerUnit, uint256 targetAmount) payable",
  "function placeSellOrder(uint256 minPricePerUnit, uint256 totalAmount)",
  "function executeBuyOrder(uint256 orderId, uint256 amount, uint256 pricePerUnit)",
  "function executeSellOrder(uint256 orderId, uint256 amount) payable",
  "function cancelBuyOrder(uint256 orderId)",
  "function cancelSellOrder(uint256 orderId)",
  "function energyToken() view returns (address)",
  // Events
  "event BuyOrderPlaced(uint256 indexed orderId, address indexed buyer, uint256 maxPricePerUnit, uint256 targetAmount, uint256 depositedETH)",
  "event SellOrderPlaced(uint256 indexed orderId, address indexed seller, uint256 minPricePerUnit, uint256 totalAmount)",
  "event BuyOrderCancelled(uint256 indexed orderId, uint256 ethRefunded)",
  "event SellOrderCancelled(uint256 indexed orderId, uint256 tokensRefunded)",
] as const;
