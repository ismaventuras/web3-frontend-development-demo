'use client'
import { useAccount, useBalance, useBlockNumber, useNetwork, useSwitchNetwork } from "wagmi"

export function Balance(){
    const {address} = useAccount()
    const {data, isLoading, isError} = useBalance({address:address})

    if (isLoading) return <div>Fetching balance…</div>
    if (isError) return <div>Error fetching balance</div>

    return(
        <div>
            <p>Balance: {data?.formatted}</p>
        </div>
    )
}

export function BlockNumber(){
    const {data,isError, isLoading} = useBlockNumber()

    if (isLoading) return <div>Fetching block number…</div>
    if (isError) return <div>Error fetching block number</div>
  
    return <div>Block number: {data?.toString()}</div>
}

export function Account(){
    const {address} = useAccount()

    return(
        <div>
            <p>address</p>
            <p className="w-full break-all text-center">{address}</p>
        </div>
    )
}

export function SwitchChain(){
    const { chain } = useNetwork()
    const { chains, error, isLoading, pendingChainId, switchNetwork } =
      useSwitchNetwork()
   
    return (
      <div className="">
        {chain && <div>Connected to {chain.name}</div>}
        <div className="flex gap-4 flex-wrap">
            {chains.map((x) => (
            <button
                disabled={!switchNetwork || x.id === chain?.id}
                key={x.id}
                onClick={() => switchNetwork?.(x.id)}
                className="px-2 py-1 border disabled:opacity-25 disabled:cursor-not-allowed"
            >
                {x.name}
                {isLoading && pendingChainId === x.id && ' (switching)'}
            </button>
            ))}
        </div>
   
        <div>{error && error.message}</div>
      </div>
    )
}

export default function Example(){
    const {isConnected} =useAccount()
    if(!isConnected) return 'connect your wallet'
    return(
    <div className="flex flex-col gap-2">
        <Account/>
        <Balance/>
        <BlockNumber/>
        <SwitchChain />
      </div>
    )
}