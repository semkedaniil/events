import { Role } from "./Role";

export interface User {
    email: string;
    id: number;
    role: Role;
}