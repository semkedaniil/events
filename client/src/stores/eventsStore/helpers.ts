import { Event } from "../../Commons/types/Event";

export interface Feature {
    type: "Feature";
    properties: Omit<Event, "location"> & { iconSize: [number, number]};
    geometry: {
        type: "Point";
        coordinates: [x: number, y: number, z: number];
    };
}

export const mapEventsToGeoJson = (events: Event[]): Feature[] =>
    events.map(({ id, location: { lat, lng }, ...restProps }) => ({
        type: "Feature",
        properties: { id: id, ...restProps, iconSize: [50, 50] },
        geometry: { type: "Point", coordinates: [lng, lat, 50] },
    }));

export const getFakeEvents = (): Event[] => [
    {
        id: 0,
        name: "ak16994521-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.1016,
            lng: -151.5129,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16994521-event-description",
    },
    {
        id: 1,
        photos: ["https://placekitten.com/g/150/200/"],
        name: "ak16994519-event",
        location: {
            lat: 63.1224,
            lng: -150.4048,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16994519-event-description",
    },
    {
        id: 2,
        name: "ak16994517-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.0781,
            lng: -151.3597,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16994517-event-description",
    },
    {
        id: 3,
        name: "ci38021336-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 34.299667,
            lng: -118.497,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ci38021336-event-description",
    },
    {
        id: 4,
        name: "us2000b2nn-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 12.0623,
            lng: -87.6901,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "us2000b2nn-event-description",
    },
    {
        id: 5,
        name: "ak16994510-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.0719,
            lng: -151.5053,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16994510-event-description",
    },
    {
        id: 6,
        name: "us2000b2nb-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: -20.2873,
            lng: -178.4576,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "us2000b2nb-event-description",
    },
    {
        id: 7,
        name: "ak16994298-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.1725,
            lng: -148.789,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16994298-event-description",
    },
    {
        id: 8,
        name: "nc72905861-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 36.421833,
            lng: -120.993164,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "nc72905861-event-description",
    },
    {
        id: 9,
        name: "ci38021304-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 33.656333,
            lng: -117.0155,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ci38021304-event-description",
    },
    {
        id: 10,
        name: "ak16994293-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.0879,
            lng: -151.512,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16994293-event-description",
    },
    {
        id: 11,
        name: "ak16994287-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.0933,
            lng: -151.4378,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16994287-event-description",
    },
    {
        id: 12,
        name: "ak16994285-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.2272,
            lng: -149.6538,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16994285-event-description",
    },
    {
        id: 13,
        name: "ak16994283-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.0844,
            lng: -151.5325,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16994283-event-description",
    },
    {
        id: 14,
        name: "ak16994280-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 61.8518,
            lng: -149.4752,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16994280-event-description",
    },
    {
        id: 15,
        name: "ak16994278-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 61.6214,
            lng: -150.8597,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16994278-event-description",
    },
    {
        id: 16,
        name: "ak16994274-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 62.9656,
            lng: -149.7142,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16994274-event-description",
    },
    {
        id: 17,
        name: "ak16994273-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 61.2705,
            lng: -151.2484,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16994273-event-description",
    },
    {
        id: 18,
        name: "ak16994270-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 65.5942,
            lng: -152.0732,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16994270-event-description",
    },
    {
        id: 19,
        name: "us2000b2ly-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 13.5146,
            lng: -90.5445,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "us2000b2ly-event-description",
    },
    {
        id: 20,
        name: "nc72905841-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 37.605499,
            lng: -118.819504,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "nc72905841-event-description",
    },
    {
        id: 21,
        name: "nc72905836-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 37.636833,
            lng: -118.930168,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "nc72905836-event-description",
    },
    {
        id: 22,
        name: "ci38021272-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 34.1555,
            lng: -117.509167,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ci38021272-event-description",
    },
    {
        id: 23,
        name: "ci38021264-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 33.5115,
            lng: -116.792167,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ci38021264-event-description",
    },
    {
        id: 24,
        name: "ak16993963-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.1812,
            lng: -150.9126,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993963-event-description",
    },
    {
        id: 25,
        name: "hv61936851-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 19.374167,
            lng: -155.078659,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "hv61936851-event-description",
    },
    {
        id: 26,
        name: "ak16993960-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 61.5726,
            lng: -147.3106,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993960-event-description",
    },
    {
        id: 27,
        name: "ak16993952-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 60.2607,
            lng: -150.5846,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993952-event-description",
    },
    {
        id: 28,
        name: "ci38021224-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 34.254833,
            lng: -116.929,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ci38021224-event-description",
    },
    {
        id: 29,
        name: "ak16993752-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.0847,
            lng: -151.5065,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993752-event-description",
    },
    {
        id: 30,
        name: "ak16993746-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.5257,
            lng: -147.8929,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993746-event-description",
    },
    {
        id: 31,
        name: "us2000b2jk-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: -18.9821,
            lng: -175.7258,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "us2000b2jk-event-description",
    },
    {
        id: 32,
        name: "ak16993741-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.0775,
            lng: -151.3473,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993741-event-description",
    },
    {
        id: 33,
        name: "nc72905766-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 36.579834,
            lng: -121.137497,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "nc72905766-event-description",
    },
    {
        id: 34,
        name: "ak16993738-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 61.8312,
            lng: -151.1075,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993738-event-description",
    },
    {
        id: 35,
        name: "ak16993736-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.0621,
            lng: -151.3769,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993736-event-description",
    },
    {
        id: 36,
        name: "us2000b2ii-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 16.7195,
            lng: -94.8319,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "us2000b2ii-event-description",
    },
    {
        id: 37,
        name: "uw61339006-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 47.049167,
            lng: -120.689833,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "uw61339006-event-description",
    },
    {
        id: 38,
        name: "ak16993732-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.0785,
            lng: -151.5283,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993732-event-description",
    },
    {
        id: 39,
        name: "ak16993720-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 60.7696,
            lng: -151.6683,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993720-event-description",
    },
    {
        id: 40,
        name: "ak16993714-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 61.6478,
            lng: -149.7591,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993714-event-description",
    },
    {
        id: 41,
        name: "ak16993710-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.0633,
            lng: -151.3458,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993710-event-description",
    },
    {
        id: 42,
        name: "ak16993699-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.0675,
            lng: -151.4669,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993699-event-description",
    },
    {
        id: 43,
        name: "ak16993695-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.083,
            lng: -151.5169,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993695-event-description",
    },
    {
        id: 44,
        name: "ak16993692-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.0742,
            lng: -151.4771,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993692-event-description",
    },
    {
        id: 45,
        name: "ak16993486-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 63.1276,
            lng: -151.458,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ak16993486-event-description",
    },
    {
        id: 46,
        name: "us2000b2hz-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 16.6087,
            lng: -94.9686,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "us2000b2hz-event-description",
    },
    {
        id: 47,
        name: "nc72905751-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 37.605335,
            lng: -119.023666,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "nc72905751-event-description",
    },
    {
        id: 48,
        name: "ci38021056-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 33.493,
            lng: -116.793833,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ci38021056-event-description",
    },
    {
        id: 49,
        name: "ci38021048-event",
        photos: ["https://placekitten.com/g/150/200/"],
        location: {
            lat: 34.0335,
            lng: -117.225,
        },
        dateRange: {
            startDate: "01.01.2023",
        },
        description: "ci38021048-event-description",
    },
];