import { useEffect } from "react";
import { useAppSelector } from "../../store";

interface IChartWrapper {
    threshold: number;
}

const ChartWrapper = (props: IChartWrapper) => {
    const sipList = useAppSelector((state) => state.slurpList.slurpList);

    useEffect(() => {
        console.log("==== threshold change", props.threshold);
        console.log("==== sipList change", sipList);
        // calculation here
    }, [props.threshold, sipList]);

    return <div>Chart Wrapper : {props.threshold}</div>;
};

export default ChartWrapper;
