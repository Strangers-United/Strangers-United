import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { Sparklines, SparklinesBars } from "react-sparklines-typescript";
import { fetchSlurpLib } from "../../reducers/slurpHydrate";
import { fetchTokenBalance, TokenState } from "../../reducers/tokenBalance";
import { useAppDispatch, useAppSelector } from "../../store";
import CustomizedCard from "../CustomizedCard";
import "./styles.scss";

let tempData1 = [
    0.14427115522960857, 0.20852389823055525, 0.27277664123149864,
    0.3714337877611313, 0.5007326814381072, 0.6769688242382322,
    0.9176844102783538, 1.2434741490896293, 1.765986562746358,
    2.3893560330371866, 3.1350435529213763, 4.196920999861439,
    5.680468820203986, 7.769459548373542, 10.634341836627641,
    14.747363471118522, 21.00279216076072, 31.407051477510763,
    52.49013131649001, 136.05693144964044, 37.96193251972649, 8.53530490459275,
    2.694060532008129, 1.051776406209876, 0.41271337029240796,
];
let tempData2: number[] = [];

const BalanceCardChance = () => {
    // ==================================
    // STATE
    // ==================================
    const { account, active } = useWeb3React();
    const dispatch = useAppDispatch();
    const tokenList = useAppSelector((state) => state.tokenList.tokenList);
    // console.log('only simulate these tokens: ', tokenList[0].symbol);
    const sipList = useAppSelector((state) => state.slurpList.slurpList);
    console.log("get stuff here: ", sipList);

    // ==================================
    // INIT
    // ==================================
    useEffect(() => {
        getTokenBalance();
        getTokenSipMathLib();
    }, []);
    // ==================================
    // LISTENER
    // ==================================
    // ==================================
    // FUNCTIONS
    // ==================================
    const getTokenBalance = async () => {
        try {
            dispatch(fetchTokenBalance());
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
        <CustomizedCard title="Portfolio">
            <TokenRow isHeader />
            {tokenList.map((token: TokenState) => {
                if (token.name === "Ether") {
                    // need to align wallet symbol with symbol in sipmath AND figure out search for correct library
                    console.log("its my eth ", token.name);
                    /*                     sipList.map((sip: SlurpState) => {
                                            console.log('sip from index: ', typeof Object.values(sip.sipMatrices[2]));
                                            tempData1 = Object.values(sip.sipMatrices[2]);

                                        }); */
                }
                //  console.log(token.name, tempData1[0]);
                return (
                    <TokenRow
                        symbol={token.symbol}
                        balance={token.balance}
                        currentUsd={token.balance * 3324.0}
                        liquidationPrice={token.balance}
                        chanceofHitting={token.balance}
                        //distribution={tempData1}
                        isHeader={false}
                    />
                );
            })}
        </CustomizedCard>
    );
};

const TokenRow = ({
    symbol,
    balance,
    currentUsd,
    liquidationPrice,
    chanceofHitting,
    // distribution,
    isHeader,
}: {
    symbol?: string;
    balance?: number;
    currentUsd?: number;
    liquidationPrice?: number;
    chanceofHitting?: number;
    // distribution?: number[];
    isHeader: boolean;
}) => {
    if (isHeader) {
        return (
            <div className="token-row-header">
                <span className="symbol">Symbol</span>
                <span className="balance">Balance</span>
                <span className="current-usd">Value in USD</span>
                <span className="liquidation-price">Liquidation Price</span>
                <span className="chance-of-hitting">Chance of hitting</span>
                <span className="distribution">Distribution</span>
            </div>
        );
    }
    return (
        <div className="token-row">
            <span className="symbol">{symbol}</span>
            <span className="balance">{balance}</span>
            <span className="current-usd">{currentUsd}</span>
            <span className="liquidation-price">{"from contract"}</span>
            <span className="chance-of-hitting">{"coming soon"}</span>
            {/* <span className="distribution">{balance}</span> */}
            <div style={{ display: "flex", width: "10%", height: "100%" }}>
                <Sparklines
                    style={{ fill: "none" }}
                    data={tempData1}
                    limit={50}
                >
                    <SparklinesBars />
                </Sparklines>
            </div>
        </div>
    );
};

export default BalanceCardChance;
