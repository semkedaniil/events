import defaultAvatar from "../../../assets/avatar.jpg";

import cn from "./UserAvatar.less";

interface UserAvatarProps {
    onClick?: () => void;
    className?: string;
}

export const UserAvatar = (props: UserAvatarProps): JSX.Element => (
    <img alt="Avatar" {...props} className={cn("avatar", props.className)} src={defaultAvatar} />
);
