import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { abi, IToken, rinkebyTokenList, tokenList } from "../utils/token";
import { web3Instance } from "../utils/web3Context";
import { AbiItem } from "web3-utils";
import TokenBalanceCheckerContract from "../utils/tokenBalanceChecker";

export interface TokenState {
    address: string;
    symbol: string;
    name: string;
    balance: number;
}

const ether = {
    address: "eth",
    symbol: "ETH",
    name: "Ether",
    balance: 0,
} as TokenState;

const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";

const initialState = {
    tokenList: rinkebyTokenList
        .map((token: IToken) => {
            return {
                address: token.address,
                symbol: "",
                name: "",
                balance: 0,
            };
        })
        .concat(ether),
};

export const fetchTokenBalance = createAsyncThunk(
    "tokenBalance/fetch",
    async (): Promise<TokenState[]> => {
        try {
            const tempAccount = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
            const list =
                process.env.NODE_ENV === "production"
                    ? tokenList
                    : rinkebyTokenList;

            const result = await TokenBalanceCheckerContract.methods
                .balance(
                    tempAccount,
                    list.map((e) => e.address)
                )
                .call();

            return list.map((t: IToken, index) => {
                return {
                    address: t.address,
                    name: t.name,
                    symbol: t.token,
                    balance: parseFloat(
                        web3Instance.utils.fromWei(result[index], "ether")
                    ),
                } as TokenState;
            }) as TokenState[];
        } catch (err) {
            console.log("==== err", err);
            return [];
        }
    }
);

const tokenBalanceSlice = createSlice({
    name: "tokenList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTokenBalance.fulfilled, (state, action) => {
            state.tokenList = action.payload;
        });
    },
});

export default tokenBalanceSlice.reducer;
