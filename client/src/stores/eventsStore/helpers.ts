import { Event } from "../../Commons/types/Event";

export interface Feature {
    type: "Feature";
    properties: Omit<Event, "location"> & { iconSize: [number, number] };
    geometry: {
        type: "Point";
        coordinates: [x: number, y: number, z: number];
    };
}

export const mapEventsToGeoJson = (events: Event[]): Feature[] =>
    events.map(({ id, location: { latitude, longitude }, ...restProps }) => ({
        type: "Feature",
        properties: { id: id, ...restProps, iconSize: [50, 50] },
        geometry: { type: "Point", coordinates: [longitude, latitude, 50] },
    }));