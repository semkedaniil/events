import defaultAvatar from "../../../assets/avatar.jpg";

import cn from "./UserAvatar.less";

export const UserAvatar = (): JSX.Element => <img alt="Avatar" className={cn("avatar")} src={defaultAvatar} />;
