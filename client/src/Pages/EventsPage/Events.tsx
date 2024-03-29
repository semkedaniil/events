import { useEffect, useState } from "react";

import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { Event } from "../../Commons/types/Event";
import { getUserEvents } from "../../api/events/events";
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
                <h1>Мои события</h1>
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
