import { Grid, IconButton, FormControl, OutlinedInput } from "@mui/material";
import { useEffect, useState } from "react";
import {
    fetchTokenBalance,
    TokenState,
    ITokenBalanceHeader,
    updateThreshold,
    triggerThreshold,
} from "../../reducers/tokenBalance";
import { useAppDispatch, useAppSelector } from "../../store";
import CustomizedCard from "../CustomizedCard";
import "./styles.scss";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useWeb3React } from "@web3-react/core";
import Loading from "../Loading";
import { fetchSlurpLib, SlurpState } from "../../reducers/slurpHydrate";
import HistogramLive from "../HistogramLive";
import { useDebouncedCallback } from "use-debounce";
import ScatterCurrentPrice from "../ScatterCurrentPrice";
import ScatterETH from "../ScatterETH";
import ScatterPut from "../ScatterPut";
import { tokenList } from "../../utils/token";
import Liquidation from "../Liquidation";

const BalanceCard = () => {
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
    console.log('get simulation data here: ', sipList);
    const [lastestThreshold, setLatestThreshold] = useState(0);
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

    useEffect(() => {
        if (tokenList.length > 0) {
            console.log('tokenList changed')
            // function you want to call
            // lastestThreshold(tokenList[0].threshold);
            console.log('inside use effect threshold', tokenList[0].threshold)
        }
    }, [tokenList])
    // ==================================
    // LISTENER
    // ==================================


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
    const refresh = () => {
        if (account) {
            getTokenBalance(account);
        }
    };
    const getTokenSipMathLib = async () => {
        try {
            dispatch(fetchSlurpLib());
        } catch (err) {
            console.log(err);
        }
    };
    /*     const getLastestThreshold = (threshold: number) => {
            try {
                //    dispatch(lastestThreshold());
            } catch (err) {
                console.log(err);
            }
        }; */
    // ==================================
    // RENDER
    // ==================================

    return (
        <CustomizedCard
            className="balance-card"
            title="Balance"
            actions={
                <IconButton onClick={refresh}>
                    <RefreshIcon style={{ color: "#FFF" }} />
                </IconButton>
            }
        >
            {tokenFetchState === "fetched" ? (
                <>
                    <TokenRow isHeader headers={headers} />
                    {tokenList.map((token: TokenState, index) => {
                        return (
                            <TokenRow
                                key={token.address}
                                headers={headers}
                                token={token}
                                isHeader={false}
                                simulationTrials={sipList[0].sipMatrices[index]}
                                simulationTrials2={sipList[0].sipMatrices[0]} // TODO let user select? IMPORTANT: this is always ETH
                                sipMetaData={sipList[0].sipOGMetaData[index]}
                            />
                        );
                    })}
                </>
            ) : (
                <Loading isAnimation />
            )}
        </CustomizedCard>
    );
};

