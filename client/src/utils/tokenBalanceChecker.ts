import { web3Instance } from "./web3Context";
import { AbiItem } from "web3-utils";

import contract from "../abis/TokenBalanceChecker.json";

const contractAddress = process.env
    .REACT_APP_TOKEN_BALANCE_CHECKER_CONTRACT as string;

const TokenBalanceCheckerContract = new web3Instance.eth.Contract(
    contract.abi as AbiItem[],
    contractAddress
);

export default TokenBalanceCheckerContract;
