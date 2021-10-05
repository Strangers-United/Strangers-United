import embed from 'vega-embed';
import { Vega } from 'react-vega';
import { useAppDispatch, useAppSelector } from "../../store";

/* Example https://vega.github.io/vega-lite/examples/bar.html */
const TestChartEmbed = (props: any) => {
    //const sipList = useAppSelector((state) => state.slurpList.slurpList);
    // console.log('Use this in test embed ', sipList);
    if (!props.sip) {
        return <div></div>; // no data TODO: hack for initial state of sipList is empty crying face
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
            "b": element
        };
    });

    //console.log(vegaData.table.reduce((acc: number, trials: any) => acc = acc > trials.b ? acc : trials.b, 0));
    // }
    //console.log('Use this max value in selected sip ', vegaData.table);
    const specLineColored: any = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": "Simulated Daily Price",
        "config": {
            "style": {
                "cell": {
                    "stroke": "transparent"
                }
            }
        },
        "width": 250,
        "height": 125,
        "autosize": {
            "type": "fit",
            "contains": "padding"
        },
        "data": {
            "name": "table"
        },
        "transform": [{
            "bin": true, "field": "b", "as": "bin_Range"
        }, {
            "aggregate": [{ "op": "count", "as": "Count" }],
            "groupby": ["bin_Range", "bin_Range_end"]
        }, {
            "joinaggregate": [{ "op": "sum", "field": "Count", "as": "TotalCount" }]
        }, {
            "calculate": "datum.Count/datum.TotalCount", "as": "PercentOfTotal"
        }
        ],
        "mark": {
            "type": "line", "tooltip": true, "cornerRadiusEnd": 4, "cornerRadius": 4, "interpolate": "monotone", "opacity": 0.5, "strokeWidth": 10,
            "line": { "color": "darkgreen" },
            "color": {
                "x1": 0,
                "y1": 0,
                "x2": 1,
                "y2": 0,
                "gradient": "linear",
                "stops": [
                    { "offset": 0, "color": "red" },
                    { "offset": 0.5, "color": "yellow" },
                    { "offset": 1, "color": "darkgreen" }
                ]
            }
        },
        "encoding": {
            "x": {
                "title": "Range",
                "field": "bin_Range",
                "bin": { "binned": true }
            },
            "x2": { "field": "bin_Range_end" },
            "y": {
                "title": "Relative Frequency",
                "field": "PercentOfTotal",
                "type": "quantitative",
                "axis": {
                    "format": ".1~%"
                }
            }
        }
    }
    const specLineColoredTesting: any = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": "Simulated Daily Price",
        "config": {
            "style": {
                "cell": {
                    "stroke": "transparent"
                }
            }
        },
        "width": 250,
        "height": 125,
        "autosize": {
            "type": "fit",
            "contains": "padding"
        },
        "data": {
            "name": "table"
        },
        "transform": [{
            "bin": true, "field": "b", "as": "bin_Range"
        }, {
            "aggregate": [{ "op": "count", "as": "Count" }],
            "groupby": ["bin_Range", "bin_Range_end"]
        }, {
            "joinaggregate": [{ "op": "sum", "field": "Count", "as": "TotalCount" }]
        }, {
            "calculate": "datum.Count/datum.TotalCount", "as": "PercentOfTotal"
        }
        ],
        "mark": {
            "type": "bar", "binSpacing": 0, "cornerRadius": 4, "tooltip": true,
            "color": {
                "x1": 0,
                "y1": 0,
                "x2": 1,
                "y2": 0,
                "gradient": "linear",
                "stops": [
                    { "offset": 0, "color": "red" },
                    { "offset": 0.5, "color": "yellow" },
                    { "offset": 1, "color": "darkgreen" }
                ]
            }
        },
        "encoding": {
            "x": {
                "title": "Range",
                "field": "bin_Range",
                "bin": { "binned": true }
            },
            "x2": { "field": "bin_Range_end" },
            "y": {
                "title": "Relative Frequency",
                "field": "PercentOfTotal",
                "type": "quantitative",
                "axis": {
                    "format": ".1~%"
                }
            }
        }
    }

    const specBar: any = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": "Simulated Daily Price",
        "config": {
            "style": {
                "cell": {
                    "stroke": "transparent"
                }
            }
        },
        "width": 250,
        "height": 125,
        "autosize": {
            "type": "fit",
            "contains": "padding"
        },
        "data": {
            "name": "table"
        },
        "mark": {
            "type": "bar", "binSpacing": 0, "cornerRadius": 4, "tooltip": true,
            "color": {
                "x1": 0,
                "y1": 0,
                "x2": 1,
                "y2": 0,
                "gradient": "linear",
                "stops": [
                    { "offset": 0, "color": "red" },
                    { "offset": 0.5, "color": "yellow" },
                    { "offset": 1, "color": "darkgreen" }
                ]
            }
        },
        "encoding": {
            "x": {
                "bin": { "maxbins": 30 },
                "title": "",
                "field": "b"
            },
            "y": {
                "title": "frequency",
                "aggregate": "count"
            }
        }
    }

    let charSpec = props.spec;
    let useThisChartSpec = charSpec === "bar" ? specBar : specLineColored;

    console.log('Use this in charSpec spec ', charSpec); // shoudl be specBar

    return (
        <div className="Demo">
            <Vega spec={useThisChartSpec} data={vegaData} />
        </div>
    );
}
export default TestChartEmbed;