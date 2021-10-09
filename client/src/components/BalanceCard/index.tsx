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
import { useDebouncedCallback } from "use-debounce";
//import { tokenList } from "../../utils/token"; // Don't need this anymore??
import Liquidation from "../Liquidation";
import ChartWrapper from "../ChartWrapper";
import ScatterWrapper from "../ScatterWrapper";

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
    console.log("get simulation data here: ", sipList);
    const [lastestThreshold, setLatestThreshold] = useState(0);
    // ==================================
    // INIT
    // ==================================
    useEffect(() => {
        if (account) {
            getTokenBalance(account);
            getTokenSipMathLib();
        }
    }, [account]);

    useEffect(() => {
        if (tokenList.length > 0) {
            console.log("tokenList changed");
            console.log("inside use effect threshold", tokenList[0].threshold);
        }
    }, [tokenList]);
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

    const getProperty = (obj: any, index: number) => {
        return obj[Object.keys(obj)[index]];
    };

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
                                sipMetaData={getProperty(
                                    sipList[0].sipOGMetaData,
                                    index
                                )} // TO check for undefined??
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
            sipMetaData
        );
        // Generic data prep
        const simulatedPrice = simulationTrials.map(
            (x: number) => x * token.currentPrice
        );
        console.log("simulated price: ", simulatedPrice);
        // END Generic data prep

        // SAVE and move to PutWrapper - PUT CHART DATA PREP
        /*  let vegaPutData: any = {
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
     }); */
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
                        } else if (header.isChanceOf) {
                            return (
                                <Grid
                                    key={`token-${header.key}`}
                                    item
                                    xs
                                    className="remaining-fields__cell"
                                >
                                    <Liquidation
                                        token={token}
                                        threshold={token.threshold}
                                        sip={simulationTrials}
                                    />
                                    %
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
                                    <ChartWrapper
                                        token={token}
                                        threshold={token.threshold}
                                        sip={simulatedPrice}
                                    />
                                </Grid>
                            );
                        } else if (header.isScatter) {
                            return (
                                <Grid
                                    key={`token-${header.key}`}
                                    item
                                    xs
                                    className="remaining-fields__cell"
                                >
                                    <ScatterWrapper
                                        spec={"scatter"}
                                        sip={simulationTrials}
                                        tokenName={token.name}
                                    />
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
            </Grid>
        );
    }

    return null;
};

export default BalanceCard;
