import Map from "react-map-gl";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const initialViewState = {
    longitude: 60.61,
    latitude: 56.84,
    zoom: 14,
};
export const MapBox = (): JSX.Element => (
    <Map
        id="eventMap"
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
    />
);
