import { useWeb3React } from "@web3-react/core";
import React, { ReactElement, useEffect, useState } from "react";
import BalanceCardChance from "../../components/BalanceCardChance";
import Chart from "../../components/Chart";
import useMsg from "../../hooks/CustomMessageHook";
import Histogram from "../../components/Histogram";

const Chance = () => {
    // ==================================
    // STATE
    // ==================================
    const { account, active } = useWeb3React();
    const { setMsg } = useMsg();
    const handleHover = (...args: any) => {
        console.log(args);
    };
    // ==================================
    // INIT
    // ==================================
    const data = {
        table: [
            { index: 1, percentChange: 1.8 },
            { index: 2, percentChange: 1.5 },
            { index: 3, percentChange: 1.3 },
            { index: 3, percentChange: 0.91 },
            { index: 4, percentChange: 0.98 },
            { index: 5, percentChange: 0.93 },
            { index: 6, percentChange: 0.97 },
            { index: 7, percentChange: 0.89 }
        ]
    };
    // ==================================
    // LISTENER
    // ==================================
    const signalListeners = { tooltip: handleHover };

    // ==================================
    // FUNCTIONS
    // ==================================
    // ==================================
    // RENDER
    // ==================================
    return (
        <div>
            <BalanceCardChance />
            {/* <Chart /> */}
            <Histogram data={data} signalListeners={signalListeners} />

        </div>
    );
};

export default Chance;
