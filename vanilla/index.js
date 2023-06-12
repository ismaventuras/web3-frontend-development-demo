const metamaskButton = document.querySelector('#metamaskButton')
const connectError = document.querySelector('#connectError')
const currentBlockSpan = document.querySelector('#currentBlockSpan')
const balanceSpan = document.querySelector('#balanceSpan')
const accountSpan = document.querySelector('#accountSpan')
const currentChain = document.querySelector('#currentChain')
const switchToEthereum = document.querySelector('#switchToEthereum')
const switchToEthereumError = document.querySelector('#switchToEthereumError')
const switchToMoonbaseAlpha = document.querySelector('#switchToMoonbaseAlpha')
/*    
    - Check if there's a window.ethereum provider injected in the browser, if not then show an error
    - If there's a window.ethereum provider, then the following actions happens on button click:
        - window.ethereum provider asks the user to connect 
        - show account, chain, balance and current block on the DOM        
*/

/**
 * Send a JSON-RPC call to an ethereum node
 * @param {window.ethereum} provider 
 * @param {string} method 
 * @param {Array} params 
 * @returns A promise
 */
function sendCall(provider, method, params) {
    return provider.request({
        method,
        params
    })
}

async function switchToChain(chainId){
    const NETWORK_DATA = {
        1287:{
            chainId:'0x507',
            chainName:"Moonbase Alpha",
            rpcUrls: ['https://moonbase-alpha.public.blastapi.io'],  
            nativeCurrency: {
              name: "Moonbase Alpha",
              symbol: "DEV",
              decimals: 18,
            },
            blockExplorerUrls: ["https://moonbase.moonscan.io/"],
        },        
    }
    try {
        switchToEthereumError.innerHTML = ""
        const network = NETWORK_DATA[chainId]
        await sendCall( 
            window.ethereum,
            'wallet_addEthereumChain', 
            [network]
        )
    } catch (error) {
        if(error.code === -32602){
            try {
                await sendCall(window.ethereum,'wallet_switchEthereumChain', [{chainId:`0x${chainId.toString(16)}`}])                
            } catch (error) {
                console.log('switchToEthereum',error)
                switchToEthereumError.innerHTML = error.message
            }
        }else{
            console.log('switchToEthereum',error)
            switchToEthereumError.innerHTML = error.message
        }
    }
}

async function connectAndUpdateData(){
    connectError.innerHTML = '';
    try {
        // request 
        const requestAccount = await sendCall(window.ethereum, 'eth_requestAccounts', [])
        const account = requestAccount[0];
        if (!account) throw Error('Error while loading account')

        const promises = [
            sendCall(window.ethereum, 'eth_getBalance', [account]),
            sendCall(window.ethereum, 'eth_chainId', []),
            sendCall(window.ethereum, 'eth_blockNumber', [])
        ]
        const [balanceResponse, chainId, currentBlock] = await Promise.all(promises)

        const balance = (parseInt(balanceResponse, 16) / Math.pow(10, 18)).toFixed(2)
        const block = parseInt(currentBlock, 16).toLocaleString();

        currentBlockSpan.innerHTML = block
        accountSpan.innerHTML = account
        balanceSpan.innerHTML = balance
        currentChain.innerHTML = parseInt(chainId, 16)
    } catch (error) {
        connectError.innerHTML = error.message;
        console.log(error);
    }
}

if (!window.ethereum) {
    connectError.innerHTML = "No injected wallet. Please install Metamask";
}
else {    
    // Example listener for chain changed
    window.ethereum.on('chainChanged', (chainId) => {
        alert(`Chain changed to ${chainId}, reloading page...`)
        window.location.reload()
    })

    // switch and add chains 
    switchToEthereum.onclick = () => {switchToChain(1)}
    switchToMoonbaseAlpha.onclick = () => {switchToChain(1287)}
    // autoreconnect 
    sendCall(window.ethereum, 'eth_accounts', []).then( (accounts)=> connectAndUpdateData())
    
    metamaskButton.onclick = connectAndUpdateData
}