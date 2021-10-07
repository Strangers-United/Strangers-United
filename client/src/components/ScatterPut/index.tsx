import { Vega } from 'react-vega';

/* Example https://vega.github.io/vega-lite/docs/point.html */
const ScatterPut = (props: any) => {
    console.log('Use put data for chart ', props.inputTable);
    if (!props.inputTable) {
        return <div></div>; // no data TODO: hack for initial state of sipList is empty crying face
    }
    //Initialize vega-embed because I'm running out of time to do it properly
    let vegaData: any = {
        table: [
            { a: 1, b: 1 },
            { a: 1, b: 1 },
            { a: 1, b: 1 }
        ]
    };
    // if (sipList[0].location !== "init state") { // TODO hack until figure out init state defaults
    //console.log('Use this in textChar props ', props);

    vegaData = props.inputTable;
    console.log('Use this vegaPUTData.table for chart ', vegaData);
    console.log('token name for a/y axis ', props.tokenName);
    const specScatterETH: any = {
        "data": {
            "name": "table"
        }, "mark": { "type": "point" },
        "encoding": {
            "x": {
                "field": "a", "type": "quantitative", "scale": { "zero": false }
            },
            "y": {
                "field": "b", "type": "quantitative", "scale": { "zero": false }, "title": props.tokenName
            },
            "color": { "field": "Data Type", "type": "nominal" },
            "shape": { "field": "Data Type", "type": "nominal" }
        }
    }
    let charSpec = props.spec;
    let useThisChartSpec = charSpec === "scatter" ? specScatterETH : specScatterETH;
    // console.log('Use this in charSpec spec ', charSpec);

    return (
        <div className="Demo" >
            <Vega spec={useThisChartSpec} data={vegaData} />
        </div >
    );
}

export default ScatterPut;