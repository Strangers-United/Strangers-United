import { useEffect } from "react";
import { useAppSelector } from "../../store";

interface ILiquidation {
    threshold: number;
    token: any;
    sip: any;
}

const Liquidation = (props: ILiquidation) => {
    const sipList = useAppSelector((state) => state.slurpList.slurpList);

    useEffect(() => {
        // console.log("==== threshold change", props.threshold);
        // console.log("==== sipList change", sipList);
        // calculation here
    }, [props.threshold, sipList, props.token]);
    console.log("==== Liquidation render", props.sip, props.token, props.threshold);
    const currentTokenValue = props.token.currentPrice * props.token.balance;
    var currentPriceSim = props.sip.map(x => x * props.token.currentPrice * props.token.balance);

    if (currentTokenValue > props.threshold) {
        const numbTrialsBelow = currentPriceSim.filter((x: number) => x <= props.threshold).length
        console.log("==== currentPriceSim, numbTrialsBelow, #trials, ", currentPriceSim, numbTrialsBelow, props.sip.length);
        const percent = (numbTrialsBelow / props.sip.length) * 100;
        const newChanceOfHit = percent.toFixed(2);
        return <div>{newChanceOfHit}</div>;
    } else if (currentTokenValue < props.threshold) {
        const numbTrialsBelow = currentPriceSim.filter((x: number) => x >= props.threshold).length
        console.log("==== currentPriceSim, numbTrialsBelow, #trials, ", currentPriceSim, numbTrialsBelow, props.sip.length);
        const percent = (numbTrialsBelow / props.sip.length) * 100;
        const newChanceOfHit = percent.toFixed(2);
        return <div>{newChanceOfHit}</div>;
    }
};

export default Liquidation;