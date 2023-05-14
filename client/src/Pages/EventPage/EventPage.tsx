import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Event } from "../../Commons/types/Event";
import { useEventsStore } from "../../stores/eventsStore/eventsStore";
import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
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
        location: { latitude, longitude },
        hidden,
    } = event;
    return (
        <CommonLayout>
            <CommonLayout.Header>
                <GoBackLink backUrl=".." />
                <h1 className={cn("header")}>Событие {name}</h1>
            </CommonLayout.Header>
            <div className={cn("event-page")}>
                {photos && <ImageSlider slides={[...photos, ...photos, ...photos, ...photos]} />}
                <div>{creator}</div>
                <div>{photos?.[0]}</div>
                <div>{startDate}</div>
                <div>{endDate}</div>
                <div>{description}</div>
                <div>{latitude}</div>
                <div>{longitude}</div>
                <div>{hidden}</div>
            </div>
        </CommonLayout>
    );
};