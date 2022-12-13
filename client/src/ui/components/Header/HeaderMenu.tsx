import { Link } from "@skbkontur/react-ui";

import { UserAvatar } from "../UserAvatar/UserAvatar";

import cn from "./Header.less";

export const HeaderMenu = (): JSX.Element => (
    <div className={cn("header-menu")}>
        <div className={cn("credentials")}>
            <UserAvatar />
            <span>Семке Даниил</span>
        </div>
        <Link href="/events" className={cn("menu-item")}>
            Мои события
        </Link>
        <Link href="/help" className={cn("menu-item")}>
            Помощь
        </Link>
        <Link href="/login" className={cn("menu-item")}>
            Войти
        </Link>
    </div>
);
