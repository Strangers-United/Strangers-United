import React, { useEffect, useRef, useState } from 'react';
import { Vega, VegaLite, View } from 'react-vega';
import { vega, VisualizationSpec } from 'vega-embed';


const dataSupplier = () => {
    // TODO Hook this up with the data from the state?? or get from calling component??
    const x = Math.random();
    const y = Math.random();

    let data: any;
    if (x > 0.5) { data = { ETH: y, "Data Type": "History", a: x } } else {
        data = { ETH: y, "Data Type": "Current", a: x }
    }
    return data;
};

const ScatterComboChart = (props: any) => {
    const [view, setView] = useState<View>();

    //const sipList = useAppSelector((state) => state.slurpList.slurpList);
    console.log('Use this in test embed ', props.inputTable);

    let vegaData: any = props.inputTable;
    console.log('Use this vegaData.table for chart ', vegaData.table);

    useEffect(() => {
        function updateGraph() {
            const data = dataSupplier();
            console.log('Use this data for chart ', data);
            const cs = vega
                .changeset()
                .insert(data)
                .remove(null)

            view.change('data', cs).run();
        }

        if (view) {
            updateGraph();
            const interval: number = setInterval(updateGraph, 11110);
            return () => clearInterval(interval);
        }
    }, [view]);

    const spec: VisualizationSpec = {
        "data": {
            "name": "data"
        }, "mark": { "type": "point" },
        "encoding": {
            "x": {
                "field": "ETH", "type": "quantitative", "scale": { "zero": false }
            },
            "y": {
                "field": "a", "type": "quantitative", "scale": { "zero": false }
            },
            "color": { "field": "Data Type", "type": "nominal" },
            "shape": { "field": "Data Type", "type": "nominal" }

        }
    }
    let charSpec = props.spec;
    let useThisChartSpec = charSpec === "scatter" ? spec : specScatterCombo;
    // let useThisChartSpec = specScatterCombo;
    console.log('Use this in charSpec spec ', charSpec); // shoudl be specBar

    return (
        <>
            <div className="Demo" >
                <VegaLite
                    spec={spec}
                    actions={false}
                    renderer={'svg'}
                    onNewView={(view) => setView(view)}
                />
            </div>
        </>
    );
}

export default ScatterComboChart;