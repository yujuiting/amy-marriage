"use client";

import { useState } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, encodeAbiParameters } from "viem";
import { AMY_ADDRESS } from "@/lib/config";

interface DonateParams {
  name: string;
  message: string;
  amount: string;
}

export function useDonate() {
  const { address, isConnected } = useAccount();
  const [isPending, setIsPending] = useState(false);

  const { data: hash, sendTransaction, error: sendError } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const donate = async ({ name, message, amount }: DonateParams) => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected");
    }

    if (!amount || parseFloat(amount) <= 0) {
      throw new Error("Invalid amount");
    }

    setIsPending(true);

    try {
      const data = encodeAbiParameters(
        [
          { type: "string", name: "name" },
          { type: "string", name: "message" },
        ],
        [name, message]
      );

      sendTransaction({
        to: AMY_ADDRESS,
        value: parseEther(amount),
        data,
      });
    } catch (err) {
      setIsPending(false);
      throw err;
    }
  };

  return {
    donate,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
    error: sendError,
  };
}
