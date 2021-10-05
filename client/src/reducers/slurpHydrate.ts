import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import hydrateLibrary from '../utils/hydrate'; // Hydrate library for chart rendering
import { ISlurp, slurpList } from "../utils/slurp";

export interface SlurpState {
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
        slurpIpfsLib.sips.forEach(async function (sip: any, i: number) {
            sipTrials[i] = await hydrateLibrary(slurpIpfsLib, slurpIpfsLib.sips[i].name, 500);
            sipNames[i] = slurpIpfsLib.sips[i].name;
            console.log(' in slurpHydrate loop: ', sipTrials);
        });

        const allLibs = await Promise.all( // ONLY ONE TODO HERE support multiple libs from ipfs
            listOfSlurps.map(async (t: ISlurp, i) => {
                //console.log(' in slurpHydrate: ', t);
                const sips = sipNames;
                const sipMatrices = sipTrials;
                return {
                    location: t.location,
                    sips: sips,
                    sipMatrices: sipMatrices,
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
                    };
                    return e;
                });
            });
        });
    },
});

export default tokenHydratedMatrixSlice.reducer;



