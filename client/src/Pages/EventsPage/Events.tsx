import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { Event } from "../../Commons/types/Event";
import { getUserEvents } from "../../api/events/events";
import { useAuthStore } from "../../stores/userStore/userStore";
import { EventList } from "../../Commons/components/EventCard/EventCard";

export const Events = (): JSX.Element => {
    const [userEvents, setUserEvents] = useState<Event[]>([]);

    useEffect(() => {
        loadEvents();
    }, []);

    const onDeleteEvent = (eventId: number) => {
        setUserEvents(userEvents.filter(event => event.id !== eventId))
    }
    return (
        <CommonLayout>
            <CommonLayout.Header>
                <GoBackLink backUrl=".." />
                <h1>Events</h1>
            </CommonLayout.Header>
            <CommonLayout.Content>
                <EventList events={userEvents} onDeleteEvent={onDeleteEvent}/>
            </CommonLayout.Content>
        </CommonLayout>
    );

    async function loadEvents() {
        const events = await getUserEvents();
        setUserEvents(events);
    }
};
