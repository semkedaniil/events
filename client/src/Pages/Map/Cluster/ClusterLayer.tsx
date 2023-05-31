import React, { useMemo, useRef, useState } from "react";
import { Marker, Popup, useMap } from "react-map-gl";
import Supercluster from "supercluster";
import { Link } from "@skbkontur/react-ui";

import cn from "../MapBox/MapBox.less";
import { Feature } from "../../../stores/eventsStore/helpers";
import { Event } from "../../../Commons/types/Event";
import { ColumnStack } from "../../../ui/components/ColumnStack/ColumnStack";
import { RowStack } from "../../../ui/components/RowStack/RowStack";
import { MarksBlock } from "../../../ui/components/MarksBlock/MarksBlock";
import { stringToColor } from "../../ProfilePage/helpers";
import { SubscribeButton } from "../../../ui/components/SubscribeButton/SubscribeButton";
import { useAuthStore } from "../../../stores/userStore/userStore";
import { subscribe, unsubscribe } from "../../../api/subscriptions/subscriptions";

interface ClusterLayerProps {
    mapId: string;
    data: any;
    ClusterComponent: any;
    onSelectMarker: any;
    onValueChange: (event: Event) => void;
}

/* eslint-disable react-hooks/rules-of-hooks */
export const ClusterLayer = ({ mapId, data, ClusterComponent, onSelectMarker, onValueChange }: ClusterLayerProps) => {
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

    const onSubscribe = async (eventId: number) => {
        try {
            await subscribe(eventId);
        } finally {
            if (user?.id && currentEvent?.subscriptions) {
                onValueChange({
                    ...currentEvent,
                    subscriptions: [...currentEvent.subscriptions, { userId: user?.id }],
                });
            }
        }
    };

    const onUnsubscribe = async (eventId: number) => {
        try {
            await unsubscribe(eventId);
        } finally {
            if (user?.id && currentEvent?.subscriptions) {
                onValueChange({
                    ...currentEvent,
                    subscriptions: currentEvent.subscriptions.filter(x => x.userId !== user.id),
                });
            }
        }
    };

    const renderMarkerTooltip = ({ id }: Feature["properties"]): JSX.Element | null => {
        if (!currentEvent) {
            return null;
        }
        const start = new Date(currentEvent.dateRange.startDate).toLocaleString();
        const end = currentEvent.dateRange.endDate && new Date(currentEvent.dateRange.endDate).toLocaleString();
        const isUserSubscribed = Boolean(currentEvent.subscriptions?.find(x => x.userId === user?.id));
        return (
            <div className={cn("event-tooltip")}>
                {currentEvent.photos?.[0] && (
                    <img className={cn("img")} src={currentEvent.photos?.[0]} height={150} alt={currentEvent.name} />
                )}
                <div className={cn("main-info")}>
                    <Link title="Открыть страницу события" href={`/event/${id}`}>
                        <h2 className={cn("name")}>{currentEvent.name}</h2>
                    </Link>
                    <main>{currentEvent.description}</main>
                    <footer>
                        <RowStack>
                            <ColumnStack>
                                {currentEvent.creator && (
                                    <RowStack className={cn("author")}>Автор: {currentEvent.creator}</RowStack>
                                )}
                                <RowStack>
                                    {currentEvent.tags?.map(({ name }) => (
                                        <span className={cn("author")} key={name}>
                                            #{name}
                                        </span>
                                    ))}
                                </RowStack>
                            </ColumnStack>
                            {currentEvent.creator !== user?.username && (
                                <div className={cn("sub-button")}>
                                    <SubscribeButton
                                        isUserSubscribed={isUserSubscribed}
                                        onSubscribe={() => onSubscribe(id)}
                                        onUnsubscribe={() => onUnsubscribe(id)}
                                    />
                                </div>
                            )}
                        </RowStack>
                        <RowStack align="center" className={cn("marks-wrapper")}>
                            <ColumnStack className={cn("date-range")}>
                                <span>Начало: {start}</span>
                                {currentEvent.dateRange.endDate && <span>Конец: {end}</span>}
                            </ColumnStack>
                            <MarksBlock
                                event={currentEvent}
                                className={cn("marks")}
                                withoutCaption
                                onValueChange={onValueChange}
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
                            backgroundColor: stringToColor(properties.name),
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
                            onClose={() => setCurrentEvent(null)}
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
            {clusters.map(feature => {
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
