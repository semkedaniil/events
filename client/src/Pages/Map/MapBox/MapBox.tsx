import Map, { useMap, NavigationControl, FullscreenControl, GeolocateControl, ScaleControl, Popup } from "react-map-gl";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { Button } from "@skbkontur/react-ui";

import { Event } from "../../../Commons/types/Event";
import GeocoderControl from "../Controls/GeocoderControl";
import { Feature, mapEventsToGeoJson } from "../../../stores/eventsStore/helpers";
import { ClusterLayer } from "../Cluster/ClusterLayer";
import { Cluster } from "../Cluster/Cluster";
import { getAllEvents } from "../../../api/events/events";
import { useEventsStore } from "../../../stores/eventsStore/eventsStore";
import { ColumnStack } from "../../../ui/components/ColumnStack/ColumnStack";

import cn from "./MapBox.less";
import { useSocket } from "../../../socket/socket";

export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export const initialViewState = {
    latitude: 56.699_491_016_552_6,
    longitude: 60.812_511_332_593_57,
    zoom: 4,
};

export const MapBox = (): JSX.Element | null => {
    const map = useMap() as any;
    const socket = useSocket();
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState<number>();
    const location = useLocation();
    const navigate = useNavigate();
    const { setEvents, events } = useEventsStore();
    const [geoEvents, setGeoEvents] = useState<Feature[]>();
    const [showCreatePopup, setShowCreatePopup] = useState<{ coordinates: mapboxgl.LngLat; address?: string } | null>(
        null
    );

    useEffect(() => {
        setKey(Math.random() * 5);
    }, [location]);

    const onConnect = () => {
        console.info("Connected");
    };
    const onEventUpdated = (updatedEvent: Event) => {
        setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    };
    useEffect(() => {
        socket.timeout(5000).connect();
        socket.on("connect", onConnect);
        socket.on("event updated", onEventUpdated);
        loadEvents();
        return () => {
            socket.off("connect", onConnect);
            socket.off("event updated", onEventUpdated);
        };
    }, []);

    useEffect(() => {
        setGeoEvents(mapEventsToGeoJson(events));
    }, [events]);

    async function loadEvents() {
        setLoading(true);
        try {
            const events = await getAllEvents();
            setEvents(events);
        } finally {
            setLoading(false);
        }
    }

    const checkIfPositionInViewport = (lat: number, lng: number) => {
        const bounds = map.current?.getMap().getBounds();
        return bounds?.contains([lng, lat]);
    };

    const onSelectMarker = (nextZoom: number, coordinates: [number, number]) => {
        map.current?.flyTo({ zoom: nextZoom, center: coordinates });
    };

    const onMapClick = async ({ lngLat: coordinates, originalEvent: { target } }: mapboxgl.MapLayerMouseEvent) => {
        // @ts-ignore
        if (target?.className !== "mapboxgl-canvas") {
            return;
        }
        if (showCreatePopup) {
            setShowCreatePopup(null);
        } else {
            const address = await getNearestAddressByCoordinates(
                coordinates.lng.toString(),
                coordinates.lat.toString()
            );
            setShowCreatePopup({ coordinates, address });
        }
    };
    const [rerender, setRerender] = useState<string>("");
    const rerenderMap = ({ viewState: { latitude, longitude } }: any) => {
        setRerender(latitude + longitude);
    };

    const onValueChange = (updatedEvent: Event) => {
        const event = events.find(event => event.id === updatedEvent.id);
        const geoEvent = geoEvents?.find(event => event.properties.id === updatedEvent.id);
        if (event) {
            event.marks = { ...updatedEvent.marks };
        }

        if (geoEvent) {
            geoEvent.properties.marks = { ...updatedEvent.marks };
        }
    };

    if (loading && !geoEvents) {
        return null;
    }
    return (
        <Map
            key={key}
            onClick={onMapClick}
            onMoveEnd={rerenderMap}
            onZoomEnd={rerenderMap}
            ref={map}
            id="eventMap"
            initialViewState={initialViewState}
            style={{ width: "100%", height: "100%" }}
            mapStyle={getMapTheme()}
            mapboxAccessToken={MAPBOX_TOKEN}>
            {showCreatePopup && (
                <Popup
                    closeButton
                    className={cn("creation-popup")}
                    maxWidth="400px"
                    longitude={showCreatePopup.coordinates?.lng}
                    latitude={showCreatePopup.coordinates?.lat}
                    onClose={() => setShowCreatePopup(null)}>
                    <ColumnStack className={cn("creation-popup")}>
                        <h2>Создать событие?</h2>
                        <main>
                            <span>
                                Текущие координаты:{" "}
                                <span className={cn("coordinates")}>
                                    ({showCreatePopup.coordinates.lng.toFixed(3)},{" "}
                                    {showCreatePopup.coordinates.lat.toFixed(3)})
                                </span>
                            </span>
                            <div>
                                Это рядом с <i>&ldquo;{showCreatePopup.address}&rdquo;</i>
                            </div>
                        </main>
                        <div className={cn("buttons")}>
                            <Button
                                use="primary"
                                width="50%"
                                onClick={() =>
                                    navigate(
                                        `/event/create?lng=${showCreatePopup.coordinates.lng}&lat=${showCreatePopup.coordinates.lat}`
                                    )
                                }>
                                Создать
                            </Button>
                            <Button use="default" width="50%" onClick={() => setShowCreatePopup(null)}>
                                Закрыть
                            </Button>
                        </div>
                    </ColumnStack>
                </Popup>
            )}
            <ScaleControl position="bottom-right" />
            <GeocoderControl mapboxAccessToken={MAPBOX_TOKEN || ""} position="top-left" />
            <NavigationControl position="bottom-right" />
            <FullscreenControl position="bottom-right" />
            <GeolocateControl position="bottom-right" />
            <ClusterLayer
                mapId="eventMap"
                data={geoEvents}
                onValueChange={onValueChange}
                onSelectMarker={onSelectMarker}
                ClusterComponent={Cluster}
            />
        </Map>
    );
};

async function getNearestAddressByCoordinates(lon: string, lat: string): Promise<string> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_TOKEN}`;
    const data = await fetch(url).then(x => x.json());
    return data?.features?.[0].place_name ?? "";
}

export function getMapTheme(): string {
    if (isNightNow()) {
        return "mapbox://styles/mapbox/navigation-night-v1";
    }
    return "mapbox://styles/mapbox/streets-v12";
}

export function isNightNow() {
    const hours = new Date().getHours();
    return hours >= 21 || hours <= 6;
}