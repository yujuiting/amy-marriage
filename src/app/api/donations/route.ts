import { AMY_ADDRESS } from "@/lib/config";
import { NextResponse } from "next/server";
import { createPublicClient, decodeAbiParameters, formatEther, http } from "viem";
import { base, baseSepolia } from "viem/chains";

export interface Donation {
  hash: string;
  from: string;
  value: string;
  name: string;
  message: string;
  timestamp: number;
  blockNumber: number;
}

const chain = process.env.NEXT_PUBLIC_CHAIN === "base" ? base : baseSepolia;

const client = createPublicClient({
  chain,
  transport: http(process.env.RPC_URL),
});

function decodeDonationData(input: string): { name: string; message: string } | null {
  if (!input || input === "0x" || input.length < 10) {
    return null;
  }
  try {
    const decoded = decodeAbiParameters(
      [
        { type: "string", name: "name" },
        { type: "string", name: "message" },
      ],
      input as `0x${string}`
    );
    return {
      name: decoded[0],
      message: decoded[1],
    };
  } catch {
    return null;
  }
}

const BLOCKS_TO_SCAN = 100n;

export async function GET() {
  try {
    const latestBlock = await client.getBlockNumber();
    const fromBlock = latestBlock > BLOCKS_TO_SCAN ? latestBlock - BLOCKS_TO_SCAN : 0n;

    const donations: Donation[] = [];

    // Scan blocks in batches to find transactions to Amy's address
    const batchSize = 100n;

    for (let start = latestBlock; start > fromBlock && donations.length < 50; start -= batchSize) {
      const end = start - batchSize > fromBlock ? start - batchSize : fromBlock;

      // Fetch blocks with transactions in parallel
      const blockPromises: Promise<Donation[]>[] = [];

      for (let blockNum = start; blockNum > end; blockNum--) {
        blockPromises.push(
          client.getBlock({ blockNumber: blockNum, includeTransactions: true })
            .then((block) => {
              const blockDonations: Donation[] = [];

              for (const tx of block.transactions) {
                if (
                  typeof tx !== "string" &&
                  tx.to?.toLowerCase() === AMY_ADDRESS.toLowerCase() &&
                  tx.value > 0n
                ) {
                  const decoded = decodeDonationData(tx.input);
                  blockDonations.push({
                    hash: tx.hash,
                    from: tx.from,
                    value: formatEther(tx.value),
                    name: decoded?.name || "Anonymous",
                    message: decoded?.message || "",
                    timestamp: Number(block.timestamp) * 1000,
                    blockNumber: Number(block.number),
                  });
                }
              }

              return blockDonations;
            })
            .catch(() => [])
        );
      }

      const results = await Promise.all(blockPromises);
      donations.push(...results.flat());
    }

    // Sort by timestamp descending
    donations.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({ donations: donations.slice(0, 50) });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { donations: [], error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}
