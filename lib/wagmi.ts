import { http } from "wagmi";
import { defineChain } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// Define OPN Testnet as a custom chain
export const opnTestnet = defineChain({
  id: 984,
  name: "OPN Testnet",
  nativeCurrency: {
    name: "OPN",
    symbol: "OPN",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.iopn.tech"],
    },
  },
  blockExplorers: {
    default: {
      name: "OPN Explorer",
      url: "https://testnet.iopn.tech",
    },
  },
  testnet: true,
});

// Wagmi config using RainbowKit's getDefaultConfig
export const config = getDefaultConfig({
  appName: "Open Payroll",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [opnTestnet],
  transports: {
    [opnTestnet.id]: http("https://testnet-rpc.iopn.tech"),
  },
  ssr: true,
});