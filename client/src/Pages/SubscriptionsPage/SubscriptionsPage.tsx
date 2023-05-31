import { useEffect, useState } from "react";

import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { EventList } from "../../Commons/components/EventCard/EventCard";
import { Event } from "../../Commons/types/Event";
import { getSubscriptionEventsByUserId } from "../../api/subscriptions/subscriptions";
import { useAuthStore } from "../../stores/userStore/userStore";

export const SubscriptionsPage = () => {
    const { user } = useAuthStore();
    const [userEvents, setUserEvents] = useState<Event[]>([]);

    useEffect(() => {
        loadEvents();
    }, []);
    return (
        <CommonLayout>
            <CommonLayout.Header>
                <GoBackLink backUrl=".." />
                <h1>Мои подписки</h1>
            </CommonLayout.Header>
            <CommonLayout.Content>
                <EventList events={userEvents} />
            </CommonLayout.Content>
        </CommonLayout>
    );

    async function loadEvents() {
        if (user?.id) {
            const events = await getSubscriptionEventsByUserId(user?.id);
            setUserEvents(events);
        }
    }
};
