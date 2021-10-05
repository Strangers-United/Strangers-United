export const slurpList = [ // This is temp until we have a real libraries we fetch from ipfs via some sort of search
    {
        location: "https://gateway.pinata.cloud/ipfs/QmY1R9DR9gnYPTdjZSbMEwY6cw7RTYuQi2QH6jzZPj5tB3",
        sips: [],
        sipMatrices: [],
    }
] as ISlurp[];

export interface ISlurp {
    location: string;
    sips: string[];
    sipMatrices: number[];
}
//location: "https://gateway.pinata.cloud/ipfs/QmZVFL5F1dw5nuZwwoHXthLTUV9L9iNm3MUeMyJ5Q8PW4i",
//location: "https://ipfs.io/ipfs/QmTn16U9YtbMeGkYWtRFZ5XrNA7tiKQYyRSgX4Es3TWouB",
//https://gateway.pinata.cloud/ipfs/QmY1R9DR9gnYPTdjZSbMEwY6cw7RTYuQi2QH6jzZPj5tB3 // 20