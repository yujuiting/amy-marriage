// Chainlink Price Feed addresses
// Base Sepolia: https://docs.chain.link/data-feeds/price-feeds/addresses?network=base&page=1
// Base Mainnet: https://docs.chain.link/data-feeds/price-feeds/addresses?network=base&page=1

export const CHAINLINK_ETH_USD_ADDRESS = {
  // Base Mainnet
  8453: "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70",
  // Base Sepolia
  84532: "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1",
} as const;

// Chainlink Aggregator V3 Interface ABI (only the functions we need)
export const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
