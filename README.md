# Bunker - NFT Marketplace that pays active users

![bunker main](https://i.ibb.co/6nqBHXs/download-9.jpg)

Bunker is an NFT Marketplace that shares its revenue from listing fees and sale comissions equally among all users who have purchased items in the past.


## Simple features
### Upload and Sell NFT
![bunker sell](https://i.ibb.co/YR4M3nS/download-6.jpg)

### Store purchased NFTs in your Vault
![bunker vault](https://i.ibb.co/n19h72r/download-11.jpg)

### Manage your dashboard of all NFTs that you have uploaded and sold
![bunker dashboard](https://i.ibb.co/8mKjCkx/download-8.jpg)


## Play around locally

You will need Node installed on your computer. 

Start by simple installation

```
cd bunker
npm install
```

Once successfully installed open another command line window and run:

```
npx hardhat node
```

You will be given a list of wallets with private keys (these are not real ethereum wallets, please use them for local dev purposes only). Once this is done, deploy a local network by doing the following:

```
npx hardhat run scripts/deploy.js --network localhost
```

You will be given the network credentials, copy them and store them in the config.js file. <br>

Once this is done, you can run

```
npm run dev
``` 

and the marketplace should be running normally. Use one of the wallets provided by hardhat to test things out (i.e., uploading NFTs, buying, selling, etc).

## Deploying on the Polygon Mainnet

The deployment configurations are given both for the testnet and the mainnet. Just place your URL from Infura into the hardhat.config.js file.







