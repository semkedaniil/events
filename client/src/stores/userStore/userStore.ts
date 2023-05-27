import { create } from "zustand";
import { persist } from "zustand/middleware";
import jwtDecode from "jwt-decode";

import { User } from "../../Commons/types/User";
import { setLocalStorage } from "../utils";
import { check } from "../../api/auth/auth";

interface UserStore {
    isAuth: boolean;
    user: User | null;
}

interface Actions {
    setToken: (token: string) => void;
    setUser: (user: User | null) => void;
    setIsAuth: (isAuth: boolean) => void;
    check: () => Promise<void>;
}

type AuthStoreState = UserStore & Actions;

export const TOKEN_KEY = "token";

const defaultUserState = {
    token: null,
    isAuth: false,
    user: null,
};

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set, get) => ({
            ...defaultUserState,
            setUser: (user: User | null) => set(() => ({ user })),
            setIsAuth: (isAuth: boolean) =>
                set(() => ({
                    isAuth,
                })),
            setToken: token => {
                setLocalStorage(TOKEN_KEY, token);
                const user = jwtDecode(token) as User;
                get().setIsAuth(true);
                get().setUser(user);
            },
            check: async () => {
                const token = await check();
                const user = jwtDecode(token) as User;
                get().setUser(user);
            },
        }),
        { name: "global" }
    )
);
