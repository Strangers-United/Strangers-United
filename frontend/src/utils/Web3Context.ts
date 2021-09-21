import Web3 from "web3";

declare let window: any;

let _web3Instance = null;
_web3Instance = new Web3(window.ethereum);

export const web3Instance = _web3Instance;