const TokenRow = ({
    token,
    isHeader,
    headers,
    simulationTrials,
    simulationTrials2,
    sipMetaData,
}: {
    token?: TokenState;
    isHeader: boolean;
    headers: ITokenBalanceHeader[];
    simulationTrials?: any;
    simulationTrials2?: any;
    sipMetaData?: any;
}) => {
    const dispatch = useAppDispatch();

    const handleInputOnChange = (value: number) => {
        if (token) {
            dispatch(
                updateThreshold({
                    symbol: token.symbol,
                    value: Number(value),
                })
            );
        }
        debounceThresholdValueOnChange(value);
    };

    const debounceThresholdValueOnChange = useDebouncedCallback(
        (value: number) => {
            dispatch(triggerThreshold(value));
        },
        250
    );

    if (isHeader) {
        return (
            <Grid container className="token-row-header">
                <Grid item xs={1}>
                    <span className="symbol">Symbol</span>
                </Grid>
                <Grid item container xs={11} className="remaining-fields">
                    {headers.map((header) => {
                        return (
                            <Grid
                                key={header.label}
                                item
                                xs
                                className="remaining-fields__header remaining-fields__cell"
                            >
                                {header.label}
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        );
    } else if (token) {
        console.log(
            "tokentokentokentokentoken: ",
            token.name,
            simulationTrials,
            token.threshold,
            sipMetaData,
        );
        // console.log('yooooooo ', latestThreshold(tokenlist[0].thershold)); // this doesnt work

        // in context are: currentPrice, threshold, usdValue, chance,balance, symbol, name, address
        // apply % chances in price ie simulationTrials to the current price for each trial
        const simulatedPrice = simulationTrials.map(
            (x: number) => x * token.currentPrice
        );
        console.log('simulated price: ', simulatedPrice);
        // this is today's likely price range for charting
        // TODO: let user enter? chanceOperator? for now it is set to < ie risk of going down
        //console.log('token.threshold: ', token.threshold);
        // switch (symbol) {
        //  case '<': case '>': case '<=': case '>=':
        console.log("token.threshold: ", token.threshold); // HOW TO GET DEBOUNCE THRESHOLD?
        // TODO NOT DONE YET
        const chanceOf = simulatedPrice.filter(
            (v: number) => v < token.threshold // Crying this is working
        ); // operator '<' should really be defined by ui/user??
        const chanceOut = chanceOf.length / simulationTrials.length;
        console.log("chanceOut: ", chanceOut);
        console.log("simulationTrials2: ", simulationTrials2);

        // SCATTER PLOT CHART DATA PREP - TODO add current price DOT to this
        let vegaData: any = {
            table: []
        };
        simulationTrials.forEach((element: any, index1: string | number) => {
            vegaData.table[index1] = {
                "a": element, // TODO: fix this
                "Data Type": "History"
            };
        });
        simulationTrials2.forEach((element: any, index1: string | number) => {
            vegaData.table[index1].ETH = element // TODO: fix this
        });
        vegaData.table.append = {
            "Data Type": "Current", "a": 1, "ETH": 1 // TODO updated values needed here, do this in % change land or $?
        };
        console.log("vegaData in balanceCard: ", vegaData);
        // END CHART DATA PREP

        // PUT CHART DATA PREP
        // console.log(tokenList.threshold);
        let vegaPutData: any = {
            table: []
        };
        simulatedPrice.forEach((element: any, index1: string | number) => {
            let elementPut: number;
            let putStrikePrice = 3500; // need debounced threshold
            if (element < putStrikePrice) { // > is for put ie must sell if hits price
                elementPut = putStrikePrice - element;
            } else { elementPut = 0 }
            vegaPutData.table[index1] = {
                "a": element, // TODO: fix this
                "b": elementPut,
                "Data Type": "Put"
            };
            // console.log("put data here: ", vegaPutData)
        });
        /*   */
        // END PUT CHART DATA PREP


        return (
            <Grid container className="token-row">
                <Grid item xs={1}>
                    <span className="symbol">{token.symbol}</span>
                </Grid>
                <Grid item container xs={11} className="remaining-fields">
                    {headers.map((header, index) => {
                        if (header.editable) {
                            return (
                                <Grid
                                    key={`token-${header.key}`}
                                    item
                                    xs
                                    className="remaining-fields__cell"
                                >
                                    <FormControl className="token-row__form-control">
                                        <OutlinedInput
                                            value={token[header.key]}
                                            onChange={(e) => {
                                                handleInputOnChange(
                                                    Number(e.target.value)
                                                );
                                            }}
                                            classes={{
                                                root: "token-row__textfield",
                                                input: "token-row__input",
                                                focused: "token-row__focused",
                                            }}
                                            inputProps={{
                                                min: 0,
                                                type: "number",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            );
                        } else if (header.isChart) {
                            return (
                                <Grid
                                    key={`token-${header.key}`}
                                    item
                                    xs
                                    className="remaining-fields__cell"
                                >
                                    {/* <ChartWrapper token={token} threshold={token.threshold} sip={simulationTrials} /> */}
                                    <Liquidation token={token} threshold={token.threshold} sip={simulationTrials} />%
                                </Grid>
                            );
                        }
                        return (
                            <Grid
                                key={`token-${header.key}`}
                                item
                                xs
                                className="remaining-fields__cell"
                            >
                                {token[header.key]}
                            </Grid>
                        );
                    })}
                </Grid>
                {/*         <Grid item xs={2}>
                    <span className="remaining-fields">
                        {
                            // TODO which class? fluid issue on mobile?
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <ScatterETH
                                    spec={"scatter"}
                                    inputTable={vegaData}
                                    tokenName={token.name}
                                />
                                // bar = colored bar, else coloredline //
                            </div>
                        }
                    </span>
                </Grid> */}
                {/*  <Grid item xs={3}>
                    <span className="remaining-fields">
                        {
                            // TODO which class? fluid issue on mobile?
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <HistogramLive
                                    sip={simulatedPrice}
                                    currentPrice={token.currentPrice}
                                    spec={"bar"} // bar or bar mean
                                />
                            </div>
                        }
                    </span>
                </Grid>
            */}   {/*   <Grid item xs={5}>
                    <span className="remaining-fields">
                        {
                            // TODO which class? fluid issue on mobile?
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <ScatterPut
                                    spec={"scatter"}
                                    inputTable={vegaPutData}
                                    tokenName={token.name}
                                />
                            </div>
                        }
                    </span>
                </Grid>
               */}  {/*  <Grid item xs={4}>
                    <span className="remaining-fields">
                        {
                            // TODO which class? fluid issue on mobile?
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <ScatterCurrentPrice
                                    spec={"scatter"}
                                    inputTable={vegaData}
                                />
                            </div>
                        }
                    </span>
                </Grid> */}
            </Grid>
        );
    }

    return null;
};

export default BalanceCard;
