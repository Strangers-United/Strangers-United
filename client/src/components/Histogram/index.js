import { createClassFromSpec } from "react-vega";

const spec = {
  width: 500,
  height: 200,
  data: [{ name: "table" }],
  signals: [
    {
      name: "tooltip",
      value: {},
      on: [
        { events: "rect:mouseover", update: "datum" },
        { events: "rect:mouseout", update: "{}" }
      ]
    }
  ],
  scales: [
    {
      name: "xscale",
      type: "band",
      domain: { data: "table", field: "percentChange" },
      range: "width"
    },
    {
      name: "yscale",
      domain: { data: "table", field: "index" },
      nice: true,
      range: "height"
    }
  ],

  axes: [
    { orient: "bottom", scale: "xscale" },
    { orient: "left", scale: "yscale" }
  ],

  marks: [
    {
      type: "rect",
      from: { data: "table" },
      encode: {
        enter: {
          x: { scale: "xscale", field: "percentChange", offset: 1 },
          width: { scale: "xscale", band: 1, offset: -1 },
          y: { scale: "yscale", field: "index" },
          y2: { scale: "yscale", value: 0 }
        },
        update: {
          fill: { value: "steelblue" }
        },
        hover: {
          fill: { value: "red" }
        }
      }
    },
    {
      type: "text",
      encode: {
        enter: {
          align: { value: "center" },
          baseline: { value: "bottom" },
          fill: { value: "#fff" }
        },
        update: {
          x: { scale: "xscale", signal: "tooltip.index", band: 0.5 },
          y: { scale: "yscale", signal: "tooltip.percentChange", offset: -2 },
          text: { signal: "tooltip.percentChange" },
          fillOpacity: [{ test: "datum === tooltip", value: 0 }, { value: 1 }]
        }
      }
    }
  ]
};

const spec2 = {
  mark: {type: "area", color: "#0084FF", interpolate: "monotone"},
  encoding: {
    x: {
      field: "date",
      type: "temporal",
      timeUnit: "yearmonthdate",
      axis: {title: "Date"}
    },
    y: {
      field: "active_users",
      type: "quantitative",
      axis: {title: "Active Users"}
    },
    opacity: {"value": 1}
  },
  width: 400,
  height: 300,
  data: {
    values: [
      {"active_users": 0, "date": "2019-10-01"},
      {"active_users": 2, "date": "2019-10-02"},
      {"active_users": 0, "date": "2019-10-03"},
      {"active_users": 1, "date": "2019-10-04"},
      {"active_users": 0, "date": "2019-10-05"},
      {"active_users": 0, "date": "2019-10-06"},
      {"active_users": 1, "date": "2019-10-07"}
    ]
  },
  config: {}
}
    
  
const Histogram = createClassFromSpec({
  spec2
});

export default Histogram;
