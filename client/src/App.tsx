import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";
import Layout from "./components/Layout";
import { CustomMessageProvider } from "./providers/MessageProvider";
import CustomSnackBar from "./components/CustomSnackBar";
import Routes from "./Routes";
import { Provider } from "react-redux";
import { store } from "./store";

function App() {
    const getLibrary = async (provider: any, connector: any) => {
        return new Web3(provider);
    };

    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <Provider store={store}>
                <Layout>
                    <CustomMessageProvider>
                        <>
                            <Routes />
                            <CustomSnackBar />
                        </>
                    </CustomMessageProvider>
                </Layout>
            </Provider>
        </Web3ReactProvider>
    );
}

export default App;
