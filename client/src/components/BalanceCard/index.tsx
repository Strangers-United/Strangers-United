import { Paper } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { abi, rinkebyTokenList } from "../../utils/token";
import { web3Instance } from "../../utils/web3Context";
import { AbiItem } from "web3-utils";

const BalanceCard = () => {
    // ==================================
    // STATE
    // ==================================
    const { account, active } = useWeb3React();

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
            // const tempAccount = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
            // const weiToken = await web3Instance.eth.getBalance(
            //     tempAccount as string
            // );
            // const eth = web3Instance.utils.fromWei(weiToken, "ether");
            // console.log("==== eth", eth);
            // const daiToken = rinkebyTokenList[0];
            // const daiContract = new web3Instance.eth.Contract(
            //     abi as AbiItem[],
            //     daiToken.address
            // );
            // const daiName = await daiContract.methods.name().call();
            // console.log("==== daiName", daiName);
            // const daiBalance = await daiContract.methods
            //     .balanceOf(tempAccount)
            //     .call();
            // console.log(
            //     "==== dai balance",
            //     web3Instance.utils.fromWei(daiBalance, "ether")
            // );
            // const usdcToken = rinkebyTokenList[1];
            // const usdcContract = new web3Instance.eth.Contract(
            //     abi as AbiItem[],
            //     usdcToken.address
            // );
            // console.log("==== usdcContract", usdcContract);
            // const usdcBalance = await usdcContract.methods
            //     .balanceOf(tempAccount)
            //     .call();
            // console.log(
            //     "==== usdc balance",
            //     web3Instance.utils.fromWei(usdcBalance, "ether")
            // );
        } catch (err) {
            console.log(err);
        }
    };
    // ==================================
    // RENDER
    // ==================================

    return <Paper>123</Paper>;
};

export default BalanceCard;
