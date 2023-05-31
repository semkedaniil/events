import { Link } from "@skbkontur/react-ui";
import React from "react";
import { BsGearWideConnected, BsTrash3 } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import { Event } from "../../types/Event";
import { ColumnStack } from "../../../ui/components/ColumnStack/ColumnStack";
import { RowStack } from "../../../ui/components/RowStack/RowStack";
import { MarksBlock } from "../../../ui/components/MarksBlock/MarksBlock";
import { useEventsStore } from "../../../stores/eventsStore/eventsStore";
import { useAuthStore } from "../../../stores/userStore/userStore";
import {deleteEvent} from "../../../api/events/events";

import cn from "./Event.less";

interface EventListProps {
    events: Event[];
    className?: string;
    onDeleteEvent?: (eventId: number) => void;
}

export const EventList = ({ events, className, onDeleteEvent }: EventListProps) => {
    const { events: originalEvents } = useEventsStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const onValueChange = (updatedEvent: Event) => {
        const event = originalEvents.find(event => event.id === updatedEvent.id);
        const currentEvent = events.find(event => event.id === updatedEvent.id);
        if (event) {
            event.marks = { ...updatedEvent.marks };
        }

        if (currentEvent) {
            currentEvent.marks = { ...updatedEvent.marks };
        }
    };

    const onEditButtonClick = (eventId: number) => {
        navigate(`/event/${eventId}/edit`);
    };

    const onDelete = async (eventId: number) => {
        await deleteEvent(eventId);
        onDeleteEvent?.(eventId);
    }

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
                    tags,
                } = event;
                const start = new Date(startDate).toLocaleString();
                const end = endDate && new Date(endDate).toLocaleString();
                const canDelete = user?.username === creator && onDeleteEvent;
                return (
                    <div key={id} className={cn("event")}>
                        <div className={cn("buttons")}>
                            {user?.username === creator && (
                                <div
                                    className={cn("edit-button", { "with-delete": canDelete})}
                                    title="Редактировать событие"
                                    onClick={() => onEditButtonClick(id)}
                                >
                                    <BsGearWideConnected size={32} />
                                </div>
                            )}
                            {canDelete && (
                                <div
                                    className={cn("delete-button")}
                                    title="Удалить событие"
                                    onClick={() => onDelete(id)}
                                >
                                    <BsTrash3 size={32} />
                                </div>
                            )}
                        </div>

                        {photos?.[0] && <img className={cn("img")} src={photos?.[0]} height={100} alt={name} />}
                        <div className={cn("main-info")}>
                            <Link title="Открыть страницу события" href={`/event/${id}`}>
                                <h2 className={cn("name")}>{name}</h2>
                            </Link>
                            <main>{description}</main>
                            <footer>
                                {creator && <span className={cn("author")}>Автор {creator}</span>}
                                <RowStack>
                                    {tags?.map(({ name }) => (
                                        <span key={name}>#{name}</span>
                                    ))}
                                </RowStack>
                                <RowStack align="center" className={cn("marks-wrapper")}>
                                    <ColumnStack className={cn("date-range")}>
                                        <span>Начало {start}</span>
                                        {endDate && <span>Конец {end}</span>}
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
