import embed from 'vega-embed';
import { Vega } from 'react-vega';
import { useAppDispatch, useAppSelector } from "../../store";

/* Example https://vega.github.io/vega-lite/examples/bar.html */
const TestChartEmbed = () => {
    const sipList = useAppSelector((state) => state.slurpList.slurpList);
    console.log('Use this in test embed ', sipList);

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
    if (sipList[0].location !== "init state") { // TODO hack until figure out init state defaults
        sipList[0].sipMatrices[4].forEach((element, index1) => {
            vegaData.table[index1] = {
                "a": index1,
                "b": element
            };
        });
        //console.log(vegaData.table.reduce((acc: number, trials: any) => acc = acc > trials.b ? acc : trials.b, 0));
    }
    console.log('Use this max value in selected sip ', vegaData.table);
    const spec: any = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        data: {
            /* TODO: Change data to bitcoinData */
            values: [
                { day: "Mon", value: 120 },
                { day: "Tue", value: 200 },
                { day: "Wed", value: 150 },
                { day: "Thu", value: 70 },
                { day: "Fri", value: 110 }
            ]
        },
        mark: "bar",
        width: 600,
        height: 200,
        /* TODO: Update the encoding to display bitcoin price over time */
        encoding: {
            x: { field: "day", type: "nominal" },
            y: { field: "value", type: "quantitative" }
            /* Challenge 1: Try customizing the bar color */
        }
    };
    const spec1: any = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": "Portfolio Price % Change Distribution",
        "data": {
            "name": "table"
        },
        "mark": "bar",
        "encoding": {
            "x": {
                "bin": true,
                "field": "b"
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