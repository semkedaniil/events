import Map, { Layer, Source, GeoJSONSource, useMap } from "react-map-gl";

import GeocoderControl from "../Controls/GeocoderControl";

import { clusterCountLayer, clusterLayer, unclusteredPointLayer } from "./Layers";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const initialViewState = {
    latitude: 56.84,
    longitude: 60.61,
    zoom: 5,
};

const geojson = {
    type: "FeatureCollection",
    features: [
        { type: "Feature", geometry: { type: "Point", coordinates: [60.61, 56.84] } },
    ],
};

export const MapBox = (): JSX.Element => {
    const map = useMap();
    const onClick = (event: any) => {
        const feature = event.features[0];

        const clusterId = feature?.properties?.cluster_id;

        const mapboxSource = map.current?.getSource("earthquakes") as GeoJSONSource;

        mapboxSource.getClusterExpansionZoom(clusterId, (error, zoom) => {
            if (error) {
                return;
            }

            if (feature?.geometry) {
                map.current?.easeTo({
                    center: feature.geometry.coordinates,
                    zoom,
                    duration: 500,
                });
            }
        });
    };
    return (
        <Map
            ref={map as any}
            id="eventMap"
            initialViewState={initialViewState}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            interactiveLayerIds={[clusterLayer.id ?? ""]}
            onClick={onClick}
            mapboxAccessToken={MAPBOX_TOKEN}
        >
            <GeocoderControl mapboxAccessToken={MAPBOX_TOKEN || ""} position="top-left" />
            <Source id="earthquakes"
                    type="geojson"
                    cluster
                    clusterMaxZoom={14}
                    clusterRadius={50}
                    data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson">
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...unclusteredPointLayer} />
            </Source>
        </Map>
    );
};
