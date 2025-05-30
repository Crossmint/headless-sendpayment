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
  polygonAmoy,
  zoraSepolia,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { defineChain, Chain } from "viem";

const worldchain = defineChain({
  id: 480,
  name: 'World Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://worldchain.drpc.org'] },
  },
  blockExplorers: {
    default: { name: 'World Chain Explorer', url: 'https://worldscan.org' },
  },
})

const config = getDefaultConfig({
  appName: "Headless Send Payment Demo",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || "",
  chains: [
    worldchain,
    sepolia,
    baseSepolia,
    optimismSepolia,
    arbitrumSepolia,
    base,
    polygonAmoy,
    zoraSepolia,
  ],
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



