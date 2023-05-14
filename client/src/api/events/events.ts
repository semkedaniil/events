import { $authHost } from "../index";
import { Event } from "../../Commons/types/Event";
import { getFakeEvents } from "../../stores/eventsStore/helpers";

export const createEvent = async (event: Event): Promise<void> => {
    await $authHost.post("api/events/create", { event });
};

export const getAllEvents = async (): Promise<Event[]> => {
    const events = getFakeEvents();
    return Promise.resolve(events);
    // await $authHost.put("api/events");
};