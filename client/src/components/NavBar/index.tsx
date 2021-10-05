import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { injectedConnector } from "../../utils/connector";
import { connect } from "../../reducers/metamask";
import "./styles.scss";
import { useAppDispatch } from "../../store";
import { Button } from "@mui/material";
// import { makeStyles } from "@material-ui/core/styles";
import { IRoute, routeArr } from "../../Routes";
import { Link, useLocation } from "react-router-dom";

declare let window: any;

// const useStyles = makeStyles({
//     containedPrimary: {
//         backgroundColor: "#9EB3C2",
//         marginLeft: "auto",
//         "&:hover": {
//             backgroundColor: "#253361",
//         },
//     },
// });

const NavBar = () => {
    // ==================================
    // STATE
    // ==================================
    const { chainId, account, active, error, activate } = useWeb3React();
    const [isConnectToTargetNetwork, setIsConnectToTargetNetwork] = useState(
        false
    );
    const [loaded, setLoaded] = useState(false);
    const dispatch = useAppDispatch();
    // const classes = useStyles();
    const location = useLocation();

    let connectBtn = null;

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
            dispatch(connect(account as string));
        }
    }, [loaded, active, isConnectToTargetNetwork]);
    // ==================================
    // FUNCTIONS
    // ==================================
    const switchToTargetNetwork = async () => {
        const network =
            process.env.REACT_APP_ENV === "production"
                ? process.env.REACT_APP_CHAINID
                : process.env.REACT_APP_DEV_CHAINID;
        try {
            if (window.ethereum) {
                await window.ethereum.enable();
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: network }],
                });
                setIsConnectToTargetNetwork(true);
            }
        } catch (switchErr) {
            // add network if not exist
            if (switchErr.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: network,
                                rpcUrl: process.env.REACT_APP_GANACHE_RPC,
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
        // keep first four and last four
        const shortenAccount =
            account?.slice(0, 4) + "..." + account?.slice(-4);
        connectBtn = <div className="address-container">{shortenAccount}</div>;
    } else {
        connectBtn = (
            <Button
                variant="contained"
                color="primary"
                className="connect-btn"
                // className={classes.containedPrimary}
                onClick={connectMetamask}
            >
                Connect
            </Button>
        );
    }

    return (
        <div className="nav-bar">
            <div className="nav-bar-router">
                {routeArr.map((route: IRoute) => {
                    const isSelected = route.path === location.pathname;
                    return (
                        <Link
                            to={route.path}
                            key={route.path}
                            className={`nav-bar-router-item ${
                                isSelected ? "selected" : ""
                            }`}
                        >
                            {route.name.toUpperCase()}
                        </Link>
                    );
                })}
            </div>
            {connectBtn}
        </div>
    );
};

export default NavBar;
