import { useWeb3React } from "@web3-react/core";
import React, { ReactElement, useEffect, useState } from "react";
import BalanceCard from "../../components/BalanceCard";
import useMsg from "../../hooks/CustomMessageHook";

const Home = () => {
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
            <BalanceCard />
        </div>
    );
};

export default Home;
