"use client";

import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";

import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const customTheme = lightTheme({
  accentColor: "#d4af37",
  accentColorForeground: "#4a3728",
  borderRadius: "medium",
  fontStack: "system",
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
