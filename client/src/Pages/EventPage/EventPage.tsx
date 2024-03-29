import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Map, { Marker } from "react-map-gl";
import { IoIosWarning } from "react-icons/io";

import { Event } from "../../Commons/types/Event";
import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { RowStack } from "../../ui/components/RowStack/RowStack";
import { getMapTheme, MAPBOX_TOKEN } from "../Map/MapBox/MapBox";
import { ColumnStack } from "../../ui/components/ColumnStack/ColumnStack";
import { getEvent } from "../../api/events/events";
import { MarksBlock } from "../../ui/components/MarksBlock/MarksBlock";
import { SubscribeButton } from "../../ui/components/SubscribeButton/SubscribeButton";
import { useAuthStore } from "../../stores/userStore/userStore";
import {subscribe, unsubscribe} from "../../api/subscriptions/subscriptions";

import cn from "./EventPage.less";
import { ImageSlider } from "./PhotoSlider/Slider";

export const EventPage = (): JSX.Element => {
    const { id = "" } = useParams<"id">();
    const [event, setEvent] = useState<Event>();
    const { user } = useAuthStore();
    useEffect(() => {
        loadEvent();
    }, []);

    const isUserSubscribed = useMemo(() => event?.subscriptions?.find(x => x.userId === user?.id) != null, [event]);

    async function loadEvent() {
        const currentId = Number(id);
        if (!isNaN(currentId)) {
            const serverEvent = await getEvent(currentId);
            if (serverEvent) {
                setEvent(serverEvent);
            }
        }
    }

    const onSubscribe = async () => {
        if (event?.id) {
            await subscribe(event.id);
        }
    };

    const onUnsubscribe = async () => {
        if (event?.id) {
            await unsubscribe(event.id);
        }
    };

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
        tags,
        photos,
        description,
        dateRange: { endDate, startDate },
        location: { latitude, longitude },
        hidden,
    } = event;
    const start = new Date(startDate).toLocaleString();
    const end = endDate && new Date(endDate).toLocaleString();

    return (
        <CommonLayout style={{ width: "fit-content", margin: "0 auto", paddingBottom: "40px" }}>
            <CommonLayout.Header>
                <GoBackLink backUrl=".." />
                <h1 className={cn("header")}>Событие {name}</h1>
            </CommonLayout.Header>
            <RowStack className={cn("event-page")}>
                <div className={cn("column")}>
                    {photos && <ImageSlider slides={photos} />}
                    {creator && (
                        <RowStack>
                            <span className={cn("title")}>Создатель</span> {creator}
                        </RowStack>
                    )}
                    {description && (
                        <ColumnStack>
                            <span className={cn("title")}>Описание</span>
                            <p className={cn("description")}>{description}</p>
                        </ColumnStack>
                    )}
                    <RowStack align="center">
                        {tags?.map(({ name }) => (
                            <span key={name}>#{name}</span>
                        ))}
                        {creator !== user?.username && (
                            <div className={cn("sub-button")}>
                                <SubscribeButton isUserSubscribed={isUserSubscribed} onSubscribe={onSubscribe} onUnsubscribe={onUnsubscribe} />
                            </div>
                        )}
                    </RowStack>
                    <RowStack align="center">
                        <ColumnStack>
                            <RowStack>
                                <span className={cn("title")}>Дата начала</span>
                                <p>{start}</p>
                            </RowStack>
                            {endDate && (
                                <RowStack>
                                    <span className={cn("title")}>Дата конца</span>
                                    <p>{end}</p>
                                </RowStack>
                            )}
                        </ColumnStack>
                        <MarksBlock className={cn("marks")} event={event} onValueChange={setEvent} />
                    </RowStack>
                </div>
                <div className={cn("column", "event-map")}>
                    <Map
                        id="eventIdMap"
                        initialViewState={{
                            latitude,
                            longitude,
                            zoom: 0.55,
                        }}
                        projection="globe"
                        style={{ width: "100%", height: "100%", borderRadius: "16px" }}
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
