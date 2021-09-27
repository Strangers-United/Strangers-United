import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface MetamaskState {
    ready: boolean;
    account: string;
}

const initialState: MetamaskState = {
    ready: false,
    account: "",
};

const metamaskSlice = createSlice({
    name: "metamask",
    initialState,
    reducers: {
        connect(state: MetamaskState, action: PayloadAction<string>) {
            state.ready = true;
            state.account = action.payload;
        },
    },
});

export const { connect } = metamaskSlice.actions;
export const selectMetamask = (state: RootState) => state;
export default metamaskSlice.reducer;
