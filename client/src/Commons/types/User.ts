import { Role } from "./Role";

export interface User {
    email: string;
    username: string;
    birthday: string;
    avatarUrl?: string;
    id: number;
    role: Role;
}

export interface UserInfo {
    userId: number;
    avatarUrl?: string;
    username: string;
}
