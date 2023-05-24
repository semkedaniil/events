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
    photos?.forEach(photo => {
        formData.append(photo.name, photo);
    })
    await $authHost.post("api/events/create", formData, { headers: {
        Accept: "application/json",
            "Content-Type": "multipart/form-data"
    }});
};

export const getAllEvents = async (): Promise<Event[]> => {
    const { data: events } = await $authHost.get("api/events");
    return events as Event[];
};

export const getUserEvents = async (): Promise<Event[]> => {
    const { data: events } = await $authHost.get("api/events/user");
    return events as Event[];
};