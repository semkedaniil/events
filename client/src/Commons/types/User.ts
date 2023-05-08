import { Role } from "./Role";

export interface User {
    email: string;
    username: string;
    birthday: string;
    avatarUrl?: string;
    id: number;
    role: Role;
}
