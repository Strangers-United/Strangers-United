import React, { useEffect, useRef, useState } from 'react';
import CustomizedCard from "../CustomizedCard";
import { useAppDispatch, useAppSelector } from "../../store";
import "./styles.scss";
import { VegaLite, View } from 'react-vega';
import embed from 'vega-embed';
import { VisualizationSpec } from 'vega-embed';
import * as vega from 'vega';
import { fetchSlurpLib, SlurpState } from "../../reducers/slurpHydrate";


const currentPriceDataSupplier = (slurp: any) => {
    console.log("currentPriceDataSupplier",); // todo
    console.log('this is the slurp ', slurp);
    let vegaData: any[] = [];
    slurp[0].sipMatrices.forEach((element: any, index1: any) => {
        console.log('what is in sipLisnIn ', element, index1);
        element.forEach((trial: any, index2: any) => {
            console.log('what is here ', index2);
            vegaData[index2] = {
                "a": index2,
                "b": trial
            };
        });
        console.log('what is here ', vegaData);
        return {
            vegaData
            // value: sipListIn[0].sipMatrices[0] 
        };
    });
}


const Chart = () => {
    // ==================================
    // STATE
    // ==================================
    const [view, setView] = useState<View>();


    const sipList = useAppSelector((state) => state.slurpList.slurpList);
    // const currentPrice = useAppSelector((state) => state.currentPrice.tokenPrice); // GET CURRENT PRICE??

    console.log("siplist yadda yadda ", sipList); // Good to see this works

    // ==================================
    // INIT
    // ==================================
    useEffect(() => {
        // empty dependency array means this effect will only run once (like componentDidMount in classes)
        function updateGraph() {
            const data: any = currentPriceDataSupplier(sipList);

            console.log("data for charting ",);

            /*             if (!data) {
                            console.error('No data here!');
                            return null
                        } */
            // a = position of token in array b= array or simulated trials
            console.log('this is BBBBB ', data)


        }
        // const result = await embed('#vis', spec);

        //console.log(result.view);

        updateGraph();
        //view.insert('data', cs).run();

        const windowInterval: number = window.setInterval(updateGraph, 11111);
        return () => clearInterval(windowInterval);
        // ?? https://stackoverflow.com/questions/51376589/typescript-what-type-is-f-e-setinterval

    }, [sipList]);
    // ==================================
    // LISTENER
    // ==================================
    // ==================================
    // FUNCTIONS
    // ==================================
    const spec: VisualizationSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        description: 'Price Distribution',
        height: 250, // TODO: seems to be sizing bug on first pain. Co
        width: 600,
        background: "#333333", // TODO: make this a color transparent or match theme
        config: {
            "axis": {
                "grid": false,
                "gridColor": "#dedede"
            }
        },
        data: { name: 'data' },
        layer: [
            {
                encoding: {
                    x: {
                        field: 'x',
                        type: 'ordinal',
                        axis: {
                            title: 'Price Range',
                        },
                    },
                    y: {
                        field: 'value',
                        type: 'quantitative',
                        axis: {
                            title: 'Frequency',
                        },
                    },
                },
                layer: [
                    {
                        mark: {
                            type: 'area',
                            line: {
                                color: 'green',
                            },
                            color: {
                                x1: 1,
                                y1: 1,
                                x2: 1,
                                y2: 0,
                                gradient: 'linear',
                                stops: [
                                    {
                                        offset: 0,
                                        color: 'red',
                                    },
                                    {
                                        offset: 1,
                                        color: 'green',
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    };
    const spec1: VisualizationSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": "Token Price % Change Distribution",
        "data": {
            "name": "data"
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

    // ==================================
    // RENDER
    // ==================================

    return (
        <>
            <h3>Example for stream current price of token into chart</h3>
            <div>
                <VegaLite
                    spec={spec1}
                    actions={false}
                    renderer={'svg'}
                    onNewView={(view) => setView(view)}
                />
            </div>
        </>
    );
}


export default Chart;