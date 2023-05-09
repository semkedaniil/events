import Map, {
    GeoJSONSource,
    useMap,
    NavigationControl,
    FullscreenControl,
    GeolocateControl,
    ScaleControl,
    Marker,
    MapboxEvent,
} from "react-map-gl";
import defaultImage from "../../../assets/avatar.jpg";
import GeocoderControl from "../Controls/GeocoderControl";

import { clusterLayer } from "./Layers";
import cn from "./MapBox.less";
import { getGeoJson } from "../../../stores/eventsStore/helpers";
import { useState } from "react";
import { ClusterLayer } from "../Cluster/ClusterLayer";
import { Cluster } from "../Cluster/Cluster";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const initialViewState = {
    latitude: 63.1016,
    longitude: -151.5129,
    zoom: 1,
};

const pointerEventsNames = ["points"];
export const MapBox = (): JSX.Element => {
    const map = useMap() as any;

    const checkIfPositionInViewport = (lat: number, lng: number) => {
        const bounds = map.current?.getMap().getBounds();
        return bounds?.contains([lng, lat]);
    };

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

    const onSelectMarker = (nextZoom: number, coordinates: [number, number]) => {
        map.current?.flyTo({ zoom: nextZoom, center: coordinates });
    };
    const [_, rerender] = useState<any>("");
    const onZoomEnd = (e: any) => {
        rerender(e.viewState.zoom);
    };
    return (
        <Map
            onZoomEnd={onZoomEnd}
            ref={element => (map.current = element)}
            projection="mercator"
            id="eventMap"
            initialViewState={initialViewState}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            interactiveLayerIds={[clusterLayer.id ?? ""]}
            onClick={onClick}
            mapboxAccessToken={MAPBOX_TOKEN}>
            <ScaleControl position="bottom-right" />
            <GeocoderControl mapboxAccessToken={MAPBOX_TOKEN || ""} position="top-left" />
            <NavigationControl position="bottom-right" />
            <FullscreenControl position="bottom-right" />
            <GeolocateControl position="bottom-right" />
            <ClusterLayer mapId="eventMap" data={getGeoJson()} onSelectMarker={onSelectMarker} ClusterComponent={Cluster} />
        </Map>
    );
};