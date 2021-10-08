import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles.css";
import {
    Container,
    Row,
    Col,
    FormControl,
    InputGroup,
    Button,
    Form,
    Badge,
} from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import OOFAbi from "../../abis/oof";
import Web3 from "web3";

const OOF = () => {
    const [text, setText] = useState("");
    const [selectedField, setSelectedField] = useState<string>("");
    const [resultTitle, setResultTitle] = useState<string>("");
    const [web3Instance, setWeb3Instance] = useState<unknown>();
    const [oofContract, setOofContract] = useState<unknown>();
    const [url, setUrl] = useState(
        "https://eth-rinkeby.alchemyapi.io/v2/-ARIrcFm5LteDd01Aevrp5MOu64F1LC5"
    );
    const [data, setData] = useState<string>("");
    const [account, setAccount] = useState<string>("");

    useEffect(() => {
        // const { account } = useWeb3React();
        const web3 = new Web3(Web3.givenProvider);
        let account = "";
        web3.eth.getAccounts().then(e => {
            account=e[0]; 
        });
        setAccount(account);
        setWeb3Instance(web3);
        let oofContractAddress: string = "";
        if (process.env.REACT_APP_ENV === "production") {
            oofContractAddress = "";
        }
        else {
            oofContractAddress = "0xB46cE22B337375531F9A44B95F71B6494A1bf766";
        }
        const openOracleFramework = new web3.eth.Contract(
            OOFAbi,
            oofContractAddress
        );
        setOofContract(openOracleFramework);
    }, []);

    const roundUp = (num: number, precision: number) => {
        precision = Math.pow(10, precision)
        return Math.ceil(num * precision) / precision
    }

    const changeSelectedField = (e) => {
        setSelectedField(e.target.value);
    }

    const fetchDataField = async () => {
        if (parseInt(selectedField) >= 0 && parseInt(selectedField) <= 9) {
            const result = await oofContract.methods.getFeed(parseInt(selectedField)).call({from: account});
            setResultTitle(`Result for field number ${!!selectedField ? selectedField : "not-defined"}`);
            setData(`Received data for field ${selectedField} is :\n\tValue: ${roundUp(web3Instance.utils.fromWei(result["0"]), 2)}\n\tTimestamp: ${result["1"]}\n\tDecimal: ${result["2"]}`);
        }
        setSelectedField("");
    }
    const style = {
        maxHeight:'300px',
        minHeight:'300px',
          resize:'none',
          padding:'9px',
          boxSizing:'border-box',
          fontSize:'15px'};
    return (
        <Container>
            <span>
            <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextPassword"
            >
                <Form.Label column sm="2">
                    Show data for field:
                </Form.Label>
                <InputGroup className="mb-3">
                    <FormControl
                        value={selectedField}
                        onChange={(e) => changeSelectedField(e)}
                        pattern="[0-9]*"
                        placeholder="Value to Store"
                        aria-label="Value to Store"
                        aria-describedby="basic-addon2"
                    />
                </InputGroup>
            </Form.Group>
            <Button
                    variant="secondary"
                    id="button-stake"
                    onClick={fetchDataField}
                >
                getFeed
                </Button>
            </span>
            <span>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>{resultTitle}</Form.Label>
                <Form.Control
                    style={style}
                    as="textarea"
                    rows="3"
                    name="address"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    />
            </Form.Group>
            </span>
        </Container>
    );
};

export default OOF;
