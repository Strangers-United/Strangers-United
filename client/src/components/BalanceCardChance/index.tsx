import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { abi, rinkebyTokenList } from "../../utils/token";
import { web3Instance } from "../../utils/web3Context";
import { AbiItem } from "web3-utils";
import CustomizedCard from "../CustomizedCard";
import { fetchTokenBalance, TokenState } from "../../reducers/tokenBalance";
import { useAppDispatch, useAppSelector } from "../../store";
import "./styles.scss";

const BalanceCardChance = () => {
    // ==================================
    // STATE
    // ==================================
    const { account, active } = useWeb3React();
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
        <CustomizedCard title="Portfolio">
            <TokenRow isHeader />
            {tokenList.map((token: TokenState) => {
                console.log('this is my token ', token.name);
                return (
                    <TokenRow
                        symbol={token.symbol}
                        balance={token.balance}
                        currentUsd={token.balance}
                        liquidationPrice={token.balance}
                        chanceofHitting={token.balance}
                        distribution={token.balance}
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
    distribution?: number;
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
        </div>
    );
};

export default BalanceCardChance;
