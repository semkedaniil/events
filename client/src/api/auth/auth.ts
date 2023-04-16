import { $authHost, $host } from "../index";

export const registration = async (username: string,
                                   birthday: string,
                                   email: string,
                                   password: string): Promise<string> => {
    const {
        data: { token },
    } = await $host.post("api/user/registration", { username, birthday, email, password, role: "ADMIN" });
    return token;
};

export const login = async (username: string, password: string): Promise<string> => {
    const {
        data: { token },
    } = await $host.post("api/user/login", { username, password });
    return token;
};

export const check = async (): Promise<string> => {
    const {
        data: { token },
    } = await $authHost.get("api/user/auth");
    return token;
};
