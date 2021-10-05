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
import { useWeb3React } from "@web3-react/core";

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
            </Grid>
        );
    }

    return null;
};

export default BalanceCard;
