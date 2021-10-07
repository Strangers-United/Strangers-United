import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import hydrateLibrary from '../utils/hydrate'; // Hydrate library for chart rendering
import { ISlurp, slurpList } from "../utils/slurp";

export interface SlurpState {
    sipOGMetaData: any;
    location: string;
    sips: string[];
    sipMatrices: number[][];
}

const initialState = {
    slurpList: slurpList
        .map((slurp: ISlurp) => {
            return {
                location: "init state", //init state ipfs
                sips: ["token1 init", "sip 2 init"],
                sipMatrices: [[.22, .33, .44], [.55, .66, .77]],
                sipOGMetaData: {
                    "count": 30,
                    "mean": 1.0000067845876177,
                    "std": 0.0037466926179786837,
                    "min": 0.9900990099009901,
                    "P25": 1,
                    "P50": 1,
                    "P75": 1,
                    "max": 1.01,
                    "density": [999.9999999999998, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 999.9999999999998]
                }
            };
        })
};

async function fetchIpfs(urlInput: string) {
    const response = await fetch(urlInput);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const slurpJson = await response.json();
    return slurpJson;
}

export const fetchSlurpLib = createAsyncThunk(
    "slurpHydrate/fetch",
    async (): Promise<SlurpState[]> => {
        const listOfSlurps = slurpList;
        const url = listOfSlurps[0].location; //TODO here fixing to first/only IFPS location
        const slurpIpfsLib = await fetchIpfs(url);
        let sipTrials: number[] = [];
        let sipNames: string[] = [];
        let sipMetaData: any = {};
        slurpIpfsLib.sips.forEach(async function (sip: any, i: number) {
            sipTrials[i] = await hydrateLibrary(slurpIpfsLib, slurpIpfsLib.sips[i].name, 500);
            sipNames[i] = slurpIpfsLib.sips[i].name;
            sipMetaData[i] = slurpIpfsLib.sips[i].metadata;
            console.log(' in slurpHydrate loop: ', sipMetaData);
        });

        const allLibs = await Promise.all( // ONLY ONE TODO HERE support multiple libs from ipfs
            listOfSlurps.map(async (t: ISlurp, i) => {
                //console.log(' in slurpHydrate: ', t);
                const sips = sipNames;
                const sipMatrices = sipTrials;
                const sipOGMetaData = sipMetaData;
                console.log(' in slurpHydrate: ', sipOGMetaData);
                return {
                    location: t.location,
                    sips: sips,
                    sipMatrices: sipMatrices,
                    sipOGMetaData: sipOGMetaData,
                } as unknown as SlurpState;
            })
        );

        return [
            ...allLibs,
        ];
    }
);

const tokenHydratedMatrixSlice = createSlice({
    name: "slurpList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchSlurpLib.fulfilled, (state, action) => {
            action.payload.forEach((data: SlurpState) => {
                state.slurpList = state.slurpList.map((e) => {
                    return {
                        ...e,
                        location: data.location,
                        sips: data.sips,
                        sipMatrices: data.sipMatrices,
                        sipOGMetaData: data.sipOGMetaData,
                    };
                    return e;
                });
            });
        });
    },
});

export default tokenHydratedMatrixSlice.reducer;



