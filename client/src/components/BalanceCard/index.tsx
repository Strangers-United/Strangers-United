import { Grid, IconButton, FormControl, OutlinedInput } from "@mui/material";
import { useEffect } from "react";
import {
    fetchTokenBalance,
    TokenState,
    ITokenBalanceHeader,
    updateThreshold,
} from "../../reducers/tokenBalance";
import { useAppDispatch, useAppSelector } from "../../store";
import CustomizedCard from "../CustomizedCard";
import "./styles.scss";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useWeb3React } from "@web3-react/core";
import Loading from "../Loading";
import { fetchSlurpLib, SlurpState } from "../../reducers/slurpHydrate";
import TestChartEmbed from "../TestChartEmbed";

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
    //console.log('get simulation data here: ', sipList);

    // ==================================
    // INIT
    // ==================================
    useEffect(() => {
        if (account) {
            getTokenBalance(account);
            getTokenSipMathLib();
        }
    }, [account]);
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
}: {
    token?: TokenState;
    isHeader: boolean;
    headers: ITokenBalanceHeader[];
    simulationTrials?: any;

}) => {
    const dispatch = useAppDispatch();

    const thresholdValueOnChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (token) {
            dispatch(
                updateThreshold({
                    symbol: token.symbol,
                    value: Number(event.target.value),
                })
            );
        }
    };

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
                <Grid item xs={1}>
                    <span className="symbol">{token.symbol}</span>
                </Grid>
                <Grid item container xs={11} className="remaining-fields">
                    {headers.map((header) => {
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
                                            onChange={thresholdValueOnChange}
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
                <Grid item xs={2}>
                    <span className="remaining-fields">{ // TODO which class? fluid issue on mobile?
                        <div style={{ display: "flex", width: "100%", height: "100%" }}>
                            <TestChartEmbed sip={simulatedPrice} spec={'bar2'} />
                            {/* bar = colored bar, else coloredline */}
                        </div>}
                    </span>
                </Grid>
            </Grid>
        );
    }

    return null;
};

export default BalanceCard;
