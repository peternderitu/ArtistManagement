# ArtistManagement
# Description
A smart contract written to manage artists affairs and create a music store for their art. Its deployed on the Ropsten test network.
The project aims at automating and helping independent artists manage, sell and transparently earn majority of revenues from their art.

## Project Directory
```bash.
├── bs-config.json
├── build
│   └── contracts
│       ├── ArtistManagement.json
│       ├── Migrations.json
│       └── SafeMath.json
├── contracts
│   ├── ArtistManagement.sol
│   ├── Migrations.sol
│   └── SafeMath.sol
├── migrations
│   ├── 1_initial_migration.js
│   └── 2_deploy_contracts.js
├── package-lock.json
├── package.json
├── src
│   ├── abi.json
│   ├── index.html
│   ├── js
│   │   ├── app.js
│   │   ├── ipfs.js
│   │   └── truffle-contract.js
│   └── style.css
├── test
│   ├── artist_management.test.js
│   └── exceptionsHelpers.js
└── truffle-config.js
```
## Usage
1. Clone project
2. cd into project directory
	```bash
	cd ArtistManagement
	```
3. Download node libraries
	```bash
	npm install
	```
4. Download/Start ganache
	```bash
	ganache-cli
	```
5. Compile contracts
	```bash
	truffle compile
	```
6. Migrate
	```bash
	truffle migrate
	```
7. Run tests
	```bash
	truffle test
	```
8. Deploying on ropsten test network
	```bash
	truffle migrate --network ropsten
	```
9. Start FrontEnd
	```bash
	npm run dev
	```

## License
[MIT](https://choosealicense.com/licenses/mit/)
