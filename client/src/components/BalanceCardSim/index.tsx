import { Grid, IconButton } from "@mui/material";
import { useEffect } from "react";
import {
    fetchTokenBalance,
    TokenState,
    ITokenBalanceHeader,
} from "../../reducers/tokenBalance";
import { useAppDispatch, useAppSelector } from "../../store";
import CustomizedCard from "../CustomizedCard";
import "./styles.scss";
import RefreshIcon from "@mui/icons-material/Refresh";
import Loading from "../Loading";
import { fetchSlurpLib, SlurpState } from "../../reducers/slurpHydrate";
import TestChartEmbed from "../TestChartEmbed";


const BalanceCardSim = () => {
    // ==================================
    // STATE
    // ==================================
    const dispatch = useAppDispatch();
    const {
        state: tokenFetchState,
        tokenList,
        headers,
    } = useAppSelector((state) => state.tokenList);
    const sipList = useAppSelector((state) => state.slurpList.slurpList);
    console.log('get simulation data here: ', sipList);

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
        <CustomizedCard
            className="balance-card"
            title="Balance"
            actions={
                <IconButton onClick={getTokenBalance}>
                    <RefreshIcon style={{ color: "#FFF" }} />
                </IconButton>
            }
        >
            {tokenFetchState === "fetched" ? ( //TODO ADD Fetched to sipList
                <>
                    {/* <div className="balance-card__chart"> Portfolio Summary </div>
                    {tokenList.map((token: TokenState, index) => {
                        const allSimulatedPrices = sipList[0].sipMatrices[0];

                    })} */}
                    <TokenRow isHeader headers={headers} />
                    {tokenList.map((token: TokenState, index) => {
                        return (
                            <TokenRow
                                key={token.address}
                                headers={headers}
                                token={token}
                                isHeader={false}
                                simulationTrials={sipList[0].sipMatrices[index]}
                            />
                        )
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
}: {
    token?: TokenState;
    isHeader: boolean;
    headers: ITokenBalanceHeader[];
    simulationTrials?: any;
}) => {
    // const getKeyValue =
    //     <T extends object, U extends keyof T>(obj: T) =>
    //     (key: U) =>
    //         obj[key];

    if (isHeader) {
        return (
            <Grid container className="token-row-header">
                <Grid item xs={2}>
                    <span className="symbol">Symbol</span>
                </Grid>
                <Grid item container xs={10} className="remaining-fields">
                    {headers.map((header) => {
                        return (
                            <Grid
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
        console.log('tokentokentokentokentoken: ', token.name, simulationTrials);
        // in context are: currentPrice, threshold, usdValue, chance,balance, symbol, name, address
        // apply % chances in price ie simulationTrials to the current price for each trial
        const simulatedPrice = simulationTrials.map((x: number) => x * token.currentPrice);
        //console.log('simulatedPrice: ', simulatedPrice);
        // TODO: let user enter? chanceOperator? for now it is set to < ie risk of going down
        //console.log('token.threshold: ', token.threshold);
        // switch (symbol) {
        //  case '<': case '>': case '<=': case '>=':
        console.log('token.threshold: ', token.threshold);
        // TODO NOT DONE YET
        const chanceOf = simulatedPrice.filter((v: number) => v < token.threshold); // operator defined by ui/user??
        const chanceOut = chanceOf.length / simulationTrials.length;

        console.log('chanceOut: ', chanceOut);

        return (
            <Grid container className="token-row">
                <Grid item xs={2}>
                    <span className="symbol">{token.symbol}</span>
                </Grid>
                <Grid item container xs={10} className="remaining-fields">
                    {headers.map((header) => {
                        return (
                            <Grid item xs className="remaining-fields__cell">
                                {token[header.key]}
                            </Grid>
                        );
                    })}
                </Grid>
                <Grid item xs={2}>
                    <span className="remaining-fields">{ // TODO which class? fluid issue on mobile?
                        <div style={{ display: "flex", width: "100%", height: "100%" }}>
                            <TestChartEmbed sip={simulatedPrice} />
                        </div>}
                    </span>
                </Grid>
            </Grid>
        );
    }

    return null;
};

export default BalanceCardSim;
function x(x: any, arg1: (number: any) => number) {
    throw new Error("Function not implemented.");
}

