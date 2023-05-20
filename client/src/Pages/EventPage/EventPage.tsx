import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Event } from "../../Commons/types/Event";
import { useEventsStore } from "../../stores/eventsStore/eventsStore";
import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import cn from "./EventPage.less";
import { ImageSlider } from "./PhotoSlider/Slider";
import { RowStack } from "../../ui/components/RowStack/RowStack";

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
                    <p className={cn("title")}>
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
        location: { lat: latitude, lng: longitude },
        hidden,
    } = event;
    return (
        <CommonLayout>
            <CommonLayout.Header>
                <GoBackLink backUrl=".." />
                <h1 className={cn("header")}>Событие {name}</h1>
            </CommonLayout.Header>
            <RowStack className={cn("event-page")}>
                {photos && <ImageSlider slides={photos} />}
                {creator && <RowStack>Создатель: {creator}</RowStack>}
                <RowStack>Дата начала: {startDate}</RowStack>
                {endDate && <RowStack>Дата конца: {endDate}</RowStack>}
                {description && <RowStack>Описание: {description}</RowStack>}
                <RowStack>
                    Координаты: [{longitude}, {latitude}]
                </RowStack>
                {hidden && <RowStack>В данный момент событие скрыто на общей карте</RowStack>}
            </RowStack>
        </CommonLayout>
    );
};