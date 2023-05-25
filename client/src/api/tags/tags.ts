import { Tag } from "../../Commons/types/Event";
import { $authHost } from "../index";

export const getTags = async (): Promise<Tag[]> => {
    const { data: tags } = await $authHost.get(`api/tags`);
    return tags;
};