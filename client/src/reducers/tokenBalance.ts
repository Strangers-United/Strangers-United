import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { abi, IToken, rinkebyTokenList, tokenList } from "../utils/token";
import { web3Instance } from "../utils/Web3Context";
import { AbiItem } from "web3-utils";

export interface TokenState {
    address: string;
    symbol: string;
    name: string;
    balance: number;
}

const initialState = {
    tokenList: rinkebyTokenList.map((token: IToken) => {
        return {
            address: token.address,
            symbol: "",
            name: "",
            balance: 0,
        };
    }),
};

export const fetchTokenBalance = createAsyncThunk(
    "tokenBalance/fetch",
    async (): Promise<TokenState[]> => {
        const tempAccount = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        const list =
            process.env.NODE_ENV === "production"
                ? tokenList
                : rinkebyTokenList;

        return await Promise.all(
            list.map(async (t: IToken) => {
                const contract = new web3Instance.eth.Contract(
                    abi as AbiItem[],
                    t.address
                );
                const name = await contract.methods.name().call();
                const symbol = await contract.methods.symbol().call();
                const balance = await contract.methods
                    .balanceOf(tempAccount)
                    .call();
                return {
                    address: t.address,
                    name,
                    symbol,
                    balance: parseFloat(
                        web3Instance.utils.fromWei(balance, "ether")
                    ),
                } as TokenState;
            })
        );
    }
);

const tokenBalanceSlice = createSlice({
    name: "tokenList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTokenBalance.fulfilled, (state, action) => {
            action.payload.forEach((data: TokenState) => {
                state.tokenList = state.tokenList.map((e) => {
                    if (e.address === data.address) {
                        return {
                            ...e,
                            name: data.name,
                            symbol: data.symbol,
                            balance: data.balance,
                        };
                    }
                    return e;
                });
            });
        });
    },
});

export default tokenBalanceSlice.reducer;
