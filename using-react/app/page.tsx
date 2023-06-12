import ConnectButton from "./components/ConnectButton";
import Example, { Balance, BlockNumber } from "./components/Examples";

export default function Home() {
  return (
    <div className="mt-24 flex flex-col items-center p-2">
      <p>nextjs wagmi/viem demo</p>
      <ConnectButton/>
      <Example/>
    </div>
  )
}
