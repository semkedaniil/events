import { useState } from "react";
import { useControl, Marker, MarkerProps, ControlPosition } from "react-map-gl";
import MapboxGeocoder, { GeocoderOptions } from "@mapbox/mapbox-gl-geocoder";

type GeocoderControlProps = Omit<GeocoderOptions, "accessToken" | "mapboxgl" | "marker"> & {
    mapboxAccessToken: string;
    marker?: boolean | Omit<MarkerProps, "longitude" | "latitude">;

    position: ControlPosition;

    onLoading?: (event: object) => void;
    onResults?: (event: object) => void;
    onResult?: (event: object) => void;
    onError?: (event: object) => void;
};

// eslint-disable-next-line import/no-default-export
export default function GeocoderControl(props: GeocoderControlProps) {
    const [marker, setMarker] = useState<JSX.Element | null>(null);
    const geocoder = useControl<MapboxGeocoder>(
        () => {
            const ctrl = new MapboxGeocoder({
                ...props,
                marker: false,
                accessToken: props.mapboxAccessToken,
            });
            if (props.onLoading) {
                ctrl.on("loading", props.onLoading);
            }

            if (props.onResults) {
                ctrl.on("results", props.onResults);
            }

            ctrl.on("result", (event_: any) => {
                props.onResult?.(event_);

                const { result } = event_;
                const location =
                    result && (result.center || (result.geometry?.type === "Point" && result.geometry.coordinates));
                const { marker } = props;
                if (location && marker) {
                    setMarker(
                        <Marker
                            {...(typeof marker === "object" ? { ...marker } : null)}
                            longitude={location[0]}
                            latitude={location[1]}
                        />
                    );
                } else {
                    setMarker(null);
                }
            });
            if (props.onError) {
                ctrl.on("error", props.onError);
            }
            return ctrl;
        },
        {
            position: props.position,
        }
    );

    // @ts-ignore (TS2339) private member
    if (geocoder._map) {
        if (geocoder.getProximity() !== props.proximity && props.proximity !== undefined) {
            geocoder.setProximity(props.proximity);
        }
        if (geocoder.getRenderFunction() !== props.render && props.render !== undefined) {
            geocoder.setRenderFunction(props.render);
        }
        if (geocoder.getLanguage() !== props.language && props.language !== undefined) {
            geocoder.setLanguage(props.language);
        }
        if (geocoder.getZoom() !== props.zoom && props.zoom !== undefined) {
            geocoder.setZoom(props.zoom);
        }
        if (geocoder.getFlyTo() !== props.flyTo && props.flyTo !== undefined) {
            geocoder.setFlyTo(props.flyTo);
        }
        if (geocoder.getPlaceholder() !== props.placeholder && props.placeholder !== undefined) {
            geocoder.setPlaceholder(props.placeholder);
        }
        if (geocoder.getCountries() !== props.countries && props.countries !== undefined) {
            geocoder.setCountries(props.countries);
        }
        if (geocoder.getTypes() !== props.types && props.types !== undefined) {
            geocoder.setTypes(props.types);
        }
        if (geocoder.getMinLength() !== props.minLength && props.minLength !== undefined) {
            geocoder.setMinLength(props.minLength);
        }
        if (geocoder.getLimit() !== props.limit && props.limit !== undefined) {
            geocoder.setLimit(props.limit);
        }
        if (geocoder.getFilter() !== props.filter && props.filter !== undefined) {
            geocoder.setFilter(props.filter);
        }
        if (geocoder.getOrigin() !== props.origin && props.origin !== undefined) {
            geocoder.setOrigin(props.origin);
        }

    }
    return marker;
}

GeocoderControl.defaultProps = {
    marker: true,
    onLoading: () => {
        // empty
    },
    onResults: () => {
        // empty
    },
    onResult: () => {
        // empty
    },
    onError: () => {
        // empty
    },
};
