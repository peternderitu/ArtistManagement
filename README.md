# ArtistManagement
Description
A smart contract written to manage artists affairs and create a music store for their art. Its deployed on the Ropsten test network.
The project aims at automating and helping independent artists manage, sell and transparently earn majority of revenues from their art.

Project Directory
.
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

Quick Start
1. Clone project
2. cd into project directory
	cd ArtistManagement
3. Download node libraries
	npm install
4. Download/Start ganache
	ganache-cli
5. Compile contracts
	truffle compile
6. Migrate
	truffle migrate
7. Run tests
	truffle test
8. Deploying on ropsten test network
	truffle migrate --network ropsten
9. Start FrontEnd
	npm run dev
# Foobar

Foobar is a Python library for dealing with word pluralization.

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install foobar.

```bash
pip install foobar
```

## Usage

```python
import foobar

foobar.pluralize('word') # returns 'words'
foobar.pluralize('goose') # returns 'geese'
foobar.singularize('phenomena') # returns 'phenomenon'
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
