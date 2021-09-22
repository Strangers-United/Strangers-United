import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";
import MetamaskProvider from "./providers/MetamaskProvider";
import { CustomMessageProvider } from "./providers/MessageProvider";
import CustomSnackBar from "./components/CustomSnackBar";
import Home from "./containers/Home";
import Routes from "./Routes";

function App() {
    const getLibrary = async (provider: any, connector: any) => {
        return new Web3(provider);
    };

    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <MetamaskProvider>
                <CustomMessageProvider>
                    <>
                        <Routes />
                        <CustomSnackBar />
                    </>
                </CustomMessageProvider>
            </MetamaskProvider>
        </Web3ReactProvider>
    );
}

export default App;
