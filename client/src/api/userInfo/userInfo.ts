import { User } from "../../Commons/types/User";
import { $authHost } from "../index";

export const updateUserInfo = async (userInfo: Partial<User>): Promise<string> => {
    const {
        data: { token },
    } = await $authHost.put("api/user/update", { ...userInfo });
    return token;
};

export const updateUserAvatar = async (avatar: File | null): Promise<string> => {
    const formData = new FormData();
    formData.append("avatar", avatar ?? "");
    const {
        data: { token },
    } = await $authHost.post("api/user/image", formData, {
        headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
        },
    });
    return token;
};

export const deleteUserAvatar = async (): Promise<string> => {
    const {
        data: { token },
    } = await $authHost.put("api/user/image/delete");
    return token;
};
