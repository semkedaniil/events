import React, { useMemo, useRef, useState } from "react";
import { Marker, Popup, useMap } from "react-map-gl";
import Supercluster from "supercluster";
import { Link } from "@skbkontur/react-ui";

import cn from "../MapBox/MapBox.less";
import { Feature } from "../../../stores/eventsStore/helpers";
import { Event } from "../../../Commons/types/Event";
import { ColumnStack } from "../../../ui/components/ColumnStack/ColumnStack";
import { RowStack } from "../../../ui/components/RowStack/RowStack";
import { useAuthStore } from "../../../stores/userStore/userStore";
import { MarksBlock } from "../../../ui/components/MarksBlock/MarksBlock";
import { getEvent } from "../../../api/events/events";

interface ClusterLayerProps {
    mapId: string;
    data: any;
    ClusterComponent: any;
    onSelectMarker: any;
}

/* eslint-disable react-hooks/rules-of-hooks */
export const ClusterLayer = ({ mapId, data, ClusterComponent, onSelectMarker }: ClusterLayerProps) => {
    if (!data?.length) {
        return null;
    }
    const { user } = useAuthStore();
    const { [mapId]: mapRef } = useMap();
    const bbox = mapRef?.getBounds().toArray().flat() as [number, number, number, number];
    const zoom = mapRef?.getZoom() ?? 0;
    const [showPopup, setShowPopup] = useState<{ id: number } | null>(null);
    const referenceSetTimeout = useRef<NodeJS.Timeout>();
    const SUPERCLUSTER: Supercluster = useMemo(() => new Supercluster({ radius: 40 }).load(data), [data]);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
    const clusters = useMemo(() => {
        if (!SUPERCLUSTER) return [];

        return SUPERCLUSTER.getClusters(bbox, zoom);
    }, [SUPERCLUSTER, bbox, zoom]);

    const handleSelectMarker = (clusterId: number, coordinates: number[]) => {
        const nextZoom = SUPERCLUSTER.getClusterExpansionZoom(clusterId);
        onSelectMarker(nextZoom, coordinates);
    };

    const renderMarkerTooltip = ({ id }: Feature["properties"]): JSX.Element | null => {
        if (!currentEvent) {
            return null;
        }
        const event = currentEvent;
        const start = new Date(event.dateRange.startDate).toLocaleString();
        const end = event.dateRange.endDate && new Date(event.dateRange.endDate).toLocaleString();
        return (
            <div className={cn("event-tooltip")}>
                {event.photos?.[0] && (
                    <img className={cn("img")} src={event.photos?.[0]} height={150} alt={event.name} />
                )}
                <div className={cn("main-info")}>
                    <Link title="Открыть страницу события" href={`/event/${id}`}>
                        <h2 className={cn("name")}>{event.name}</h2>
                    </Link>
                    <main>{event.description}</main>
                    <footer>
                        {event.creator && <span className={cn("author")}>Автор: {event.creator}</span>}
                        <RowStack align="center" className={cn("marks-wrapper")}>
                            <ColumnStack className={cn("date-range")}>
                                <span>Начало: {start}</span>
                                {event.dateRange.endDate && <span>Конец: {end}</span>}
                            </ColumnStack>
                            <MarksBlock
                                event={event}
                                className={cn("marks")}
                                withoutCaption
                                onValueChange={setCurrentEvent}
                            />
                        </RowStack>
                    </footer>
                </div>
            </div>
        );
    };

    const onMouseEnterHandler = (id: number) => {
        clearTimeout(referenceSetTimeout.current);
        setShowPopup({ id });
    };

    const onMouseLeaveHandler = () => {
        referenceSetTimeout.current = setTimeout(() => {
            setShowPopup(null);
        }, 250);
    };

    const renderMarker = ({ coordinates: [longitude, latitude] }: any, properties: Feature["properties"]) => {
        const [width, height] = properties.iconSize;
        return (
            <Marker key={properties.id} latitude={latitude} longitude={longitude}>
                <div onMouseEnter={() => onMouseEnterHandler(properties.id)} onMouseLeave={onMouseLeaveHandler}>
                    <div
                        key={`marker-${properties.id}`}
                        style={{
                            backgroundImage: `url(${properties.photos?.[0]})`,
                            backgroundColor: "#0b0772",
                            border: "1px solid rgba(0, 0, 0, 0.5)",
                            width,
                            height,
                            backgroundSize: "100%",
                        }}
                        className={cn("marker")}
                    />
                    {showPopup?.id && properties.id === showPopup?.id && (
                        <Popup
                            maxWidth="50vw"
                            className={cn("popup")}
                            latitude={latitude}
                            onOpen={() => setCurrentEvent(properties as any)}
                            longitude={longitude}
                            closeButton={false}>
                            {renderMarkerTooltip(properties as any)}
                        </Popup>
                    )}
                </div>
            </Marker>
        );
    };
    return (
        <>
            {clusters.map((feature, index) => {
                const { id, geometry, properties } = feature;
                const { coordinates } = geometry;
                const [longitude, latitude] = coordinates;
                const clusterFeaturesProps = properties as Supercluster.ClusterProperties;
                if (clusterFeaturesProps.cluster) {
                    const { cluster_id: clusterId } = clusterFeaturesProps;
                    const leaves = SUPERCLUSTER.getLeaves(clusterId, Infinity);
                    return (
                        <Marker
                            key={clusterId}
                            latitude={latitude}
                            longitude={longitude}
                            onClick={() => handleSelectMarker(clusterId, coordinates)}>
                            <ClusterComponent key={`cluster${id}`} properties={clusterFeaturesProps} leaves={leaves} />
                        </Marker>
                    );
                }
                return renderMarker(geometry, properties as any);
            })}
        </>
    );
};
