import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Map, { Marker } from "react-map-gl";
import { IoIosWarning } from "react-icons/io";

import { Event } from "../../Commons/types/Event";
import { useEventsStore } from "../../stores/eventsStore/eventsStore";
import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { RowStack } from "../../ui/components/RowStack/RowStack";
import { getMapTheme, MAPBOX_TOKEN } from "../Map/MapBox/MapBox";
import { ColumnStack } from "../../ui/components/ColumnStack/ColumnStack";

import cn from "./EventPage.less";
import { ImageSlider } from "./PhotoSlider/Slider";

export const EventPage = (): JSX.Element => {
    const { id = "" } = useParams<"id">();
    const { findById } = useEventsStore();
    const [event, setEvent] = useState<Event>();
    useEffect(() => {
        const currentId = Number(id);
        if (!isNaN(currentId)) {
            const event = findById(Number(id));
            if (event) {
                setEvent(event);
            }
        }
    }, []);

    if (!event) {
        return (
            <CommonLayout>
                <CommonLayout.Header>
                    <GoBackLink backUrl=".." />
                    <h1 className={cn("header")}>Вернуться на главную</h1>
                </CommonLayout.Header>
                <div className={cn("event-page")}>
                    <p className={cn("not-found-title")}>
                        К сожалению, событие с ID <b>{id}</b> не найдено.
                    </p>
                </div>
            </CommonLayout>
        );
    }

    const {
        name,
        creator,
        photos,
        description,
        dateRange: { endDate, startDate },
        location: { latitude, longitude },
        hidden,
    } = event;
    return (
        <CommonLayout style={{ width: "fit-content", margin: "0 auto", paddingBottom: "40px" }}>
            <CommonLayout.Header>
                <GoBackLink backUrl=".." />
                <h1 className={cn("header")}>Событие {name}</h1>
            </CommonLayout.Header>
            <RowStack className={cn("event-page")}>
                <div className={cn("column")}>
                    {photos && <ImageSlider slides={photos} />}
                    {creator && <RowStack>Создатель: {creator}</RowStack>}
                    {description && (
                        <ColumnStack>
                            <span className={cn("title")}>Описание</span>
                            <p className={cn("description")}>{description}</p>
                        </ColumnStack>
                    )}
                    <RowStack>
                        <span className={cn("title")}>Дата начала</span>
                        <p>{startDate.toLocaleString()}</p>
                    </RowStack>
                    {endDate && (
                        <RowStack>
                            <span className={cn("title")}>Дата конца</span>
                            <p>{endDate.toLocaleString()}</p>
                        </RowStack>
                    )}
                </div>
                <div className={cn("column")}>
                    <Map
                        id="eventIdMap"
                        initialViewState={{
                            latitude,
                            longitude,
                            zoom: 0.55,
                        }}
                        projection="globe"
                        style={{ width: "100%", height: "250px", borderRadius: "16px" }}
                        mapStyle={getMapTheme()}
                        mapboxAccessToken={MAPBOX_TOKEN}>
                        <Marker longitude={longitude} latitude={latitude} />
                    </Map>
                    <RowStack>
                        <span className={cn("title")}>
                            Координаты: ({longitude}, {latitude}){" "}
                        </span>
                    </RowStack>
                </div>
                {hidden && (
                    <RowStack>
                        <span className={cn("title", "error")}>
                            <IoIosWarning />
                            <span>В данный момент событие скрыто на общей карте</span>
                        </span>
                    </RowStack>
                )}
            </RowStack>
        </CommonLayout>
    );
};