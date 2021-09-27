import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

export const network = new NetworkConnector({
    urls: {
        // 1337: "http://localhost:7545",
    },
    defaultChainId: 1,
});

export const injectedConnector = new InjectedConnector({
    supportedChainIds: [
        1, // Mainet
        3, // Ropsten
        4, // Rinkeby
        5, // Goerli
        42, // Kovan
        1337, // local
    ],
});
