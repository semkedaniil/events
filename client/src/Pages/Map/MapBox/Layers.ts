import type { LayerProps } from "react-map-gl";
import { BackgroundLayer } from "mapbox-gl";

const sourceId = "events";
export const clusterLayer: LayerProps = {
    id: "clusters",
    type: "circle",
    source: sourceId,
    filter: ["has", "point_count"],
    paint: {
        "circle-stroke-width": 1,
        "circle-stroke-color": "rgba(0, 0, 0, 0.2)",
        "circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
};

export const clusterCountLayer: LayerProps = {
    id: "cluster-count",
    type: "symbol",
    source: sourceId,
    filter: ["has", "point_count"],
    layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 14,
    },
};

export const unclusteredSymbolLayer: LayerProps = {
    id: "points",
    type: "symbol",
    source: sourceId,
    filter: ["!", ["has", "point_count"]],
    layout: {
        "icon-image": "event",
        "icon-size": 0.25,
    },
};
