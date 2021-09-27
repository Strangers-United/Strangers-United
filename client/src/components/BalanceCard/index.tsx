import { IconButton } from "@mui/material";
import { useEffect } from "react";
import { fetchTokenBalance, TokenState } from "../../reducers/tokenBalance";
import { useAppDispatch, useAppSelector } from "../../store";
import CustomizedCard from "../CustomizedCard";
import "./styles.scss";
import RefreshIcon from "@mui/icons-material/Refresh";

const BalanceCard = () => {
    // ==================================
    // STATE
    // ==================================
    const dispatch = useAppDispatch();
    const tokenList = useAppSelector((state) => state.tokenList.tokenList);

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
            title="Balance"
            actions={
                <IconButton onClick={getTokenBalance}>
                    <RefreshIcon />
                </IconButton>
            }
        >
            <TokenRow isHeader />
            {tokenList.map((token: TokenState) => {
                return (
                    <TokenRow
                        symbol={token.symbol}
                        balance={token.balance}
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
    isHeader,
}: {
    symbol?: string;
    balance?: number;
    isHeader: boolean;
}) => {
    if (isHeader) {
        return (
            <div className="token-row-header">
                <span className="symbol">Symbol</span>
                <span className="balance">Balance</span>
            </div>
        );
    }
    return (
        <div className="token-row">
            <span className="symbol">{symbol}</span>
            <span className="balance">{balance}</span>
        </div>
    );
};

export default BalanceCard;
