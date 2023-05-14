import { useMemo, useRef, useState } from "react";

import { Marker, Popup, useMap } from "react-map-gl";
import { Location } from "../../../Commons/types/Event";

import Supercluster from "supercluster";
import cn from "../MapBox/MapBox.less";
import { Tooltip } from "@skbkontur/react-ui";
import set = Reflect.set;

interface ClusterLayerProps {
    mapId: string;
    data: any;
    ClusterComponent: any;
    onSelectMarker: any;
}

const img = <img src={`https://placekitten.com/g/150/200/`} alt="Event image" />;
export const ClusterLayer = ({ mapId, data, ClusterComponent, onSelectMarker }: ClusterLayerProps) => {
    const { [mapId]: mapRef } = useMap();
    const bbox = mapRef?.getBounds().toArray().flat() as [number, number, number, number];
    const zoom = mapRef?.getZoom() ?? 0;
    const [showPopup, setShowPopup] = useState<{ id: string } | null>(null);
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

    const renderMarkerTooltip = (id: string): JSX.Element => (
        <div className={cn("event-tooltip")}>
            {img}
            <span>
                Здесь событие <b>{id}</b>
            </span>
        </div>
    );

    const onMouseEnterHandler = (id: string) => {
        clearTimeout(refSetTimeout.current);
        setShowPopup({ id });
    };

    const onMouseLeaveHandler = () => {
        refSetTimeout.current = setTimeout(() => {
            setShowPopup(null);
        }, 250);
    };

    const renderMarker = ({ coordinates: [longitude, latitude] }: any, { iconSize, id }: any) => {
        const [width, height] = iconSize;
        return (
            <Marker key={id} latitude={latitude} longitude={longitude}>
                <div
                    onMouseEnter={() => onMouseEnterHandler(id)}
                    onMouseLeave={onMouseLeaveHandler}>
                    <div
                        key={`marker-${id}`}
                        style={{
                            backgroundImage: `url(https://placekitten.com/g/${width}/${height}/)`,
                            width,
                            height,
                            backgroundSize: "100%",
                        }}
                        className={cn("marker")}
                    />
                    {showPopup?.id && id === showPopup?.id && (
                        <Popup className={cn("popup")} latitude={latitude} longitude={longitude} closeButton={false}>
                            {renderMarkerTooltip(id)}
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
                return renderMarker(geometry, properties);
            })}
        </>
    );
};