import React from "react";

import { stringToColor } from "../../../Pages/ProfilePage/helpers";

import cn from "./UserAvatar.less";

interface UserAvatarProps {
    onClick?: () => void;
    className?: string;
    username?: string;
}

export const UserAvatar = ({ username, onClick, className }: UserAvatarProps): JSX.Element => (
    <div
        className={cn(className, "avatar")}
        onClick={onClick}
        style={{ backgroundColor: stringToColor(username ?? "default") }}>
        {username?.trim()[0].toUpperCase()}
    </div>
);
