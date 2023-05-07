import Map, {
    Layer,
    Source,
    GeoJSONSource,
    useMap,
    NavigationControl,
    FullscreenControl,
    GeolocateControl,
    ScaleControl,
    Marker,
} from "react-map-gl";

import defaultImage from "../../../assets/avatar.jpg";
import GeocoderControl from "../Controls/GeocoderControl";

import { clusterCountLayer, clusterLayer, unclusteredPointLayer } from "./Layers";
import cn from "./MapBox.less";
import { getGeoJson } from "./helpers";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const initialViewState = {
    latitude: 56.84,
    longitude: 60.61,
    zoom: 5,
};

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

    const onClickMarker = () => {
        // some logic here
    };

    const renderMarkers = () =>
        getGeoJson().features.map(({ geometry: { coordinates }, properties: { iconSize } }) => {
            const width = iconSize[0];
            const height = iconSize[1];
            // eslint-disable-next-line no-alert
            return (
                <Marker key={coordinates.toString()} latitude={coordinates[1]} longitude={coordinates[0]}>
                    <div
                        style={{
                            backgroundImage: `url(https://placekitten.com/g/${width}/${height}/)`,
                            width: `${width}px`,
                            height: `${height}px`,
                            backgroundSize: "100%",
                        }}
                        onClick={onClickMarker}
                        className={cn("marker")}></div>
                </Marker>
            );
        });
    return (
        <Map
            ref={element => (map.current = element)}
            onLoad={({ target }) => {
                target.loadImage(defaultImage, (error, image) => {
                    if (error) {
                        throw error;
                    }
                    if (!target.hasImage("cat")) {
                        // @ts-ignore
                        target.addImage("cat", image, { sdf: true });
                    }
                });
            }}
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
            <Source
                id="earthquakes"
                type="geojson"
                cluster
                clusterMaxZoom={14}
                clusterRadius={50}
                data={getGeoJson() as any}>
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...unclusteredPointLayer} />
            </Source>
        </Map>
    );
};
