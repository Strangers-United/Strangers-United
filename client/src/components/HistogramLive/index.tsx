import embed from 'vega-embed';
import { Vega } from 'react-vega';
import { useAppDispatch, useAppSelector } from "../../store";

/* Example https://vega.github.io/vega-lite/examples/bar.html */
const HistogramLive = (props: any) => {
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
        ]
    };
    // if (sipList[0].location !== "init state") { // TODO hack until figure out init state defaults
    console.log('Use this in textChar props ', props);
    props.sip.forEach((element: any, index1: string | number) => {
        vegaData.table[index1] = {
            "a": index1,
            "b": element,
            "currentPrice": props.currentPrice
        };
    });

    //console.log(vegaData.table.reduce((acc: number, trials: any) => acc = acc > trials.b ? acc : trials.b, 0));
    // }
    //console.log('Use this max value in selected sip ', vegaData.table);

    const specBarColored: any = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": "Simulated Daily Price",
        "config": {
            "style": {
                "cell": {
                    "stroke": "transparent"
                }
            }
        },
        /*         "autosize": {
                    "type": "fit",
                    "contains": "padding"
                }, */

        "data": {
            "name": "table"
        },
        "layer": [{
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
                "type": "bar", "tooltip": true,
                "line": { "color": "darkgreen" },
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
        },
        {
            "mark": "rule",
            "encoding": {
                "x": { "aggregate": "mean", "field": "b" },
                "color": { "value": "red" },
                "size": { "value": 5 }
            }
        }]
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
                    { "offset": 0, "color": "green" },
                    { "offset": 0.5, "color": "lightgreen" },
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
    const specDensity: any = {
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
            "density": "b",
            "bandwidth": 0.3
        }],
        "mark": {
            "type": "area", "color": {
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
                "field": "value",
                "title": "Range",
                "type": "quantitative"
            },
            "y": {
                "field": "density",
                "type": "quantitative"
            }
        }
    }
    const specSimpleLine: any = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Google's stock price over time.",
        "data": {
            "name": "table"
        },
        "mark": "line",
        "encoding": {
            "x": { "field": "a", "type": "temporal" },
            "y": { "field": "b", "type": "quantitative" }
        }
    }
    const specSimpleBarMean: any = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": {
            "name": "table"
        },
        "layer": [{
            "mark": "bar",
            "encoding": {
                "x": { "field": "b", "bin": true },
                "y": { "aggregate": "count" }
            }
        }, {
            "mark": "rule",
            "encoding": {
                "x": { "aggregate": "mean", "field": "b" },
                "color": { "value": "red" },
                "size": { "value": 5 }
            }
        }, {
            "mark": "rule",
            "encoding": {
                "x": { "field": "currentPrice", "aggregate": "mean" },
            },
            "color": { "value": "red" },
            "size": { "value": 5 }
        }
        ]
    }

    let charSpec = props.spec;
    let useThisChartSpec = charSpec === "bar" ? specBarColored : specSimpleBarMean;
    //let useThisChartSpec = specScatterCombo;
    console.log('Use this in charSpec spec ', charSpec); // shoudl be specBar

    return (
        <div className="Demo" >
            <Vega spec={useThisChartSpec} data={vegaData} />
        </div >
    );
}
export default HistogramLive;