import { Event } from "../../Commons/types/Event";
import { $authHost } from "../index";

export const setMark = async (eventId: number, isLiked: boolean | null): Promise<Event> => {
    const { data: event } = await $authHost.post(`api/marks/${eventId}`, { isLiked });
    return event as Event;
};
