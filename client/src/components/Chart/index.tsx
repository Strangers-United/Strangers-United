import React, {
    useEffect,
    useRef,
    useState
} from 'react';
import CustomizedCard from "../CustomizedCard";
import {
    useAppDispatch,
    useAppSelector
} from "../../store";
import "./styles.scss";
import {
    VegaLite,
    View
} from 'react-vega';
import {
    VisualizationSpec
} from 'vega-embed';
import * as vega from 'vega';

const sineDataSupplier = (x: number) => {
    const y = 100 / 2 + 40 * Math.sin(x / 2);
    return {
        x: x,
        value: Math.floor(y)
    };
};

const currentPriceDataSupplier = (x: number) => {
    // TODO get caller? pass as prop? or do here?
}

const Chart = () => {
    // ==================================
    // STATE
    // ==================================
    const [view, setView] = useState<View>();
    const z = -20;
    const x = 0;

    const ref = useRef({
        x,
        z,
    });
    // ==================================
    // INIT
    // ==================================
    useEffect(() => {
        // GET request using fetch inside useEffect React hook
        fetch('https://ipfs.io/ipfs/QmTn16U9YtbMeGkYWtRFZ5XrNA7tiKQYyRSgX4Es3TWouB')
            .then(response => response.json())
            .then(data => console.log(data.sips));

        // empty dependency array means this effect will only run once (like componentDidMount in classes)
        function currentPriceDataSupplier(x: number) {

        }


        function updateGraph() {
            const data = sineDataSupplier(ref.current.x);
            ref.current.x++;
            ref.current.z++;

            const cs = vega
                .changeset()
                .insert(data)
                .remove((t: { x: number; value: number }) => {
                    return t.x < ref.current.z;
                });
            if (!view) {
                console.error('No data here!');
                return null
            }
            view.change('data', cs).run();
        }

        if (view) {
            updateGraph();
            const windowInterval: number = window.setInterval(updateGraph, 1111);
            return () => clearInterval(windowInterval);
            // ?? https://stackoverflow.com/questions/51376589/typescript-what-type-is-f-e-setinterval
        }
    }, [view]);
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

    const specDist: VisualizationSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": "Token Price % Change Distribution",
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

    // ==================================
    // RENDER
    // ==================================

    return (
        <>
            <h3>Daily Token Price % Change - Historical</h3>
            <div>
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


export default Chart;