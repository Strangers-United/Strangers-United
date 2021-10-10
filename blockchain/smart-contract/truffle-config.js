const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config({ path: __dirname + "/../.env" });
const { API_URL, MNEMONIC } = process.env;

module.exports = {
    contracts_build_directory: path.join(__dirname, "build/artifacts"),
    contracts_directory: path.join(__dirname, "contracts"),
    networks: {
        development: {
            host: "127.0.0.1", // Localhost (default: none)
            port: 8545, // Standard Ethereum port (default: none)
            network_id: "*", // Any network (default: none)
        },
        rinkeby: {
            host: "localhost",
            provider: function () {
                return new HDWalletProvider(MNEMONIC, API_URL);
            },
            network_id: 4,
            gas: 6700000,
            gasPrice: 10000000000,
        },
    },
    // Set default mocha options here, use special reporters etc.
    mocha: {
        // timeout: 100000
    },
    // Configure your compilers
    compilers: {
        solc: {
            version: "0.8.6", // Fetch exact version from solc-bin (default: truffle's version)
            // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
            settings: {
                // See the solidity docs for advice about optimization and evmVersion
                optimizer: {
                    enabled: true,
                    runs: 200,
                },
                //  evmVersion: "byzantium"
            },
        },
    },
    db: {
        enabled: false,
    },
};
