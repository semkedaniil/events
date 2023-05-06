import { Role } from "./Role";

export interface User {
    email: string;
    username: string;
    birthday: string;
    id: number;
    role: Role;
}
