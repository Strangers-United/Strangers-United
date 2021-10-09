import { useEffect } from "react";
import { useAppSelector } from "../../store";
import HistogramLive from "../HistogramLive";
interface IChartWrapper {
    threshold: number;
    token: any;
    sip: any;
}

const ChartWrapper = (props: IChartWrapper) => {
    const sipList = useAppSelector((state) => state.slurpList.slurpList);

    useEffect(() => {
        // console.log("==== threshold change", props.threshold);
        // console.log("==== sipList change", sipList);
        // calculation here
    }, [props.threshold, sipList, props.token]);
    //console.log("==== ChartWrapper render", props.sip, props.token, props.threshold);

    return <HistogramLive
        sip={props.sip}
        currentPrice={props.token.currentPrice}
        spec={"bar"} // bar or bar mean
    />;
};

export default ChartWrapper;