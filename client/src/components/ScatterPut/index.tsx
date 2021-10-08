import { Vega } from 'react-vega';
import { useWeb3React } from "@web3-react/core";
import Loading from "../Loading";

import { useEffect, useState } from "react";
import {
    fetchTokenBalance,
    TokenState,
    ITokenBalanceHeader,
    updateThreshold,
    triggerThreshold,
} from "../../reducers/tokenBalance";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchSlurpLib, SlurpState } from "../../reducers/slurpHydrate";
import { forEach, indexOf, isFunction } from 'lodash';
import { PROPERTY_TYPES } from '@babel/types';
import HistogramLive from '../HistogramLive';

/* Example https://vega.github.io/vega-lite/docs/point.html */
const ScatterPut = (props: any) => {
    // ==================================
    // STATE
    // ==================================
    const { account } = useWeb3React();
    let chartThreshold: number;
    let chartCurrentPrice: number;
    let matchingSymbolHelper: string;
    const hack4now = [{ 'ticker': 'ETH', 'coingecko': 'ethereum' },
    { 'ticker': 'AAVE', 'coingecko': 'aave' },
    { 'ticker': 'BAL', 'coingecko': 'balancer' },
    { 'ticker': 'LINK', 'coingecko': 'chainlink' },
    { 'ticker': 'CRV', 'coingecko': 'curve-dao-token' },
    { 'ticker': 'DAI', 'coingecko': 'dai' },
    { 'ticker': 'GNO', 'coingecko': 'gnosis' },
    { 'ticker': 'MKR', 'coingecko': 'maker' },
    { 'ticker': 'RAI', 'coingecko': 'rai' },
    { 'ticker': 'GRT', 'coingecko': 'the-graph' },
    { 'ticker': 'UNI', 'coingecko': 'uniswap' },
    { 'ticker': 'YFI', 'coingecko': 'yearn-finance' }
    ];


    const sipList = useAppSelector((state) => state.slurpList.slurpList);
    console.log('get simulation data for chart here: ', sipList);
    const { tokenList, state: tokenFetchState } = useAppSelector((state) => state.tokenList);
    console.log("play time...", tokenList);

    // ==================================
    // INIT
    // ==================================
    useEffect(() => {
        if (tokenList.length > 0) {
            console.log('tokenList changed')
            // function you want to call
            // lastestThreshold(tokenList[0].threshold);
            console.log('inside use effect threshold scatterput', tokenList[0].threshold)
        }
    }, [props.threshold])

    // ==================================
    // FUNCTIONS
    // ==================================
    const makeNewChartData = async () => {
        try {
            // reBuildChartData(); // go do something and 
            // renderChart(); // figure this out still
        } catch (err) {
            console.log(err);
        }
    };

    // ==================================
    // RENDER
    // ==================================

    return (
        <>
            {tokenList.map((token: TokenState, index) => {
                return (
                    <div key={token.address}>{token.threshold}</div>
                )
            })}
        </>
    )
}

export default ScatterPut;
