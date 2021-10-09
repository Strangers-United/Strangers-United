import { Vega } from 'react-vega';

/* Example https://vega.github.io/vega-lite/docs/point.html */
const ScatterETH = (props: any) => {
    //console.log('Use this in test embed ', props.inputTable);
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
    //console.log('Use this vegaData.table for chart ', vegaData);
    //console.log('token name for a/y axis ', props.tokenName);
    const specScatterETH: any = {
        "background": null,
        "config": {
            "axis": {
                "labelColor": "#ffffff",
                "tickColor": "#bebec8",
                "titleColor": "white",
                "titleFontWeight": "normal",
                "titleFontSize": 16,
                "labelFont": "Helvetica",
                "titleFont": "Helvetica",

            },
            "view": {
                "strokeWidth": 0
            }
        },
        "data": {
            "name": "table"
        }, "mark": { "type": "point" },
        "encoding": {
            "x": {
                "field": "ETH", "type": "quantitative", "scale": { "zero": false },
            },
            "y": {
                "field": "a", "type": "quantitative", "scale": { "zero": false }, "title": props.tokenName
            },
            "color": { "field": "Data Type", "type": "nominal", "scale": { "range": ["#ff0000", "#00ff00", "#0000ff"] } },
            "shape": { "field": "Data Type", "type": "nominal", "scale": { "range": ["circle", "square", "triangle"] } },
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

export default ScatterETH;