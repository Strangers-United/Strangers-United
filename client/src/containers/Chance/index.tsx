import { useWeb3React } from "@web3-react/core";
import React, { ReactElement, useEffect, useState } from "react";
import BalanceCardChance from "../../components/BalanceCardChance";
import Chart from "../../components/Chart";
import useMsg from "../../hooks/CustomMessageHook";

const Chance = () => {
    // ==================================
    // STATE
    // ==================================
    const { account, active } = useWeb3React();
    const { setMsg } = useMsg();

    // ==================================
    // INIT
    // ==================================
    // ==================================
    // LISTENER
    // ==================================
    // ==================================
    // FUNCTIONS
    // ==================================
    // ==================================
    // RENDER
    // ==================================
    return (
        <div>
            <BalanceCardChance />
            <Chart />
        </div>
    );
};

export default Chance;
