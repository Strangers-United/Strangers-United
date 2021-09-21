import React, { ReactNode, FC, useEffect, useState, ReactElement } from "react";
import { injectedConnector } from "../../utils/Connector";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

type IMetamaskProvider = {
    children: ReactNode;
};

declare let window: any;

const LOCAL_TARGET_NETWORK = "0x539"; // chainId is 1337
const LOCAL_RPC_URL = "HTTP://127.0.0.1:7545";

function MetamaskProvider({ children }: IMetamaskProvider): ReactElement {
    const { active, error, activate } = useWeb3React();

    const [isConnectToTargetNetwork, setIsConnectToTargetNetwork] =
        useState(false);
    const [loaded, setLoaded] = useState(false);

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

    useEffect(() => {
        switchToTargetNetwork();
    }, []);

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

    if (loaded && (!active || !isConnectToTargetNetwork)) {
        return (
            <>
                <button type="button" onClick={connect}>
                    Connect
                </button>
                <div>loaded: {loaded ? "true" : "false"}</div>
                <div>active: {active ? "true" : "false"}</div>
                <div>
                    isConnectToTargetNetwork:
                    {isConnectToTargetNetwork ? "true" : "false"}
                </div>
            </>
        );
    }

    if (loaded && active && isConnectToTargetNetwork) {
        return <>{children}</>;
    }

    return <div>Loading</div>;
}

export default MetamaskProvider;
