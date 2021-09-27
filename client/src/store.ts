import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import metamaskReducer from "./reducers/metamask";
import tokenBalanceReducer from "./reducers/tokenBalance";

export const store = configureStore({
    reducer: {
        metamask: metamaskReducer,
        tokenList: tokenBalanceReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
