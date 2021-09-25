import React, { ReactNode, FC, useEffect, useState, ReactElement } from "react";
import { injectedConnector } from "../../utils/connector";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import "./style.scss";
import Loading from "../../components/Loading";

type IMetamaskProvider = {
    children: ReactNode;
};

declare let window: any;

const LOCAL_TARGET_NETWORK = "0x539"; // chainId is 1337
const LOCAL_RPC_URL = "HTTP://127.0.0.1:7545";

function MetamaskProvider({ children }: IMetamaskProvider): ReactElement {
    // ==================================
    // STATE
    // ==================================
    const { chainId, account, active, error, activate } = useWeb3React();

    const [isConnectToTargetNetwork, setIsConnectToTargetNetwork] =
        useState(false);
    const [loaded, setLoaded] = useState(false);

    let body = (<Loading />) as React.ReactNode;
    let navbar = null;

    // ==================================
    // INIT
    // ==================================
    useEffect(() => {
        switchToTargetNetwork();
    }, []);

    // ==================================
    // LISTENER
    // ==================================
    useEffect(() => {
        injectedConnector
            .isAuthorized()
            .then((isAuthorized) => {
                setLoaded(true);
                if (isAuthorized && !active && !error) {
                    activate(injectedConnector);
                }
            })
            .catch(() => {
                setLoaded(false);
            });
    }, [activate, active, error]);

    // ==================================
    // FUNCTIONS
    // ==================================
    const switchToTargetNetwork = async () => {
        try {
            if (window.ethereum) {
                await window.ethereum.enable();
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: LOCAL_TARGET_NETWORK }],
                });
                setIsConnectToTargetNetwork(true);
            }
        } catch (switchErr: any) {
            if (switchErr.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: LOCAL_TARGET_NETWORK,
                                rpcUrl: LOCAL_RPC_URL,
                            },
                        ],
                    });
                } catch (addErr) {
                    setIsConnectToTargetNetwork(false);
                }
            }
        }
    };

    const connect = async () => {
        try {
            if (active && !isConnectToTargetNetwork) {
                await switchToTargetNetwork();
            } else if (!active) {
                await activate(injectedConnector);
            }
        } catch (err) {
            console.log("==== err", err);
        }
    };

    // ==================================
    // RENDER
    // ==================================
    if (loaded && (!active || !isConnectToTargetNetwork)) {
        navbar = (
            <button type="button" onClick={connect}>
                Connect
            </button>
        );
    } else if (loaded && active && isConnectToTargetNetwork) {
        navbar = (
            <>
                <div>ChainId: {chainId}</div>
                <div>Account: {account}</div>
            </>
        );
        body = children;
    }

    return (
        <div className="app">
            <div className="nav-bar">{navbar}</div>
            <div className="content">{body}</div>
        </div>
    );
}

export default MetamaskProvider;
