import { useMemo, useRef, useState } from "react";
import defaultImage from "../../../assets/avatar.jpg";
import { Marker, Popup, useMap } from "react-map-gl";

import Supercluster from "supercluster";
import cn from "../MapBox/MapBox.less";
import { Feature } from "../../../stores/eventsStore/helpers";
import { ColumnStack } from "../../../ui/components/ColumnStack/ColumnStack";
import { useNavigate } from "react-router-dom";
import { Link } from "@skbkontur/react-ui";

interface ClusterLayerProps {
    mapId: string;
    data: any;
    ClusterComponent: any;
    onSelectMarker: any;
}

export const ClusterLayer = ({ mapId, data, ClusterComponent, onSelectMarker }: ClusterLayerProps) => {
    const { [mapId]: mapRef } = useMap();
    const navigate = useNavigate();
    const bbox = mapRef?.getBounds().toArray().flat() as [number, number, number, number];
    const zoom = mapRef?.getZoom() ?? 0;
    const [showPopup, setShowPopup] = useState<{ id: number } | null>(null);
    const refSetTimeout = useRef<NodeJS.Timeout>();
    const SUPERCLUSTER: Supercluster = useMemo(() => new Supercluster({ radius: 40 }).load(data), [data]);

    const clusters = useMemo(() => {
        if (!SUPERCLUSTER) return [];

        return SUPERCLUSTER.getClusters(bbox, zoom);
    }, [SUPERCLUSTER, bbox, zoom]);

    const handleSelectMarker = (clusterId: number, coordinates: number[]) => {
        const nextZoom = SUPERCLUSTER.getClusterExpansionZoom(clusterId);
        onSelectMarker(nextZoom, coordinates);
    };

    const renderMarkerTooltip = ({
        id,
        name,
        description,
        creator,
        dateRange,
        photos,
    }: Feature["properties"]): JSX.Element => (
        <div className={cn("event-tooltip")}>
            <img className={cn("img")} src={photos?.[0] ?? defaultImage} height={100} alt={name} />
            <div className={cn("main-info")}>
                <Link title="Открыть страницу события" href={`/event/${id}`}>
                    <h2>{name}</h2>
                </Link>
                <main>{description}</main>
                <footer>
                    {creator && <span className={cn("author")}>Автор: {creator}</span>}
                    <ColumnStack className={cn("date-range")}>
                        <span>Начало: {dateRange.startDate}</span>
                        {dateRange.endDate && <span>Конец: {dateRange.endDate}</span>}
                    </ColumnStack>
                </footer>
            </div>
        </div>
    );

    const onMouseEnterHandler = (id: number) => {
        clearTimeout(refSetTimeout.current);
        setShowPopup({ id });
    };

    const onMouseLeaveHandler = () => {
        refSetTimeout.current = setTimeout(() => {
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
                            backgroundImage: `url(https://placekitten.com/g/${width}/${height}/)`,
                            width,
                            height,
                            backgroundSize: "100%",
                        }}
                        className={cn("marker")}
                    />
                    {showPopup?.id && properties.id === showPopup?.id && (
                        <Popup className={cn("popup")} latitude={latitude} longitude={longitude} closeButton={false}>
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