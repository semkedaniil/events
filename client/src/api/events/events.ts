import { $authHost } from "../index";
import { EventDto, Event } from "../../Commons/types/Event";

export const createEvent = async ({
    name,
    dateRange,
    description,
    location,
    photos,
    tags,
}: EventDto): Promise<void> => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", JSON.stringify(location));
    formData.append("dateRange", JSON.stringify(dateRange));
    formData.append("tags", JSON.stringify(tags));
    formData.append("description", description ?? "");
    if (photos)
        for (const photo of photos) {
            formData.append(photo.name, photo);
        }
    await $authHost.post("api/events/create", formData, {
        headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getAllEvents = async (): Promise<Event[]> => {
    const { data: events } = await $authHost.get("api/events");
    return events as Event[];
};

export const getUserEvents = async (): Promise<Event[]> => {
    const { data: events } = await $authHost.get("api/events/user");
    return events as Event[];
};

export const getEvent = async (id: number): Promise<Event> => {
    const { data: event } = await $authHost.get(`api/events/${id}`);
    return event as Event;
};

export const updateEvent = async ({
    name,
    dateRange,
    description,
    location,
    photos,
    tags,
    id,
}: EventDto): Promise<void> => {
    const formData = new FormData();
    formData.append("id", id ?? "");
    formData.append("name", name);
    formData.append("location", JSON.stringify(location));
    formData.append("dateRange", JSON.stringify(dateRange));
    formData.append("tags", JSON.stringify(tags));
    formData.append("description", description ?? "");
    if (photos)
        for (const photo of photos) {
            formData.append(photo.name, photo);
        }
    await $authHost.put(`api/events/${id}`, formData, {
        headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteEventImage = async (url: string, eventId: number): Promise<void> => {
    await $authHost.put(`api/events/image/delete`, { url, eventId });
};
