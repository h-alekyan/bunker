const hre = require("hardhat");

async function main() {

  const Bunker = await hre.ethers.getContractFactory("Bunker");
  const bunker = await Bunker.deploy();

  await bunker.deployed();

  console.log("Bunker deployed to:", bunker.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(bunker.address);

  await nft.deployed();

  console.log("NFT deployed to: ", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
