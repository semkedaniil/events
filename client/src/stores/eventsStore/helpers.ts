import { Event } from "../../Commons/types/Event";

interface Feature {
    type: "Feature";
    properties: {
        id: string;
    };
    geometry: {
        type: "Point";
        coordinates: [x: number, y: number, z: number];
    };
}

const customJsonData: Feature[] = [
    {
        type: "Feature",
        properties: { id: "ak16994521" },
        geometry: { type: "Point", coordinates: [-151.5129, 63.1016, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16994519" },
        geometry: { type: "Point", coordinates: [-150.4048, 63.1224, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16994517" },
        geometry: { type: "Point", coordinates: [-151.3597, 63.0781, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ci38021336" },
        geometry: { type: "Point", coordinates: [-118.497, 34.299_667, 50] },
    },
    {
        type: "Feature",
        properties: { id: "us2000b2nn" },
        geometry: { type: "Point", coordinates: [-87.6901, 12.0623, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16994510" },
        geometry: { type: "Point", coordinates: [-151.5053, 63.0719, 50] },
    },
    {
        type: "Feature",
        properties: { id: "us2000b2nb" },
        geometry: { type: "Point", coordinates: [-178.4576, -20.2873, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16994298" },
        geometry: { type: "Point", coordinates: [-148.789, 63.1725, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905861" },
        geometry: { type: "Point", coordinates: [-120.993_164, 36.421_833, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ci38021304" },
        geometry: { type: "Point", coordinates: [-117.0155, 33.656_333, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16994293" },
        geometry: { type: "Point", coordinates: [-151.512, 63.0879, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16994287" },
        geometry: { type: "Point", coordinates: [-151.4378, 63.0933, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16994285" },
        geometry: { type: "Point", coordinates: [-149.6538, 63.2272, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16994283" },
        geometry: { type: "Point", coordinates: [-151.5325, 63.0844, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16994280" },
        geometry: { type: "Point", coordinates: [-149.4752, 61.8518, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16994278" },
        geometry: { type: "Point", coordinates: [-150.8597, 61.6214, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16994274" },
        geometry: { type: "Point", coordinates: [-149.7142, 62.9656, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16994273" },
        geometry: { type: "Point", coordinates: [-151.2484, 61.2705, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16994270" },
        geometry: { type: "Point", coordinates: [-152.0732, 65.5942, 50] },
    },
    {
        type: "Feature",
        properties: { id: "us2000b2ly" },
        geometry: { type: "Point", coordinates: [-90.5445, 13.5146, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905841" },
        geometry: { type: "Point", coordinates: [-118.819_504, 37.605_499, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905836" },
        geometry: { type: "Point", coordinates: [-118.930_168, 37.636_833, -0.71] },
    },
    {
        type: "Feature",
        properties: { id: "ci38021272" },
        geometry: { type: "Point", coordinates: [-117.509_167, 34.1555, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ci38021264" },
        geometry: { type: "Point", coordinates: [-116.792_167, 33.5115, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993963" },
        geometry: { type: "Point", coordinates: [-150.9126, 63.1812, 50] },
    },
    {
        type: "Feature",
        properties: { id: "hv61936851" },
        geometry: { type: "Point", coordinates: [-155.078_659, 19.374_167, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993960" },
        geometry: { type: "Point", coordinates: [-147.3106, 61.5726, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993952" },
        geometry: { type: "Point", coordinates: [-150.5846, 60.2607, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ci38021224" },
        geometry: { type: "Point", coordinates: [-116.929, 34.254_833, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993752" },
        geometry: { type: "Point", coordinates: [-151.5065, 63.0847, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993746" },
        geometry: { type: "Point", coordinates: [-147.8929, 63.5257, 50] },
    },
    {
        type: "Feature",
        properties: { id: "us2000b2jk" },
        geometry: { type: "Point", coordinates: [-175.7258, -18.9821, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993741" },
        geometry: { type: "Point", coordinates: [-151.3473, 63.0775, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905766" },
        geometry: { type: "Point", coordinates: [-121.137_497, 36.579_834, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993738" },
        geometry: { type: "Point", coordinates: [-151.1075, 61.8312, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993736" },
        geometry: { type: "Point", coordinates: [-151.3769, 63.0621, 50] },
    },
    {
        type: "Feature",
        properties: { id: "us2000b2ii" },
        geometry: { type: "Point", coordinates: [-94.8319, 16.7195, 50] },
    },
    {
        type: "Feature",
        properties: { id: "uw61339006" },
        geometry: { type: "Point", coordinates: [-120.689_833, 47.049_167, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993732" },
        geometry: { type: "Point", coordinates: [-151.5283, 63.0785, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993720" },
        geometry: { type: "Point", coordinates: [-151.6683, 60.7696, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993714" },
        geometry: { type: "Point", coordinates: [-149.7591, 61.6478, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993710" },
        geometry: { type: "Point", coordinates: [-151.3458, 63.0633, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993699" },
        geometry: { type: "Point", coordinates: [-151.4669, 63.0675, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993695" },
        geometry: { type: "Point", coordinates: [-151.5169, 63.083, 70] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993692" },
        geometry: { type: "Point", coordinates: [-151.4771, 63.0742, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993486" },
        geometry: { type: "Point", coordinates: [-151.458, 63.1276, 50] },
    },
    {
        type: "Feature",
        properties: { id: "us2000b2hz" },
        geometry: { type: "Point", coordinates: [-94.9686, 16.6087, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905751" },
        geometry: { type: "Point", coordinates: [-119.023_666, 37.605_335, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ci38021056" },
        geometry: { type: "Point", coordinates: [-116.793_833, 33.493, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ci38021048" },
        geometry: { type: "Point", coordinates: [-117.225, 34.0335, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993303" },
        geometry: { type: "Point", coordinates: [-151.0033, 63.2623, 50] },
    },
    {
        type: "Feature",
        properties: { id: "us2000b2hc" },
        geometry: { type: "Point", coordinates: [-177.3179, -30.4302, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993301" },
        geometry: { type: "Point", coordinates: [-154.1913, 58.5727, 50] },
    },
    {
        type: "Feature",
        properties: { id: "uu60251607" },
        geometry: { type: "Point", coordinates: [-113.140_503, 38.030_666, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905716" },
        geometry: { type: "Point", coordinates: [-122.765_663, 38.789_166, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905711" },
        geometry: { type: "Point", coordinates: [-121.678_001, 37.621_498, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993140" },
        geometry: { type: "Point", coordinates: [-148.8813, 63.1738, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993128" },
        geometry: { type: "Point", coordinates: [-149.531, 61.7978, 50] },
    },
    {
        type: "Feature",
        properties: { id: "hv61936621" },
        geometry: { type: "Point", coordinates: [-155.423_492, 19.223_499, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16993119" },
        geometry: { type: "Point", coordinates: [-138.8317, 59.7754, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905681" },
        geometry: { type: "Point", coordinates: [-122.793_999, 38.8255, 50] },
    },
    {
        type: "Feature",
        properties: { id: "hv61936531" },
        geometry: { type: "Point", coordinates: [-155.320_16, 19.338_667, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16992960" },
        geometry: { type: "Point", coordinates: [-158.4264, 67.7636, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16992953" },
        geometry: { type: "Point", coordinates: [-136.5725, 59.8372, 50] },
    },
    {
        type: "Feature",
        properties: { id: "us2000b2fz" },
        geometry: { type: "Point", coordinates: [-71.7814, -32.4981, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nn00608370" },
        geometry: { type: "Point", coordinates: [-115.9711, 36.3094, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16992628" },
        geometry: { type: "Point", coordinates: [-163.8046, 65.9499, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16992625" },
        geometry: { type: "Point", coordinates: [-147.8309, 63.376, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905641" },
        geometry: { type: "Point", coordinates: [-122.724_167, 38.760_334, 50] },
    },
    {
        type: "Feature",
        properties: { id: "us2000b2fc" },
        geometry: { type: "Point", coordinates: [-77.9778, -1.6647, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16992611" },
        geometry: { type: "Point", coordinates: [-150.3324, 62.9966, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16992607" },
        geometry: { type: "Point", coordinates: [-146.4858, 64.7593, 50] },
    },
    {
        type: "Feature",
        properties: { id: "us2000b2et" },
        geometry: { type: "Point", coordinates: [-177.7469, -33.0092, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16992603" },
        geometry: { type: "Point", coordinates: [-136.8133, 59.8473, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ci38020960" },
        geometry: { type: "Point", coordinates: [-116.673_833, 33.904_333, 50] },
    },
    {
        type: "Feature",
        properties: { id: "hv61936261" },
        geometry: { type: "Point", coordinates: [-155.382_172, 19.23, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16992451" },
        geometry: { type: "Point", coordinates: [-153.427, 66.3947, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ci38020944" },
        geometry: { type: "Point", coordinates: [-116.457_667, 34.326, 50] },
    },
    {
        type: "Feature",
        properties: { id: "mb80259564" },
        geometry: { type: "Point", coordinates: [-112.529_833, 46.865_833, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905606" },
        geometry: { type: "Point", coordinates: [-122.791_832, 38.834_835, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nn00608387" },
        geometry: { type: "Point", coordinates: [-118.9071, 38.405, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ci38020896" },
        geometry: { type: "Point", coordinates: [-116.793_833, 33.486_833, 50] },
    },
    {
        type: "Feature",
        properties: { id: "us2000b2dx" },
        geometry: { type: "Point", coordinates: [130.1291, -6.3628, 50] },
    },
    {
        type: "Feature",
        properties: { id: "se60208171" },
        geometry: { type: "Point", coordinates: [-83.749_833, 36.150_333, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905576" },
        geometry: { type: "Point", coordinates: [-120.900_833, 36.327_168, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16992147" },
        geometry: { type: "Point", coordinates: [-153.0276, 62.5667, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16992146" },
        geometry: { type: "Point", coordinates: [-138.5063, 59.957, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905556" },
        geometry: { type: "Point", coordinates: [-122.792, 38.834_835, 50] },
    },
    {
        type: "Feature",
        properties: { id: "mb80259559" },
        geometry: { type: "Point", coordinates: [-112.530_833, 46.869_333, 50] },
    },
    {
        type: "Feature",
        properties: { id: "us2000b2d1" },
        geometry: { type: "Point", coordinates: [-69.504, -16.7961, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905531" },
        geometry: { type: "Point", coordinates: [-118.831_169, 37.4585, 50] },
    },
    {
        type: "Feature",
        properties: { id: "mb80259549" },
        geometry: { type: "Point", coordinates: [-112.516_333, 46.8755, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905521" },
        geometry: { type: "Point", coordinates: [-118.816_666, 37.603_832, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ci38020824" },
        geometry: { type: "Point", coordinates: [-116.655_333, 34.632, 50] },
    },
    {
        type: "Feature",
        properties: { id: "ak16991857" },
        geometry: { type: "Point", coordinates: [-177.8808, 51.3254, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nn00608359" },
        geometry: { type: "Point", coordinates: [-115.1285, 37.4041, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905511" },
        geometry: { type: "Point", coordinates: [-118.817_169, 37.604_168, 50] },
    },
    {
        type: "Feature",
        properties: { id: "us2000b2cx" },
        geometry: { type: "Point", coordinates: [69.1471, -23.7671, 50] },
    },
    {
        type: "Feature",
        properties: { id: "nc72905496" },
        geometry: { type: "Point", coordinates: [-121.101_166, 40.842_499, 50] },
    },
];
export const getGeoJson = () => customJsonData
    .slice(0, 50)
    .map(x => ({ ...x, properties: { ...x.properties, iconSize: [50, 50] } }));

export const mapEventsToGeoJson = (events: Event[]): Feature[] =>
    events.map(({ id, location: { latitude, longitude } }) =>
        ({
            type: "Feature",
            properties: { id: id.toString() },
            geometry: { type: "Point", coordinates: [longitude, latitude, 50] },
        }));