import { web3Instance } from "./Web3Context";
import Adoption from "../abis/Adoption.json";

const getContract = async () => {
    const networkId = await web3Instance.eth.net.getId();
    const networkData = (Adoption as any).networks[networkId];
    const abi = Adoption.abi as any;
    const address = networkData.address;
    const contract = new web3Instance.eth.Contract(abi, address);

    return contract;
};

export default getContract;
