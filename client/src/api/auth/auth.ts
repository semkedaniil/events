import jwtDecode from "jwt-decode";

import { useAuthStore } from "../../stores/userStore/auth";
import { $authHost, $host } from "../index";
import {User} from "../../Commons/types/User";

export const registration = async (email: string, password: string): Promise<User> => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const authStore = useAuthStore();
    const {
        data: { token },
    } = await $host.post("api/user/registration", { email, password, role: "ADMIN" });
    authStore.setToken(token);
    return jwtDecode(token) as User;
};

export const login = async (email: string, password: string): Promise<User> => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const authStore = useAuthStore();
    const {
        data: { token },
    } = await $host.post("api/user/login", { email, password });
    authStore.setToken(token);
    return jwtDecode(token) as User;
};

export const check = async (): Promise<User> => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const authStore = useAuthStore();
    const {
        data: { token },
    } = await $authHost.get("api/user/auth");
    authStore.setToken(token);
    return jwtDecode(token) as User;
};
