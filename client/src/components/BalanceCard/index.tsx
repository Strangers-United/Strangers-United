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

const BalanceCard = () => {
    // ==================================
    // STATE
    // ==================================
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
        getTokenBalance();
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
