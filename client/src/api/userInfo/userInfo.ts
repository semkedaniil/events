import { User } from "../../Commons/types/User";
import { $authHost } from "../index";

export const updateUserInfo = async (userInfo: Partial<User>): Promise<string> => {
    const {
        data: { token },
    } = await $authHost.put("api/user/update", { ...userInfo });
    return token;
};