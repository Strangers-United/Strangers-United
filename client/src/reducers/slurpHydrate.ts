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
        const listOfSlurps = slurpList; // There could be more than one slurp available for now just one 
        // First need to figure which ipfs location based on tokens in portfolio
        // Need lookup token-symbol to IPFS hash ??
        const url = listOfSlurps[0].location; //TODO here fixing to first/only IFPS location
        const slurpIpfsLib = await fetchIpfs(url);
        //console.log('this is temp ', slurpIpfsLib);
        //const slurpIpfsLib = { "name": "flow-theta-token-axie-infinity-chiliz-enjincoin-2021-09-21.json", "objectType": "sipModel", "libraryType": "SIPmath_3_0", "dateCreated": "09-21-2021", "globalVariables": [{ "name": "correlationMatrix", "value": { "columns": ["flow", "thetatoken", "axieinfinity", "chiliz", "enjincoin"], "rows": ["flow", "thetatoken", "axieinfinity", "chiliz", "enjincoin"], "matrix": [{ "row": "flow", "col": "flow", "value": 1 }, { "row": "thetatoken", "col": "flow", "value": 0.6344703210099326 }, { "row": "thetatoken", "col": "thetatoken", "value": 1 }, { "row": "axieinfinity", "col": "flow", "value": 0.5184257770276097 }, { "row": "axieinfinity", "col": "thetatoken", "value": 0.6004138011729334 }, { "row": "axieinfinity", "col": "axieinfinity", "value": 1 }, { "row": "chiliz", "col": "flow", "value": 0.7025449259128079 }, { "row": "chiliz", "col": "thetatoken", "value": 0.8831065196037529 }, { "row": "chiliz", "col": "axieinfinity", "value": 0.7600340457480295 }, { "row": "chiliz", "col": "chiliz", "value": 1 }, { "row": "enjincoin", "col": "flow", "value": 0.7293017288451478 }, { "row": "enjincoin", "col": "thetatoken", "value": 0.8517180419751679 }, { "row": "enjincoin", "col": "axieinfinity", "value": 0.6789017699481634 }, { "row": "enjincoin", "col": "chiliz", "value": 0.9292461240297901 }, { "row": "enjincoin", "col": "enjincoin", "value": 1 }] } }], "provenance": "KMM", "U01": { "rng": [{ "name": "hdr1", "function": "HDR_2_0", "arguments": { "counter": "PM_Index", "entity": 1, "varId": 2087045, "seed3": 0, "seed4": 0 } }, { "name": "hdr2", "function": "HDR_2_0", "arguments": { "counter": "PM_Index", "entity": 1, "varId": 2087046, "seed3": 0, "seed4": 0 } }, { "name": "hdr3", "function": "HDR_2_0", "arguments": { "counter": "PM_Index", "entity": 1, "varId": 2087047, "seed3": 0, "seed4": 0 } }, { "name": "hdr4", "function": "HDR_2_0", "arguments": { "counter": "PM_Index", "entity": 1, "varId": 2087048, "seed3": 0, "seed4": 0 } }, { "name": "hdr5", "function": "HDR_2_0", "arguments": { "counter": "PM_Index", "entity": 1, "varId": 2087049, "seed3": 0, "seed4": 0 } }], "copula": [{ "arguments": { "correlationMatrix": { "type": "globalVariables", "value": "correlationMatrix" }, "rng": ["hdr1", "hdr2", "hdr3", "hdr4", "hdr5"] }, "function": "GaussianCopula", "name": "Gaussian", "copulaLayer": ["c1", "c2", "c3", "c4", "c5"] }] }, "sips": [{ "name": "flow", "ref": { "source": "copula", "name": "Gaussian", "copulaLayer": "c1" }, "function": "Metalog_1_0", "arguments": { "aCoefficients": [0.994838102415617, 0.004685644724859045, -0.004451370153069208, -0.013144268586090958] }, "metadata": { "count": 30, "mean": 0.9886126004420956, "std": 0.06963038405215338, "min": 0.8297706956859697, "P25": 0.9594511103081834, "P50": 0.9931982847089494, "P75": 1.0097183036501498, "max": 1.2090576395242452, "density": [0.14427115522960857, 0.20852389823055525, 0.27277664123149864, 0.3714337877611313, 0.5007326814381072, 0.6769688242382322, 0.9176844102783538, 1.2434741490896293, 1.765986562746358, 2.3893560330371866, 3.1350435529213763, 4.196920999861439, 5.680468820203986, 7.769459548373542, 10.634341836627641, 14.747363471118522, 21.00279216076072, 31.407051477510763, 52.49013131649001, 136.05693144964044, 37.96193251972649, 8.53530490459275, 2.694060532008129, 1.051776406209876, 0.41271337029240796] } }, { "name": "thetatoken", "ref": { "source": "copula", "name": "Gaussian", "copulaLayer": "c2" }, "function": "Metalog_1_0", "arguments": { "aCoefficients": [1.0048918170656747, 0.012282706015882048, -0.010096400543113218, -0.03931038330189737] }, "metadata": { "count": 30, "mean": 0.9884820712323308, "std": 0.07120033776871998, "min": 0.7832957110609482, "P25": 0.9570433402696417, "P50": 1.0007183908045976, "P75": 1.0370172436675262, "max": 1.111668757841907, "density": [0.05757526046184955, 0.0834795414422337, 0.10938382242261839, 0.14958160719673572, 0.20243223520604986, 0.2745482990008297, 0.37414302438426716, 0.5091040320580158, 0.7315905868154615, 0.9881484776298847, 1.3177047003206657, 1.777873569119995, 2.447532116536669, 3.384677886562082, 4.7421093984670035, 6.825713041396581, 10.2949033770372, 17.163516339525536, 40.39146005733562, 21.07557726655157, 4.564039967035303, 1.6613832417252854, 0.6849751669395718, 0.3090833214283859, 0.14000091904983572] } }, { "name": "axieinfinity", "ref": { "source": "copula", "name": "Gaussian", "copulaLayer": "c3" }, "function": "Metalog_1_0", "arguments": { "aCoefficients": [0.9824137189221379, 2.1175823681353408e-22, 8.906448132181318e-23, 0.001] }, "metadata": { "count": 30, "mean": 0.9883671196521643, "std": 0.06266634532158587, "min": 0.8331696538178248, "P25": 0.9562440451885122, "P50": 0.9836891737366997, "P75": 1.0215378799810995, "max": 1.191995673336939, "density": [999.9999999999998, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 999.9999999999998] } }, { "name": "chiliz", "ref": { "source": "copula", "name": "Gaussian", "copulaLayer": "c4" }, "function": "Metalog_1_0", "arguments": { "aCoefficients": [0.9933142262844418, 2.1175823681353408e-22, 8.906448132181318e-23, 0.001] }, "metadata": { "count": 30, "mean": 0.9858865707158395, "std": 0.05502529385650642, "min": 0.8033302854727323, "P25": 0.9594472059588804, "P50": 0.9934296187012761, "P75": 1.0290897757957125, "max": 1.046655335935205, "density": [999.9999999999998, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 999.9999999999998] } }, { "name": "enjincoin", "ref": { "source": "copula", "name": "Gaussian", "copulaLayer": "c5" }, "function": "Metalog_1_0", "arguments": { "aCoefficients": [1.005663953488372, 2.1175823681353408e-22, 8.906448132181318e-23, 0.001] }, "metadata": { "count": 30, "mean": 0.9843361422481992, "std": 0.062355951528115815, "min": 0.8018433179723502, "P25": 0.949038382678586, "P50": 1.005780539962577, "P75": 1.0273970534959544, "max": 1.0625, "density": [999.9999999999998, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 999.9999999999998] } }], "version": "1", "metadata": { "tags": ["flow", "theta-token", "axie-infinity", "chiliz", "enjincoin"], "pullTime": "\"2021-09-21 16:47:44.790640\"", "lastNperiods": 30, "reference": "https://www.coingecko.com/en/price_charts" } };
        //console.log('hmm ', slurpIpfsLib);
        // Loop through each Token in slurp and hydrate it, then add to sipMatrices
        //console.log('hydrate these ', slurpIpfsLib.sips);
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



