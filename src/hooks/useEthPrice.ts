"use client";

import { useReadContracts, useChainId } from "wagmi";
import { CHAINLINK_ETH_USD_ADDRESS, aggregatorV3InterfaceABI } from "@/lib/chainlink";

export function useEthPrice() {
  const chainId = useChainId();

  const priceFeedAddress = CHAINLINK_ETH_USD_ADDRESS[chainId as keyof typeof CHAINLINK_ETH_USD_ADDRESS];

  const { data, isLoading, error } = useReadContracts({
    contracts: [
      {
        address: priceFeedAddress,
        abi: aggregatorV3InterfaceABI,
        functionName: "latestRoundData",
      },
      {
        address: priceFeedAddress,
        abi: aggregatorV3InterfaceABI,
        functionName: "decimals",
      },
    ],
    query: {
      enabled: !!priceFeedAddress,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  const latestRoundData = data?.[0]?.result;
  const decimals = data?.[1]?.result;

  let ethPrice: number | null = null;

  if (latestRoundData && decimals !== undefined) {
    const price = latestRoundData[1]; // answer is at index 1
    ethPrice = Number(price) / Math.pow(10, Number(decimals));
  }

  return {
    ethPrice,
    isLoading,
    error,
  };
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
