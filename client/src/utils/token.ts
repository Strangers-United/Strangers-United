export const tokenList = [
    {
        address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        token: "DAI",
    },
    {
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        token: "Tether USD",
    },
    {
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        token: "USD Coin",
    },
] as IToken[];

export const rinkebyTokenList = [
    {
        address: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
        token: "DAI",
    },
    {
        address: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b",
        token: "USD Coin",
    },
];

export interface IToken {
    address: string;
    token: string;
}

export const abi = [
    // balanceOf
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
    // decimals
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        type: "function",
    },
    // name
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        type: "function",
    },
    // symbol
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        type: "function",
    },
];
