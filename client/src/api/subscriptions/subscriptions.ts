import { $authHost } from "../index";
import { Subscription, Event } from "../../Commons/types/Event";

export const subscribe = async (eventId: number): Promise<Subscription> => {
    const { data: subscription } = await $authHost.post(`api/subscriptions/${eventId}/subscribe`);
    return subscription;
};

export const unsubscribe = async (eventId: number): Promise<void> => {
    await $authHost.put(`api/subscriptions/${eventId}/unsubscribe`);
};

export const getSubscriptionsByEventId = async (eventId: number): Promise<Subscription[]> => {
    const { data: tags } = await $authHost.get(`api/subscriptions/${eventId}`);
    return tags;
};

export const getSubscriptionEventsByUserId = async (userId: string): Promise<Event[]> => {
    const { data: events } = await $authHost.get(`api/subscriptions/user/${userId}`);
    return events;
};
