import { MapProvider } from "react-map-gl";

import { Controls } from "./Controls/Controls";
import { MapBox } from "./MapBox/MapBox";
import cn from "./Map.less";

export const Map = (): JSX.Element => (
    <div className={cn("mapbox-map")}>
        <MapProvider>
            <Controls />
            <MapBox />
        </MapProvider>
    </div>
);
