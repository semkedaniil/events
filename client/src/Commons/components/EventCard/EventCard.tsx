import { Link } from "@skbkontur/react-ui";
import React from "react";

import { Event } from "../../types/Event";
import { ColumnStack } from "../../../ui/components/ColumnStack/ColumnStack";
import { RowStack } from "../../../ui/components/RowStack/RowStack";
import { MarksBlock } from "../../../ui/components/MarksBlock/MarksBlock";
import { useEventsStore } from "../../../stores/eventsStore/eventsStore";

import cn from "./Event.less";

interface EventListProps {
    events: Event[];
    className?: string;
}

export const EventList = ({ events, className }: EventListProps) => {
    const { events: originalEvents } = useEventsStore();
    const onValueChange = (updatedEvent: Event) => {
        const event = originalEvents.find(event => event.id === updatedEvent.id);
        if (event) {
            event.marks = { ...updatedEvent.marks };
        }
    };
    return (
        <div className={cn("events", className)}>
            {events.map(event => {
                const {
                    id,
                    name,
                    dateRange: { startDate, endDate },
                    photos,
                    description,
                    creator,
                } = event;
                const start = new Date(startDate).toLocaleString();
                const end = endDate && new Date(endDate).toLocaleString();
                return (
                    <div key={id} className={cn("event")}>
                        {photos?.[0] && <img className={cn("img")} src={photos?.[0]} height={100} alt={name} />}
                        <div className={cn("main-info")}>
                            <Link title="Открыть страницу события" href={`/event/${id}`}>
                                <h2 className={cn("name")}>{name}</h2>
                            </Link>
                            <main>{description}</main>
                            <footer>
                                {creator && <span className={cn("author")}>Автор: {creator}</span>}
                                <RowStack align="center" className={cn("marks-wrapper")}>
                                    <ColumnStack className={cn("date-range")}>
                                        <span>Начало: {start}</span>
                                        {endDate && <span>Конец: {end}</span>}
                                    </ColumnStack>
                                    <MarksBlock
                                        event={event}
                                        className={cn("marks")}
                                        withoutCaption
                                        onValueChange={onValueChange}
                                    />
                                </RowStack>
                            </footer>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
