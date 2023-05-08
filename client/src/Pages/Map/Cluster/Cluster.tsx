import { useMemo } from "react";

import { Marker, useMap } from "react-map-gl";

import Supercluster from "supercluster";
import cn from "../MapBox/MapBox.less";

interface ClusterLayerProps {
    mapId: string;
    data: any;
    ClusterComponent: any;
    onSelectMarker: any;
}

export const ClusterLayer = ({ mapId, data, ClusterComponent, onSelectMarker }: ClusterLayerProps) => {
    const { [mapId]: mapRef } = useMap();
    const bbox = mapRef?.getBounds().toArray().flat() as [number, number, number, number];
    const zoom = mapRef?.getZoom() ?? 0;

    const SUPERCLUSTER: Supercluster = useMemo(() => new Supercluster({ radius: 40 }).load(data), [data]);

    const clusters = useMemo(() => {
        if (!SUPERCLUSTER) return [];

        return SUPERCLUSTER.getClusters(bbox, zoom);
    }, [SUPERCLUSTER, bbox, zoom]);

    const handleSelectMarker = (clusterId: number, coordinates: number[]) => {
        const nextZoom = SUPERCLUSTER.getClusterExpansionZoom(clusterId);
        onSelectMarker(nextZoom, coordinates);
    };
    
    const renderMarker = ({ coordinates }: any, properties: any) => {
        const width = properties.iconSize[0];
        const height = properties.iconSize[1];
        // eslint-disable-next-line no-alert
        return (
            <Marker key={properties.cartodb_id} latitude={coordinates[1]} longitude={coordinates[0]}>
                <div
                    key={`marker-${properties.cartodb_id}`}
                    style={{
                        backgroundImage: `url(https://placekitten.com/g/${width}/${height}/)`,
                        width: `${width}px`,
                        height: `${height}px`,
                        backgroundSize: "100%",
                    }}
                    className={cn("marker")}
                />
            </Marker>
        );
    };
    return (
        <>
            {clusters.map(feature => {
                const { id, geometry, properties } = feature;
                const { coordinates } = geometry;
                const [longitude, latitude] = coordinates;
                const clusterFeaturesProps = feature.properties as Supercluster.ClusterProperties;
                if (clusterFeaturesProps.cluster) {
                    const { cluster_id: clusterId } = clusterFeaturesProps;
                    const leaves = SUPERCLUSTER.getLeaves(clusterId, Infinity);
                    return (
                        <Marker
                            key={id}
                            latitude={latitude}
                            longitude={longitude}
                            onClick={() => handleSelectMarker(clusterId, coordinates)}>
                            <ClusterComponent properties={clusterFeaturesProps} leaves={leaves} />
                        </Marker>
                    );
                }
                return renderMarker(geometry, properties);
            })}
        </>
    );
};