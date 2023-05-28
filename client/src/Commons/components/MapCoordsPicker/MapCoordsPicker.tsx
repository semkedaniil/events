import { Button, Modal } from "@skbkontur/react-ui";
import Map, { Marker } from "react-map-gl";
import React, { useState } from "react";
import mapboxgl from "mapbox-gl";
// @ts-ignore
import MapboxWorker from "mapbox-gl/dist/mapbox-gl-csp-worker";

import { getMapTheme, initialViewState, MAPBOX_TOKEN } from "../../../Pages/Map/MapBox/MapBox";
import GeocoderControl from "../../../Pages/Map/Controls/GeocoderControl";
import markerPng from "../../../assets/marker.png";
import { RowStack } from "../../../ui/components/RowStack/RowStack";
import { Location } from "../../types/Event";

interface MapCoordsPickerProps {
    onSaveCoordinates: (newLocationCoords: Location | null) => void;
    onCloseModal: () => void;
}

// @ts-ignore
mapboxgl.workerClass = MapboxWorker;
export const MapCoordsPicker = ({ onSaveCoordinates, onCloseModal }: MapCoordsPickerProps) => {
    const [newLocationCoords, setNewLocationCoords] = useState<Location | null>(null);
    const onMapClick = ({ lngLat: { lat, lng } }: mapboxgl.MapLayerMouseEvent) => {
        setNewLocationCoords({ latitude: lat, longitude: lng });
    };

    const onMarkerClick = (event: mapboxgl.MapboxEvent<MouseEvent>) => {
        event.originalEvent.stopPropagation();
        setNewLocationCoords(null);
    };

    const onCLose = () => {
        setNewLocationCoords(null);
        onCloseModal();
    };

    return (
        <Modal onClose={onCLose}>
            <Modal.Header>
                <b>Выберите новое местоположение</b>
            </Modal.Header>
            <Modal.Body>
                <Map
                    onClick={onMapClick}
                    id="eventCreationMap"
                    initialViewState={initialViewState}
                    projection="globe"
                    style={{ width: "100%", height: "250px", borderRadius: "16px" }}
                    mapStyle={getMapTheme()}
                    mapboxAccessToken={MAPBOX_TOKEN}>
                    <GeocoderControl mapboxAccessToken={MAPBOX_TOKEN || ""} position="top-left" />
                    {newLocationCoords && (
                        <Marker
                            onClick={onMarkerClick}
                            draggable
                            longitude={newLocationCoords.longitude}
                            latitude={newLocationCoords.latitude}
                            onDragEnd={({ lngLat: { lat, lng } }) =>
                                setNewLocationCoords({ latitude: lat, longitude: lng })
                            }>
                            <img src={markerPng} width={35} height={35} alt="marker" />
                        </Marker>
                    )}
                </Map>
            </Modal.Body>
            <Modal.Footer>
                <RowStack>
                    <Button use="primary" size="medium" onClick={() => onSaveCoordinates(newLocationCoords)}>
                        Сохранить
                    </Button>
                    <Button use="default" size="medium" onClick={onCLose}>
                        Закрыть
                    </Button>
                </RowStack>
            </Modal.Footer>
        </Modal>
    );
};
