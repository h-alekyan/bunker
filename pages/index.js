import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftaddress, bunkeraddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Bunker from '../artifacts/contracts/Bunker.sol/Bunker.json'


export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() =>{
    loadNFTs()

  },[])

  async function loadNFTs(){
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(bunkeraddress, Bunker.abi, provider)

    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i=> {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price, 
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))

    setNfts(items)
    setLoadingState('loaded')
  } if (loadingState === 'loaded' && !nfts.length) return (
    <h1 className="px-20 py-10 text-3xl">No items to show</h1>
  )

  async function buyNft(nft){
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)

    const signer = provider.getSigner()
    const contract = new ethers.Contract(bunkeraddress, Bunker.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {value: price})

    await transaction.wait()
    
    loadNFTs()

  }

  return (
    <div className="">
      <div className="px-4" style={{maxWidth: '1600px'}}>
        <div className="columns-4 gap-4 space-y-4 pb-32">
          {
            nfts.map((nft, i) => (
              <div key={i} className="shadow rounded-xl overflow-hidden break-inside-avoid">
                <img src={nft.image} />
                <div className="p-4 bg-zinc-50">
                  <p className="text-xl font semibold text-stone-900">{nft.name}</p>
                  <p className="text-gray-400 mb-2 mt-2">{nft.description}</p>
                  <p className='text-xl mb-4 font-bol text-stone-900'>{nft.price} MATIC</p>
                  <button className='w-full bg-stone-700 text-white font-bold py-2 px-12 rounded' onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            )
          )
          }
        </div>
      </div>
    </div>
  )
}

// for grid -> grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4