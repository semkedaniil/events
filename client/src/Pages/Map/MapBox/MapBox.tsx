import Map, { useMap, NavigationControl, FullscreenControl, GeolocateControl, ScaleControl } from "react-map-gl";
import GeocoderControl from "../Controls/GeocoderControl";

import { Feature, mapEventsToGeoJson } from "../../../stores/eventsStore/helpers";
import { useEffect, useState } from "react";
import { ClusterLayer } from "../Cluster/ClusterLayer";
import { Cluster } from "../Cluster/Cluster";
import { getAllEvents } from "../../../api/events/events";
import { useEventsStore } from "../../../stores/eventsStore/eventsStore";
import { useLocation } from "react-router-dom";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const initialViewState = {
    latitude: 63.1016,
    longitude: -151.5129,
    zoom: 4,
};

export const MapBox = (): JSX.Element => {
    const map = useMap() as any;
    const [key, setKey] = useState<number>();
    const location = useLocation();
    const { setEvents } = useEventsStore();
    const [geoEvents, setGeoEvents] = useState<Feature[]>();

    useEffect(() => {
        setKey(Math.random() * 5);
    }, [location]);

    useEffect(() => {
        getAllEvents().then(events => {
            setEvents(events);
            setGeoEvents(mapEventsToGeoJson(events));
        });
    }, []);

    const checkIfPositionInViewport = (lat: number, lng: number) => {
        const bounds = map.current?.getMap().getBounds();
        return bounds?.contains([lng, lat]);
    };

    const onSelectMarker = (nextZoom: number, coordinates: [number, number]) => {
        map.current?.flyTo({ zoom: nextZoom, center: coordinates });
    };
    const [_, rerender] = useState<any>("");
    const rerenderMap = ({ viewState: { zoom, latitude, longitude } }: any) => {
        rerender(latitude + longitude);
    };
    return (
        <Map
            key={key}
            onMoveEnd={rerenderMap}
            onZoomEnd={rerenderMap}
            ref={element => (map.current = element)}
            id="eventMap"
            initialViewState={initialViewState}
            style={{ width: "100%", height: "100%" }}
            mapStyle={getMapTheme()}
            mapboxAccessToken={MAPBOX_TOKEN}>
            <ScaleControl position="bottom-right" />
            <GeocoderControl mapboxAccessToken={MAPBOX_TOKEN || ""} position="top-left" />
            <NavigationControl position="bottom-right" />
            <FullscreenControl position="bottom-right" />
            <GeolocateControl position="bottom-right" />
            <ClusterLayer
                mapId="eventMap"
                data={geoEvents}
                onSelectMarker={onSelectMarker}
                ClusterComponent={Cluster}
            />
        </Map>
    );
};

function getMapTheme(): string {
    if (isNightNow()) {
        return "mapbox://styles/mapbox/navigation-night-v1";
    }
    return "mapbox://styles/mapbox/streets-v12";
}

export function isNightNow() {
    const hours = new Date().getHours();
    return hours >= 21 || hours <= 6;
}