export const tokenList = [
    {
        address: "0x0000000000000000000000000000000000000000",
        rateAddress: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        decimal: 8,
        ratePair: "USD",
        token: "ETH",
        name: "Ethereum",
    },
    {
        address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
        rateAddress: "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9",
        decimal: 8,
        ratePair: "USD",
        token: "AAVE",
        name: "Aave",
    },
    // {
    //     address: "0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab",
    //     rateAddress: "",
    //     decimal: 0,
    //     token: "MIST",
    //     name: "Alchemist",
    // },
    {
        address: "0xba100000625a3754423978a60c9317c58a424e3d",
        rateAddress: "0xC1438AA3823A6Ba0C159CfA8D98dF5A994bA120b",
        decimal: 18,
        ratePair: "ETH",
        token: "BAL",
        name: "Balancer",
    },
    {
        address: "0x514910771af9ca656af840dff83e8264ecf986ca",
        rateAddress: "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c",
        decimal: 8,
        ratePair: "USD",
        token: "LINK",
        name: "Chainlink",
    },
    {
        address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
        rateAddress: "0xCd627aA160A6fA45Eb793D19Ef54f5062F20f33f",
        decimal: 8,
        ratePair: "USD",
        token: "CRV",
        name: "Curve DAO Token",
    },
    {
        address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        rateAddress: "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9",
        decimal: 8,
        ratePair: "USD",
        token: "DAI",
        name: "Dai",
    },
    // {
    //     address: "0x92d6c1e31e14520e676a687f0a93788b716beff5",
    //     rateAddress: "",
    //     decimal: 0,
    //     token: "DYDX",
    //     name: "dYdX",
    // },
    {
        address: "0x6810e776880c02933d47db1b9fc05908e5386b96",
        rateAddress: "0xA614953dF476577E90dcf4e3428960e221EA4727",
        decimal: 18,
        ratePair: "ETH",
        token: "GNO",
        name: "Gnosis",
    },
    {
        address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
        rateAddress: "0xec1D1B3b0443256cc3860e24a46F108e699484Aa",
        decimal: 8,
        ratePair: "USD",
        token: "MKR",
        name: "Maker",
    },
    {
        address: "0x03ab458634910aad20ef5f1c8ee96f1d6ac54919",
        rateAddress: "0x4ad7B025127e89263242aB68F0f9c4E5C033B489",
        decimal: 18,
        ratePair: "ETH",
        token: "RAI",
        name: "Rai Reflex Index",
    },
    // {
    //     address: "0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0",
    //     rateAddress: "",
    //     decimal: 0,
    //     token: "TRB",
    //     name: "Tellor",
    // },
    {
        address: "0xc944e90c64b2c07662a292be6244bdf05cda44a7",
        rateAddress: "0x86cF33a451dE9dc61a2862FD94FF4ad4Bd65A5d2",
        decimal: 8,
        ratePair: "USD",
        token: "GRT",
        name: "The Graph",
    },
    {
        address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        rateAddress: "0x553303d460EE0afB37EdFf9bE42922D8FF63220e",
        decimal: 8,
        ratePair: "USD",
        token: "UNI",
        name: "Uniswap",
    },
    {
        address: "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",
        rateAddress: "0xA027702dbb89fbd58938e4324ac03B58d812b0E1",
        decimal: 8,
        ratePair: "USD",
        token: "YFI",
        name: "yearn.finance",
    },
] as IToken[];

export const rinkebyTokenList = [
    {
        address: "0x0000000000000000000000000000000000000000",
        rateAddress: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
        decimal: 8,
        ratePair: "USD",
        token: "ETH",
        name: "Ethereum",
    },
    {
        address: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
        rateAddress: "0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF",
        decimal: 8,
        ratePair: "USD",
        token: "DAI",
        name: "Dai",
    },
] as IToken[];

export interface IToken {
    address: string;
    rateAddress: string;
    decimal: number;
    ratePair: "USD" | "ETH";
    name: string;
    token: string;
}

// export const abi = [
//     // balanceOf
//     {
//         constant: true,
//         inputs: [{ name: "_owner", type: "address" }],
//         name: "balanceOf",
//         outputs: [{ name: "balance", type: "uint256" }],
//         type: "function",
//     },
//     // decimals
//     {
//         constant: true,
//         inputs: [],
//         name: "decimals",
//         outputs: [{ name: "", type: "uint8" }],
//         type: "function",
//     },
//     // name
//     {
//         constant: true,
//         inputs: [],
//         name: "name",
//         outputs: [
//             {
//                 name: "",
//                 type: "string",
//             },
//         ],
//         payable: false,
//         type: "function",
//     },
//     // symbol
//     {
//         constant: true,
//         inputs: [],
//         name: "symbol",
//         outputs: [
//             {
//                 name: "",
//                 type: "string",
//             },
//         ],
//         payable: false,
//         type: "function",
//     },
// ];
