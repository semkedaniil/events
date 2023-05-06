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
                    result &&
                    (result.center || (result.geometry?.type === "Point" && result.geometry.coordinates));
                const { marker } = props;
                if (location && marker) {
                    setMarker(<Marker {...typeof marker === "object" ? { ...marker } : null} longitude={location[0]}
                                      latitude={location[1]} />);
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
        },
    );

    // @ts-ignore (TS2339) private member
    if (geocoder._map) {
        if (props?.proximity !== geocoder.getProximity()) {
            geocoder.setProximity(props.proximity);
        }
        if (props?.render !== geocoder.getRenderFunction()) {
            geocoder.setRenderFunction(props.render);
        }
        if (props?.language !== geocoder.getLanguage()) {
            geocoder.setLanguage(props.language);
        }
        if (props?.zoom !== geocoder.getZoom()) {
            geocoder.setZoom(props.zoom);
        }
        if (props?.flyTo !== geocoder.getFlyTo()) {
            geocoder.setFlyTo(props.flyTo);
        }
        if (props?.placeholder !== geocoder.getPlaceholder()) {
            geocoder.setPlaceholder(props.placeholder);
        }
        if (props?.countries !== geocoder.getCountries()) {
            geocoder.setCountries(props.countries);
        }
        if (props?.types !== geocoder.getTypes()) {
            geocoder.setTypes(props.types);
        }
        if (props?.minLength !== geocoder.getMinLength()) {
            geocoder.setMinLength(props.minLength);
        }
        if (props?.limit !== geocoder.getLimit()) {
            geocoder.setLimit(props.limit);
        }
        if (props?.filter !== geocoder.getFilter()) {
            geocoder.setFilter(props.filter);
        }
        if (props?.origin !== geocoder.getOrigin()) {
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