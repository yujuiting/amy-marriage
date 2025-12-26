"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useDonate } from "@/hooks/useDonate";
import { useEthPrice, formatUsd } from "@/hooks/useEthPrice";

export function DonationForm() {
  const { isConnected } = useAccount();
  const { donate, isPending, isSuccess, hash, error } = useDonate();
  const { ethPrice, isLoading: isPriceLoading } = useEthPrice();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [localError, setLocalError] = useState("");

  const usdValue =
    ethPrice && amount && !isNaN(parseFloat(amount))
      ? parseFloat(amount) * ethPrice
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!name.trim()) {
      setLocalError("Please enter your name");
      return;
    }
    if (!message.trim()) {
      setLocalError("Please enter a congratulation message");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setLocalError("Please enter a valid amount");
      return;
    }

    try {
      await donate({ name, message, amount });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Failed to send donation");
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center gold-text">
        Send Your Blessings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="input-romantic w-full px-4 py-3 rounded-xl"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Congratulation Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your heartfelt message to Amy..."
            rows={3}
            className="input-romantic w-full px-4 py-3 rounded-xl resize-none"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Amount (ETH)</label>
          <input
            type="number"
            step="0.001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
            className="input-romantic w-full px-4 py-3 rounded-xl"
            disabled={isPending}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs opacity-60">
              Sending on Base network (low fees ~$0.01)
            </p>
            {usdValue !== null && (
              <p className="text-sm font-medium" style={{ color: "var(--gold)" }}>
                ≈ {formatUsd(usdValue)}
              </p>
            )}
            {isPriceLoading && amount && (
              <p className="text-xs opacity-60">Loading price...</p>
            )}
          </div>
          {ethPrice && (
            <p className="text-xs opacity-50 mt-1">
              1 ETH = {formatUsd(ethPrice)} (via Chainlink)
            </p>
          )}
        </div>

        {(localError || error) && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-red-700 text-sm">
            {localError || error?.message}
          </div>
        )}

        {isSuccess && hash && (
          <div className="p-3 bg-green-100 border border-green-300 rounded-xl text-green-700 text-sm">
            Donation sent successfully!{" "}
            <a
              href={`https://sepolia.basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View transaction
            </a>
          </div>
        )}

        <div className="pt-4 space-y-3">
          {!isConnected ? (
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-3">
                <ConnectButton />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full py-4 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Sending..." : "Send Blessings"}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
