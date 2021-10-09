import { useEffect } from "react";
import { useAppSelector } from "../../store";
import HistogramLive from "../HistogramLive";
import ScatterETH from "../ScatterETH";
interface IScatterWrapper {
    spec: any;
    tokenName: any;
    sip: any;
}

const ScatterWrapper = (props: IScatterWrapper) => {
    const sipList = useAppSelector((state) => state.slurpList.slurpList);

    useEffect(() => {
        // console.log("==== threshold change", props.threshold);
        // console.log("==== sipList change", sipList);
        // calculation here
    }, [sipList]);
    //console.log("==== ScatterWrapper render", props);
    // SCATTER PLOT CHART DATA PREP - TODO add current price DOT to layer in
    // DANGER Decided to just use the scatter against ETH for now ALWAYS first token in list
    let vegaData: any = {
        table: []
    };
    props.sip.forEach((element: any, index1: string | number) => {
        vegaData.table[index1] = {
            "a": element, // hmm a is the same as x? why not call it x?
            "Data Type": "History"
        };
    });
    sipList[0].sipMatrices[0].forEach((element: any, index1: string | number) => {
        vegaData.table[index1].ETH = element // TODO: fix this DANGER
    });
    vegaData.table.append = {
        "Data Type": "Current", "a": 1, "ETH": 1 // TODO updated values needed here, do this in % change land or $?
    };
    //console.log("vegaData in scatterWrapper: ", vegaData);

    return <ScatterETH
        spec={"scatter"}
        inputTable={vegaData}
        tokenName={props.tokenName}
    />;
};

export default ScatterWrapper;