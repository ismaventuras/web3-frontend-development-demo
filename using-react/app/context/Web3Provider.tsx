'use client'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { polygonMumbai, moonbaseAlpha, mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygonMumbai, moonbaseAlpha],
  /*
    If a provider does not support a chain, it will fall back onto the next one in the array. 
    If no RPC URLs are found, configureChains will throw an error.
  */
  [publicProvider()]
)

// Set up wagmi config
const config = createConfig({
  //Enables reconnecting to last used connector on mount. Defaults to false.
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({ chains }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  
  // You can create a "chain-aware" provider by using the configureChains API or passing a function that updates based on chainId.
  //    publicClient: publicClient({chainId:1}),
  publicClient,
  webSocketPublicClient,
})

// Pass config to React Context Provider
export default function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  )
}
