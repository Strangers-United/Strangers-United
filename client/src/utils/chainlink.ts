import { web3Instance } from "./web3Context";
import { AbiItem } from "web3-utils";
import { tokenList } from "./token";

export const aggregatorV3InterfaceABI = [
    {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "description",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
        name: "getRoundData",
        outputs: [
            { internalType: "uint80", name: "roundId", type: "uint80" },
            { internalType: "int256", name: "answer", type: "int256" },
            { internalType: "uint256", name: "startedAt", type: "uint256" },
            { internalType: "uint256", name: "updatedAt", type: "uint256" },
            { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "latestRoundData",
        outputs: [
            { internalType: "uint80", name: "roundId", type: "uint80" },
            { internalType: "int256", name: "answer", type: "int256" },
            { internalType: "uint256", name: "startedAt", type: "uint256" },
            { internalType: "uint256", name: "updatedAt", type: "uint256" },
            { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "version",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
];

export const getTokenToUSDRate = async (address: string, unit: number) => {
    try {
        const ETH_RATE_ADDRESS = tokenList.filter(
            (token) => token.token === "ETH"
        )[0]?.rateAddress;

        const priceFeed = new web3Instance.eth.Contract(
            aggregatorV3InterfaceABI as AbiItem[],
            address
        );
        const ethPriceFeed = new web3Instance.eth.Contract(
            aggregatorV3InterfaceABI as AbiItem[],
            ETH_RATE_ADDRESS
        );

        const roundData = await priceFeed.methods.latestRoundData().call();
        const weiPrice = roundData.answer;

        if (unit === 18) {
            const price = parseFloat(
                web3Instance.utils.fromWei(weiPrice, "ether")
            );

            // change ethPrice to usdPrice
            const ethRoundData = await ethPriceFeed.methods
                .latestRoundData()
                .call();
            const ethPrice = parseFloat(ethRoundData.answer) / 10 ** 8;

            console.log("==== ethPrice", price, ethPrice);
            return (price * ethPrice).toFixed(4);
        } else if (unit === 8) {
            return (parseFloat(weiPrice) / 10 ** 8).toFixed(4);
        }

        return weiPrice;
    } catch (err) {
        console.log("==== getTokenToUSDRate", err);
    }
};
