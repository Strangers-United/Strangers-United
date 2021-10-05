import { useWeb3React } from "@web3-react/core";
import React, { ReactElement, useEffect, useState } from "react";
import { Vega } from 'react-vega';
import BalanceCardChance from "../../components/BalanceCardChance";
import Chart from "../../components/Chart";
import useMsg from "../../hooks/CustomMessageHook";
//import Histogram from "../../components/Histogram";
import { useAppDispatch, useAppSelector } from "../../store";
//import { Sparklines, SparklinesLine } from 'react-sparklines-typescript';
import { fetchSlurpLib, SlurpState } from "../../reducers/slurpHydrate";
import TestChartEmbed from "../../components/TestChartEmbed";

const Chance = () => {
    // ==================================
    // STATE
    // ==================================
    const { account, active } = useWeb3React();
    const { setMsg } = useMsg();
    const handleHover = (...args: any) => {
        console.log(args);
    };
    const dispatch = useAppDispatch();

    const sipList = useAppSelector((state) => state.slurpList.slurpList);

    // ==================================
    // INIT
    // ==================================
    useEffect(() => {
        getTokenSipMathLib();
    }, []);

    // ==================================
    // LISTENER
    // ==================================
    const signalListeners = { tooltip: handleHover };

    // ==================================
    // FUNCTIONS
    // ==================================
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
            <BalanceCardChance />
            {/* <Chart /> */}
            <TestChartEmbed />
        </div>
    );
};

export default Chance;
