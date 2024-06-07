"use client";

import SendPayment from "./components/SendPayment";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  sepolia,
  baseSepolia,
  optimismSepolia,
  arbitrumSepolia,
  base,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "Crossmint Headless UI Demo",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || "",
  chains: [sepolia, baseSepolia, optimismSepolia, arbitrumSepolia, base],
  ssr: true,
});

const queryClient = new QueryClient();

const Page = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          <SendPayment />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Page;
