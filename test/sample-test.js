const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bunker", function () {
  it("Should create and execute sales", async function () {
    const Market = await ethers.getContractFactory("Bunker")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address 
    
    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('10', 'ether')

    await nft.createToken("https://www..link.com")
    await nft.createToken("https://www.link2.com")

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {value: listingPrice})
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {value: listingPrice})
    
    const [_, buyerAddress] = await ethers.getSigners()

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {value: auctionPrice})

    const items = await market.fetchMarketItems()
    console.log('items: ', items)
  
  });
});
