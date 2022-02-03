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
    const [sold, setSold] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')


    useEffect(() => {
        loadNFTs()
      }, [])

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
        <div className="">
          <div className="p-4">
            <div className="columns-4 gap-4 space-y-4 pb-32">
              {
                nfts.map((nft, i) => (
                  <div key={i} className="shadow rounded-xl overflow-hidden break-inside-avoid">
                    <img src={nft.image} className="rounded" />
                    <div className="p-4 bg-black">
                      <p className="text-xl font-bold text-white">{nft.price} MATIC</p>
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


