'use client'
import { useConnect , useAccount, useDisconnect} from "wagmi"

export default function ConnectButton(){
    const {connect, connectors} = useConnect()
    const {isConnected} = useAccount()
    const {disconnect} = useDisconnect()

    return(
        <div className="">
            {isConnected ?
            <div className="flex flex-wrap gap-2 items-center justify-center">                
                <button className="py-1 px-2 border rounded m-2" onClick={()=> disconnect()}>Disconnect</button>
            </div>
            :
            <button onClick={() => connect({connector:connectors[0]})} className="py-1 px-2 border rounded m-2">
                Connect
            </button>
            }
        </div>
    )
}