const path = require("path");

module.exports = {
    contracts_build_directory: path.join(__dirname, "src/abis"),
    contracts_directory: path.join(__dirname, "contracts"),
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "1337", // Match any network id
        },
    },
    compilers: {
        solc: {
            version: "0.8.6",
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
};
