import { useWeb3React } from "@web3-react/core";
import React, { ReactElement, useEffect, useState } from "react";
import useMsg from "../../hooks/CustomMessageHook";
import getContract from "../../utils/Web3AdoptionContract";

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
    return <div>home</div>
};

export default Home;
