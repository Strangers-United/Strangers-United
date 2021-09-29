export const slurpList = [
    {
        location: "ipfs hash here?",
        sips: ["DAI", "ETH"],
        sipMatrices: [0.5, 0.5],
    },
    {
        location: "ipfs hash here?",
        sips: ["FILE", "ETH"],
        sipMatrices: [0.5, 0.5],
    },
    {
        location: "ipfs hash here?",
        sips: ["COMP", "ETH"],
        sipMatrices: [0.5, 0.5],
    },
] as ISlurp[];

export interface ISlurp {
    location: string;
    sips: string[];
    sipMatrices: number[];
}