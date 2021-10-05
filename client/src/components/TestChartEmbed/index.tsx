import embed from 'vega-embed';
import { Vega } from 'react-vega';
import { useAppDispatch, useAppSelector } from "../../store";

/* Example https://vega.github.io/vega-lite/examples/bar.html */
const TestChartEmbed = (props: any) => {
    //const sipList = useAppSelector((state) => state.slurpList.slurpList);
    // console.log('Use this in test embed ', sipList);
    if (!props.sip) {
        return <div>No Data</div>;
    }
    let vegaData: any = {
        table: [
            { a: 1, b: 10 },
            { a: 2, b: 10 },
            { a: 3, b: 10 },
            { a: 4, b: 10 },
            { a: 5, b: 10 },
            { a: 1, b: 10 },
            { a: 2, b: 10 },
            { a: 3, b: 10 },
            { a: 4, b: 10 },
            { a: 5, b: 10 },
            { a: 1, b: 10 },
            { a: 2, b: 10 },
            { a: 3, b: 10 },
            { a: 4, b: 10 },
            { a: 5, b: 10 }
        ]
    };
    // if (sipList[0].location !== "init state") { // TODO hack until figure out init state defaults
    console.log('Use this in textChar props ', props);
    props.sip.forEach((element: any, index1: string | number) => {
        vegaData.table[index1] = {
            "a": index1,
            "Range": element
        };
    });
    //console.log(vegaData.table.reduce((acc: number, trials: any) => acc = acc > trials.b ? acc : trials.b, 0));
    // }
    //console.log('Use this max value in selected sip ', vegaData.table);

    const spec1: any = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": "Simulated Daily Price",
        "width": 250,
        "height": 125,
        "autosize": {
            "type": "fit",
            "contains": "padding"
        },
        "data": {
            "name": "table"
        },
        "mark": "bar",
        "encoding": {
            "x": {
                "bin": true,
                "field": "Range"
            },
            "y": {
                "aggregate": "count"
            }
        }
    }
    return (
        <div className="Demo">
            <Vega spec={spec1} data={vegaData} />
        </div>
    );
}
export default TestChartEmbed;