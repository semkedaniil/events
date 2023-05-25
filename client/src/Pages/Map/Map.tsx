import { MapProvider } from "react-map-gl";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "../../stores/userStore/userStore";

import { Controls } from "./Controls/Controls";
import { MapBox } from "./MapBox/MapBox";
import cn from "./Map.less";

export const Map = (): JSX.Element => {
    const { isAuth } = useAuthStore();
    if (!isAuth) {
        return <Navigate to="/login" />;
    }
    return (
        <div className={cn("mapbox-map")}>
            <MapProvider>
                <Controls />
                <MapBox />
            </MapProvider>
        </div>
    );
};
