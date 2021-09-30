export const slurpList = [ // This is temp until we have a real libraries we fetch from ipfs via some sort of search
    {
        location: "https://ipfs.io/ipfs/QmTn16U9YtbMeGkYWtRFZ5XrNA7tiKQYyRSgX4Es3TWouB",
        sips: [],
        sipMatrices: [],
    }
] as ISlurp[];

export interface ISlurp {
    location: string;
    sips: string[];
    sipMatrices: number[];
}