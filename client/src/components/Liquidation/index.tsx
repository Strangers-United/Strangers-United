import { useEffect } from "react";
import { useAppSelector } from "../../store";

interface ILiquidation {
    threshold: number;
    token: any;
    sip: any;
}

const Liquidation = (props: ILiquidation) => {

    //const sipList = useAppSelector((state) => state.slurpList.slurpList);
    //TODO SIP or siplist f me

    useEffect(() => {
        console.log("==== threshold change", props.threshold, props.token.curr);
        // console.log("==== sipList change", sipList);
        // calculation here
    }, [props.threshold, props.token]);
    console.log(
        "==== Liquidation render",
        // props.sip,
        props.token,
        props.threshold
    );
    const currentTokenValue = props.token.currentPrice;
    var currentPriceSim = props.sip.map(
        (x: any) => x * props.token.currentPrice //* props.token.balance
    );
    console.log("==== Liquidation render currenct price sim", currentPriceSim);
    // TODO: calculate liquidation ISN'T WORKING
    if (currentTokenValue > props.threshold) {
        console.log('"==== Liquidation render yes current token price > threshold', currentTokenValue, props.threshold);
        const numbTrialsBelow = currentPriceSim.filter(
            (x: number) => x <= props.threshold
        ).length;
        console.log(
            "==== currentPriceSim, numbTrialsBelow, #trials, ",
            currentPriceSim,
            numbTrialsBelow,
            props.sip.length
        );
        const percent = (numbTrialsBelow / props.sip.length) * 100;
        const newChanceOfHit = percent.toFixed(2);
        if (
            newChanceOfHit === "NaN" ||
            newChanceOfHit === "Infinity" ||
            newChanceOfHit === undefined
        ) {
            return <div>ERROR</div>;
        } else {
            if (newChanceOfHit === "0.00") { // TODO need testing here consider in the money too!
                return <div>Very low </div>;
            } else {
                return <div>{newChanceOfHit}</div>;
            }
        }
    };

    return <div>Enter lower price</div>;
};

export default Liquidation;


/* else if (currentTokenValue < props.threshold) {
    const numbTrialsBelow = currentPriceSim.filter(
        (x: number) => x >= props.threshold
    ).length;
    console.log(
        "==== currentPriceSim, numbTrialsBelow, #trials, ",
        currentPriceSim,
        numbTrialsBelow,
        props.sip.length
    );
    const percent = (numbTrialsBelow / props.sip.length) * 100;
    const newChanceOfHit = percent.toFixed(2);
    if (
        newChanceOfHit === "NaN" ||
        newChanceOfHit === "Infinity" ||
        newChanceOfHit === undefined
    ) {
        return <div>ERROR</div>;
    } else {
        return <div>{newChanceOfHit}</div>;
    } */
    //}
