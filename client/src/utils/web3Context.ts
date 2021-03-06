import Web3 from "web3";

declare let window: any;

let _web3Instance = null;

// const url = process.env.REACT_APP_DEV_ALCHEMY_URL;
const url =
    process.env.REACT_APP_ENV === "production"
        ? process.env.REACT_APP_PROD_ALCHEMY_URL
        : process.env.REACT_APP_DEV_ALCHEMY_URL;

if (url) {
    _web3Instance = new Web3(new Web3.providers.HttpProvider(url));
} else {
    _web3Instance = new Web3(window.ethereum);
}

export const web3Instance = _web3Instance;
