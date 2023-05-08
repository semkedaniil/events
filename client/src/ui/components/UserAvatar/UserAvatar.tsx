import React, {useEffect, useState} from "react";

import { stringToColor } from "../../../Pages/ProfilePage/helpers";
import defaultImage from "../../../assets/avatar.jpg";

import cn from "./UserAvatar.less";
import {useAuthStore} from "../../../stores/userStore/auth";

interface UserAvatarProps {
    onClick?: () => void;
    className?: string;
    url?: Nullable<string>;
}

export const UserAvatar = ({ onClick, className }: UserAvatarProps): JSX.Element => {
    const { user } = useAuthStore();
    const [imageUrl, setImageUrl] = useState<Nullable<string>>(user?.avatarUrl);
    useEffect(() => {
        if (user?.avatarUrl) {
            setImageUrl(`${process.env.REACT_APP_API_URL}${user?.avatarUrl}`);
        } else {
            setImageUrl(null);
        }
    }, [user]);

    if (imageUrl) {
        return <img className={cn(className, "avatar")} onClick={onClick} src={imageUrl} alt="avatar" />;
    }

    if (user?.username) {
        return (
            <div
                className={cn(className, "avatar")}
                onClick={onClick}
                style={{ backgroundColor: stringToColor(user.username ?? "default") }}>
                {user.username?.trim()[0].toUpperCase()}
            </div>
        );
    }
    return <img className={cn(className, "avatar")} onClick={onClick} src={defaultImage} alt="avatar" />;
};
