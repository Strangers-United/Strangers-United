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
import { red } from "@mui/material/colors";
import { AbiItem } from "web3-utils";
import { web3Instance } from "../../utils/web3Context";

const OOF = () => {
    const [text, setText] = useState("");
    const [selectedField, setSelectedField] = useState<string>("");
    const [selectedHistoryFields, setSelectedHistoryFields] = useState<
        number[]
    >([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3,
        4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7,
        8, 9,
    ]);
    const [resultTitle, setResultTitle] = useState<string>("");
    // const [web3Instance, setWeb3Instance] = useState<unknown>();
    const [oofContract, setOofContract] = useState<any>();
    const [url, setUrl] = useState(
        "https://eth-rinkeby.alchemyapi.io/v2/-ARIrcFm5LteDd01Aevrp5MOu64F1LC5"
    );
    const [data, setData] = useState<string>("");
    const [historyData, setHistoryData] = useState<string>("");
    const [historyTimestamps, setHistoryTimestamps] = useState<number[]>([
        1633635591, 1633636191, 1633636806, 1633637407, 1633637995, 1633638597,
        1633639212, 1633676757, 1633677342, 1633677943, 1633678573, 1633679143,
        1633679744, 1633680359, 1633680959, 1633681544, 1633682145, 1633682745,
        1633683345, 1633684007, 1633684547, 1633685148, 1633685734, 1633686336,
        1633686938, 1633687569, 1633688155, 1633688785, 1633689341, 1633689941,
        1633690542, 1633691158, 1633691758, 1633692344, 1633692944, 1633693547,
        1633694147, 1633694747, 1633695347, 1633695947, 1633696547, 1633697147,
        1633697747, 1633698363, 1633698948, 1633699549, 1633700150, 1633700751,
        1633701337, 1633701952,
    ]);
    const [account, setAccount] = useState<string>("");

    useEffect(() => {
        // const { account } = useWeb3React();
        // const web3 = new Web3(Web3.givenProvider);
        // let account = "";
        // web3.eth.getAccounts().then((e) => {
        //     account = e[0];
        // });
        // setAccount(account);
        // setWeb3Instance(web3);
        let oofContractAddress: string = "";
        if (process.env.REACT_APP_ENV === "production")
            oofContractAddress = process.env
                .REACT_APP_OOF_PRODUCTION_CONTRACT_ADDRESS as string;
        else
            oofContractAddress = process.env
                .REACT_APP_OOF_LOCAL_CONTRACT_ADDRESS as string;
        const openOracleFramework = new web3Instance.eth.Contract(
            OOFAbi as AbiItem[],
            oofContractAddress
        );
        setOofContract(openOracleFramework);
    }, []);

    const roundUp = (num: number, precision: number) => {
        precision = Math.pow(10, precision);
        return Math.ceil(num * precision) / precision;
    };

    const changeSelectedField = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedField(e.target.value);
    };

    const changeSelectedHistoryFields = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        let array: any = e.target.value;
        try {
            array = array
                .split(",")
                .map((el: any) => parseInt(el))
                .filter((el: any) => !!el);
            for (let i = 0; i < array.length; i++) {
                if (!(array[i] >= 0 && array[i] <= 9)) {
                    return;
                }
            }
            setSelectedHistoryFields(array);
        } catch (e) {
            return;
        }
    };
    const changeHistoryTimestamps = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        let array: any = e.target.value;
        try {
            array = array
                .split(",")
                .map((el: any) => parseInt(el))
                .filter((el: any) => !!el);
            setHistoryTimestamps(array);
        } catch (e) {
            return;
        }
    };
    const fetchDataField = async () => {
        if (parseInt(selectedField) >= 0 && parseInt(selectedField) <= 9) {
            const result = await oofContract.methods
                .getFeed(parseInt(selectedField))
                .call({ from: account });
            setResultTitle(
                `Result for field number ${
                    !!selectedField ? selectedField : "not-defined"
                }`
            );
            setData(
                `Received data for field ${selectedField} is :\n\tValue: ${roundUp(
                    parseFloat(web3Instance.utils.fromWei(result["0"])),
                    2
                )}\n\tTimestamp: ${result["1"]}\n\tDecimal: ${result["2"]}`
            );
        }
        setSelectedField("");
    };
    const fetchDataHistory = async () => {
        if (selectedHistoryFields.length !== historyTimestamps.length) return;

        const result = await oofContract.methods
            .getHistoricalFeeds(selectedHistoryFields, historyTimestamps)
            .call({ from: account });
        setResultTitle(
            `Result for field number ${
                !!selectedField ? selectedField : "not-defined"
            }`
        );
        setHistoryData(
            `Historical data received for files ${selectedHistoryFields} is :\n\tValue:\n${result.map(
                (res: string) =>
                    "\t" +
                    roundUp(parseFloat(web3Instance.utils.fromWei(res)), 2)
            )}`
        );
    };
    const style = {
        maxHeight: "300px",
        minHeight: "300px",
        resize: "none",
        padding: "9px",
        boxSizing: "border-box",
        fontSize: "15px",
    } as any;

    return (
        <Container>
            <h3>
                Get data from Open Oracle Framewrok for fields: ETH/USD,
                BTC/USD, ETH/BTC, EURO/USD, CNY/USD, ETH/CNY, USDT/USD, SIP1,
                SIP2, SIP3
            </h3>
            <hr
                style={{
                    color: "red",
                    backgroundColor: "red",
                    height: 5,
                }}
            />
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
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => changeSelectedField(e)}
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
                        rows={3}
                        name="address"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                    />
                </Form.Group>
            </span>
            <hr
                style={{
                    color: "red",
                    backgroundColor: "red",
                    height: 5,
                }}
            />
            <span>
                <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextPassword"
                >
                    <Form.Label column sm="2">
                        Data history for fields:
                    </Form.Label>
                    <InputGroup className="mb-3">
                        <FormControl
                            value={selectedHistoryFields.toString()}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => changeSelectedHistoryFields(e)}
                            placeholder="Value to Store"
                            aria-label="Value to Store"
                            aria-describedby="basic-addon2"
                        />
                    </InputGroup>
                </Form.Group>
                <Button
                    variant="secondary"
                    id="button-stake"
                    onClick={fetchDataHistory}
                >
                    getHistoryFeeds
                </Button>
            </span>
            <span>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{resultTitle}</Form.Label>
                    <Form.Control
                        style={style}
                        as="textarea"
                        rows={3}
                        name="address"
                        value={historyTimestamps.toString()}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            changeHistoryTimestamps(e)
                        }
                    />
                </Form.Group>
            </span>
            <span>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{resultTitle}</Form.Label>
                    <Form.Control
                        style={style}
                        as="textarea"
                        rows={3}
                        name="address"
                        value={historyData}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setHistoryData(e.target.value)
                        }
                    />
                </Form.Group>
            </span>
        </Container>
    );
};

export default OOF;
