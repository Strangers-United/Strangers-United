import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
<<<<<<< HEAD
import { IToken, rinkebyTokenList, tokenList } from "../utils/token";
import { web3Instance } from "../utils/web3Context";
import { AbiItem } from "web3-utils";
import TokenBalanceCheckerContract from "../utils/tokenBalanceChecker";
import { getTokenToUSDRate } from "../utils/chainlink";

export interface TokenState {
    address: string;
    name: string;
    symbol: string;
    balance: number;
    currentPrice: number;
    usdValue: string;
    threshold: number;
    chance: number;
}

export interface ITokenBalanceHeader {
    key: keyof TokenState;
    label: string;
    editable: boolean;
}

export interface ITokenBalanceState {
    headers: ITokenBalanceHeader[];
    state: FETCH_STATE;
    tokenList: TokenState[];
}

export interface IUpdateThresholdPayload {
    symbol: string;
    value: number;
}

type FETCH_STATE = "fetching" | "fetched" | "failed";

const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";

const ether = {
    address: ETH_ADDRESS,
    symbol: "ETH",
    name: "Ether",
    balance: 0,
    currentPrice: 0,
    usdValue: "0",
    threshold: 0,
    chance: 0,
} as TokenState;

const initialState = {
    headers: [
        { key: "balance", label: "Balance", editable: false },
        { key: "currentPrice", label: "Price", editable: false },
        { key: "usdValue", label: "Value (USD)", editable: false },
        { key: "threshold", label: "Threshold", editable: true },
        { key: "chance", label: "Chance of Hit", editable: false },
    ],
    state: "fetching" as FETCH_STATE,
    tokenList: (process.env.REACT_APP_ENV === "production"
        ? tokenList
        : rinkebyTokenList
    )
        .map((token: IToken) => {
            return {
                address: token.address,
                name: "",
                symbol: "",
                balance: 0,
                currentPrice: 0,
                usdValue: "0",
                threshold: 0,
                chance: 0,
            };
        })
        .concat(ether),
} as ITokenBalanceState;

export const fetchTokenBalance = createAsyncThunk(
    "tokenBalance/fetch",
    async (_accountAddress?: string): Promise<TokenState[]> => {
        try {
            const accountAddress =
                _accountAddress || "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
            const list =
                process.env.REACT_APP_ENV === "production"
                    ? tokenList
                    : rinkebyTokenList;

            const result =
                process.env.REACT_APP_ENV === "production"
                    ? list.map((e, index) =>
                        ((index + 1) * 100000000000000000).toString()
                    )
                    : await TokenBalanceCheckerContract.methods
                        .balance(
                            accountAddress,
                            list.map((e) => e.address)
                        )
                        .call();

            return await Promise.all(
                list.map(async (t: IToken, index) => {
                    let currentPrice = 0;
                    currentPrice = await getTokenToUSDRate(
                        t.rateAddress,
                        t.decimal
                    );
                    const balance = parseFloat(
                        web3Instance.utils.fromWei(result[index], "ether")
                    );

                    return {
                        address: t.address,
                        name: t.name,
                        symbol: t.token,
                        balance: balance,
                        currentPrice: currentPrice,
                        usdValue: (currentPrice * balance).toFixed(4),
                        threshold: 0,
                        chance: 0,
                    } as TokenState;
                }) as Promise<TokenState>[]
            );
        } catch (err) {
            console.log("==== token balance err", err);
            return [];
        }
=======
import { abi, IToken, rinkebyTokenList, tokenList } from "../utils/token";
import { web3Instance } from "../utils/web3Context";
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
>>>>>>> main
    }
);

const tokenBalanceSlice = createSlice({
    name: "tokenList",
    initialState,
<<<<<<< HEAD
    reducers: {
        updateThreshold(
            state: ITokenBalanceState,
            action: PayloadAction<IUpdateThresholdPayload>
        ) {
            state.tokenList = state.tokenList.map((token) => {
                if (token.symbol === action.payload.symbol) {
                    token.threshold = action.payload.value;
                    console.log("==== new threshold", action.payload.value);
                }
                return token;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTokenBalance.fulfilled, (state, action) => {
                state.state = "fetched";
                state.tokenList = action.payload;
            })
            .addCase(fetchTokenBalance.pending, (state, action) => {
                state.state = "fetching";
            })
            .addCase(fetchTokenBalance.rejected, (state, action) => {
                state.state = "failed";
            });
    },
});

export const { updateThreshold } = tokenBalanceSlice.actions;
=======
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

>>>>>>> main
export default tokenBalanceSlice.reducer;
