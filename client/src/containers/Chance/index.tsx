import { useWeb3React } from "@web3-react/core";
import React, { ReactElement, useEffect, useState } from "react";
import BalanceCardChance from "../../components/BalanceCardChance";
import Chart from "../../components/Chart";
import useMsg from "../../hooks/CustomMessageHook";
//import Histogram from "../../components/Histogram";
//import { Sparklines, SparklinesLine } from 'react-sparklines-typescript';

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
    /*   const data = {
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
      }; */
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
            {/* <Chart /> 
            <Histogram data={data} signalListeners={signalListeners} /> 
            <Histogram data={data} /> 
            <Sparklines data={[0.14427115522960857, 0.20852389823055525, 0.27277664123149864, 0.3714337877611313, 0.5007326814381072, 0.6769688242382322, 0.9176844102783538, 1.2434741490896293, 1.765986562746358, 2.3893560330371866, 3.1350435529213763, 4.196920999861439, 5.680468820203986, 7.769459548373542, 10.634341836627641, 14.747363471118522, 21.00279216076072, 31.407051477510763, 52.49013131649001, 136.05693144964044, 37.96193251972649, 8.53530490459275, 2.694060532008129, 1.051776406209876, 0.41271337029240796]} limit={100} width={500} height={50} margin={5}>
                <SparklinesLine color="green" />
            </Sparklines>
            <Sparklines data={[0.05757526, 0.083479541, 0.109383822, 0.149581607, 0.202432235, 0.274548299, 0.374143024, 0.509104032, 0.731590587, 0.988148478, 1.3177047, 1.777873569, 2.447532117, 3.384677887, 4.742109398, 6.825713041, 10.29490338, 17.16351634, 40.39146006, 21.07557727, 4.564039967, 1.661383242, 0.684975167, 0.309083321, 0.140000919]} width={50} height={50} margin={1}>
                <SparklinesLine color="green" style={{
                    strokeWidth: 0.3,
                    fill: "green"
                }} />
            </Sparklines> */}

        </div>
    );
};

export default Chance;
