import { useWeb3React } from "@web3-react/core";
import React, { ReactElement, useEffect, useState } from "react";
import { Vega } from "react-vega";
import BalanceCardTEST from "../../components/BalanceCardTEST";

//import Histogram from "../../components/Histogram";
import { useAppDispatch, useAppSelector } from "../../store";
//import { Sparklines, SparklinesLine } from 'react-sparklines-typescript';
import { fetchSlurpLib, SlurpState } from "../../reducers/slurpHydrate";
import {
    fetchTokenBalance,
    TokenState,
    ITokenBalanceHeader,
    updateThreshold,
    triggerThreshold,
} from "../../reducers/tokenBalance";
import HistogramLive from "../../components/HistogramLive";
import ScatterPut from "../../components/ScatterPut";
const Chance = () => {
    // ==================================
    // STATE
    // ==================================
    const { account } = useWeb3React();
    const dispatch = useAppDispatch();
    const {
        state: tokenFetchState,
        tokenList,
        headers,
    } = useAppSelector((state) => state.tokenList);

    const sipList = useAppSelector((state) => state.slurpList.slurpList);
    function sumArrays(arrays: any) {
        const n = arrays.reduce(
            (max: any, xs: any) => Math.max(max, xs.length),
            0
        );
        const result = Array.from({ length: n });
        return result.map((_, i) =>
            arrays
                .map((xs: any) => xs[i] || 0)
                .reduce((sum: any, x: any) => sum + x, 0)
        );
    }

    const portfolioSummary = sumArrays(sipList[0].sipMatrices);
    console.log("portfolio summary ", portfolioSummary);

    // ==================================
    // INIT
    // ==================================
    useEffect(() => {
        if (account) {
            getTokenBalance(account);
            getTokenSipMathLib();
            //  setLatestThreshold(tokenList[0].threshold);
            //  lastestThreshold(tokenList[0].threshold);
        }
    }, [account]);

    // ==================================
    // LISTENER
    // ==================================
    // /const signalListeners = { tooltip: handleHover };

    // ==================================
    // FUNCTIONS
    // ==================================
    const getTokenBalance = (accountAddress: string) => {
        try {
            dispatch(fetchTokenBalance(accountAddress));
        } catch (err) {
            console.log(err);
        }
    };
    const getTokenSipMathLib = async () => {
        try {
            dispatch(fetchSlurpLib());
        } catch (err) {
            console.log(err);
        }
    };
    // ==================================
    // RENDER
    // ==================================

    return (
        <div>
            <BalanceCardTEST />
            {/* <Chart /> */}
            {/*             {tokenFetchState === "fetched" ? (
                <>
                    {tokenList.map((token: TokenState, index) => {
                        // return (
                        console.log(sipList[0].sipMatrices[0]);
                        //  );
                    })}
                </>
            ) : (
                <Loading isAnimation />
            )}
            <>
                <HistogramLive
                    sip={sipList[0].sipMatrices[0]}
                    currentPrice={1}
                    spec={"bar"} // bar or bar mean
                /></> */}
        </div>
    );
};

export default Chance;
