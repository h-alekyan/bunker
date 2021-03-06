import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  bunkeraddress, nftaddress
} from '../config'


import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Bunker from '../artifacts/contracts/Bunker.sol/Bunker.json'
//import { SocketAddress } from 'net'

export default function Dashboad(){
    // Soring the nfts in two different useStates: one for sold nfts and one for unsold
    const [nfts, setNfts] = useState([])
    const [memberBalance, setMemberBalance] = useState('0')
    const [sold, setSold] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')


    useEffect(() => {
        loadNFTs()
      }, [])

    async function withdrawFunds() {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)    
      const signer = provider.getSigner()

      const marketContract = new ethers.Contract(bunkeraddress, Bunker.abi, signer)

      if (memberBalance == '0'){
        return 
      }

      let memberBalance = await marketContract.getMemberBalance()
      let result = marketContract.withdrawFunds(memberBalance);
      return (
        <div>{result}</div>
      )

    }

    async function loadNFTs(){
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)    
      const signer = provider.getSigner()
      
      // Establish reference to the contracts
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
      const marketContract = new ethers.Contract(bunkeraddress, Bunker.abi, signer)

      // Fetching the nfts created by the user
      const data = await marketContract.fetchItemsCreated()

      let memberBalanceUpdate = await marketContract.getMemberBalance()
      memberBalanceUpdate = ethers.utils.formatUnits(memberBalanceUpdate.toString(), 'ether')
      setMemberBalance(memberBalanceUpdate)


      // Mapping through the data to get a full object with nft image and metadata
      // Starting with unsold items
      const items = await Promise.all(data.map(async i => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId)
          const meta = await axios.get(tokenUri)
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
          let item = {
              price,
              tokenId: i.tokenId.toNumber(),
              seller: i.seller,
              owner: i.owner,
              image: meta.data.image,
          }
          return item
          }))

          const soldItems = items.filter(i => i.sold)

          // Set NFTs
          setNfts(items)

          // Set Sold NFTs
          setSold(soldItems)

          // Set state loaded
          setLoadingState('loaded')
      }

    if(loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets created</h1>)
    return(
        <div>
          <div class="mb-10 text-2xl flex font-light justify-center">
            <span class="font-mono bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              dashboard
            </span>
          </div>
        <div className="">
          <div className="text-l font-light text-zinc-200 mb-10">Balance: {memberBalance} MATIC 
          <button onClick={withdrawFunds} className="relative inline-flex items-center justify-center p-0.5 mb-2 ml-4 overflow-hidden font-medium text-zinc-200 rounded-3xl group bg-gradient-to-br from-pink-800 to-pink-900 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-transparent dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Withdraw
            </span>
        </button>
          </div>
        
          <div className="p-4">
          
            <div className="columns-4 gap-4 space-y-4 pb-32">
              {
                nfts.map((nft, i) => (
                  <div key={i} className="shadow rounded-xl overflow-hidden break-inside-avoid">
                    <img src={nft.image} className="rounded-t-xl" />
                    <div className="p-4 bg-gradient-to-r from-pink-900 to-violet-900">
                      <p className="text-white"><b>{nft.price}</b> MATIC</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div>
        {
        Boolean(sold.length) && (
          <div>
          <h2>Items Sold</h2>
          <div className="flex justify-center">
            <div className="p-4">
              <div className="columns-4 gap-4 space-y-4 pb-32">
                {
                  sold.map((nft, i) => (
                    <div key={i} className="shadow rounded-xl overflow-hidden break-inside-avoid">
                      <img src={nft.image} className="rounded" />
                      <div className="p-4 bg-black">
                        <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          </div>

        )
        }
        </div>
        </div>
    )
}


