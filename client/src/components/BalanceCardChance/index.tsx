import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { abi, rinkebyTokenList } from "../../utils/token";
import { web3Instance } from "../../utils/web3Context";
import { AbiItem } from "web3-utils";
import CustomizedCard from "../CustomizedCard";
import { fetchTokenBalance, TokenState } from "../../reducers/tokenBalance";
import { useAppDispatch, useAppSelector } from "../../store";
import "./styles.scss";
import { Sparklines, SparklinesLine, SparklinesCurve, SparklinesBars } from 'react-sparklines-typescript';
import { fetchSlurpLib } from "../../reducers/slurpHydrate";

let tempData1 = [0.14427115522960857, 0.20852389823055525, 0.27277664123149864, 0.3714337877611313, 0.5007326814381072, 0.6769688242382322, 0.9176844102783538, 1.2434741490896293, 1.765986562746358, 2.3893560330371866, 3.1350435529213763, 4.196920999861439, 5.680468820203986, 7.769459548373542, 10.634341836627641, 14.747363471118522, 21.00279216076072, 31.407051477510763, 52.49013131649001, 136.05693144964044, 37.96193251972649, 8.53530490459275, 2.694060532008129, 1.051776406209876, 0.41271337029240796];
let tempData2 = [0.055786566, 0.079714826, 0.103643087, 0.138945141, 0.1847507, 0.247152175, 0.329256435, 0.440320053, 0.602577814, 0.824771845, 1.046965876, 1.396759337, 1.829541683, 2.399617712, 3.138166186, 4.127080895, 5.449820259, 7.242825746, 9.808487982, 13.76753058, 21.00273537, 42.53812639, 12.01323586, 1.328354726, 0.272297565];

const BalanceCardChance = () => {
    // ==================================
    // STATE
    // ==================================
    const { account, active } = useWeb3React();
    const dispatch = useAppDispatch();
    const tokenList = useAppSelector((state) => state.tokenList.tokenList);
    // console.log(tokenList);
    const sipList = useAppSelector((state) => state.slurpList.slurpList);
    console.log('get stuff here: ', sipList);

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
                    console.log('its my eth ', token.name);
                    tempData1 = tempData2;

                };
                console.log(token.name, tempData1[0]);
                return (
                    <TokenRow
                        symbol={token.symbol}
                        balance={token.balance}
                        currentUsd={token.balance}
                        liquidationPrice={token.balance}
                        chanceofHitting={token.balance}
                        distribution={tempData1}
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
    distribution,
    isHeader,
}: {
    symbol?: string;
    balance?: number;
    currentUsd?: number;
    liquidationPrice?: number;
    chanceofHitting?: number;
    distribution?: number[];
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
            <span className="liquidation-price">{liquidationPrice}</span>
            <span className="chance-of-hitting">{chanceofHitting}</span>
            <span className="distribution">{balance}</span>
            <div style={{ display: "flex", width: "10%", height: "100%" }}>
                <Sparklines style={{ fill: "none" }} data={tempData1} limit={25}  >
                    <SparklinesBars />
                </Sparklines>
            </div>
        </div >
    );
};

export default BalanceCardChance;
