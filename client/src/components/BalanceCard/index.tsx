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

    // ==================================
    // INIT
    // ==================================
    useEffect(() => {
        if (account) {
            getTokenBalance(account);
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
                    {tokenList.map((token: TokenState) => {
                        return (
                            <TokenRow
                                key={token.address}
                                headers={headers}
                                token={token}
                                isHeader={false}
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
}: {
    token?: TokenState;
    isHeader: boolean;
    headers: ITokenBalanceHeader[];
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
            </Grid>
        );
    }

    return null;
};

export default BalanceCard;
