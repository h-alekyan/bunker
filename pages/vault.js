import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  bunkeraddress, nftaddress
} from '../config'


import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Bunker from '../artifacts/contracts/Bunker.sol/Bunker.json'

export default function Vault(){
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(() => {
        loadNFTs()
      }, [])

    async function loadNFTs(){
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)    
        const signer = provider.getSigner()

        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const marketContract = new ethers.Contract(bunkeraddress, Bunker.abi, signer)

        const data = await marketContract.fetchMyNFTs()

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
          setNfts(items)
          setLoadingState('loaded')
    }
    if(loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
    return (
      <div>
        <div class="mb-10 text-2xl flex font-light justify-center">
            <span class="font-mono bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              vault
            </span>
          </div>
        <div className="flex justify-center">
          <div className="p-4">
            <div className="columns-3 gap-4 space-y-4 pb-32">
              {
                nfts.map((nft, i) => (
                  <div key={i} className="shadow rounded-xl overflow-hidden break-inside-avoid">
                    <img src={nft.image} className="rounded-t" />
                    <div className="p-4 bg-gradient-to-r from-pink-900 to-violet-900">
                      <p className="text-white">Price - <b>{nft.price}</b> MATIC</p>
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