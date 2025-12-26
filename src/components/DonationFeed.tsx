"use client";

import { useDonations } from "@/hooks/useDonations";
import { useEthPrice, formatUsd } from "@/hooks/useEthPrice";

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DonationFeed() {
  const { donations, isLoading } = useDonations();
  const { ethPrice } = useEthPrice();

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center gold-text">
          Recent Blessings
        </h2>
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-center">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }}></div>
            <p className="text-sm opacity-60">Loading donations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center gold-text">
          Recent Blessings
        </h2>
        <div className="text-center py-8 opacity-60">
          <p>No donations yet.</p>
          <p className="text-sm mt-2">Be the first to send blessings to Amy!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-center gold-text">
        Recent Blessings
      </h2>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {donations.map((donation) => {
          const ethAmount = parseFloat(donation.value);
          const usdValue = ethPrice ? ethAmount * ethPrice : null;

          return (
            <div
              key={donation.hash}
              className="bg-white/50 rounded-xl p-4 border border-rose-dark/20 transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold" style={{ color: "var(--gold)" }}>
                  {donation.name}
                </span>
                <div className="text-right">
                  <span className="text-sm font-bold block" style={{ color: "var(--foreground)" }}>
                    {ethAmount.toFixed(4)} ETH
                  </span>
                  {usdValue !== null && (
                    <span className="text-xs opacity-60">
                      ≈ {formatUsd(usdValue)}
                    </span>
                  )}
                </div>
              </div>
              {donation.message && (
                <p className="text-sm mb-2 italic" style={{ color: "var(--foreground)" }}>
                  &ldquo;{donation.message}&rdquo;
                </p>
              )}
              <div className="flex justify-between items-center text-xs opacity-50">
                <a
                  href={`https://sepolia.basescan.org/address/${donation.from}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {formatAddress(donation.from)}
                </a>
                <span>{formatTime(donation.timestamp)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
