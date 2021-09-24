import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { injectedConnector } from "../../utils/Connector";
import { connect } from "../../reducers/metamask";
import "./styles.scss";
import { useAppDispatch } from "../../store";

declare let window: any;

const LOCAL_TARGET_NETWORK = "0x539"; // chainId is 1337
const LOCAL_RPC_URL = "HTTP://127.0.0.1:7545";

const NavBar = () => {
    // ==================================
    // STATE
    // ==================================
    const { chainId, account, active, error, activate } = useWeb3React();
    const [isConnectToTargetNetwork, setIsConnectToTargetNetwork] =
        useState(false);
    const [loaded, setLoaded] = useState(false);
    const dispatch = useAppDispatch();

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

    useEffect(() => {
        if (loaded && active && isConnectToTargetNetwork) {
            console.log("==== trigger dispatch");
            dispatch(connect(account as string));
        }
    }, [loaded, active, isConnectToTargetNetwork]);
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

    const connectMetamask = async () => {
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
    if (loaded && active && isConnectToTargetNetwork) {
        navbar = (
            <>
                <div>ChainId: {chainId}</div>
                <div>Account: {account}</div>
            </>
        );
    } else {
        navbar = (
            <button type="button" onClick={connectMetamask}>
                Connect
            </button>
        );
    }

    return <div className="nav-bar">{navbar}</div>;
};

export default NavBar;
