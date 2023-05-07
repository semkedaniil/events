import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { UserAvatar } from "../UserAvatar/UserAvatar";
import { useOutsideAlerter } from "../../../hooks/useOutsideAlerter";
import { useAuthStore } from "../../../stores/userStore/auth";

import { HeaderMenu } from "./HeaderMenu";
import cn from "./Header.less";

const routesToHideHeader = new Set(["/profile"]);

export const Header = (): JSX.Element | null => {
    const [showMenu, setShowMenu] = useState(false);
    const location = useLocation();
    const { user } = useAuthStore();
    const wrapperRef = useRef(null);
    const clickedOutside = useOutsideAlerter(wrapperRef);
    useEffect((): void => {
        if (clickedOutside && showMenu) {
            setShowMenu(false);
        }
    }, [clickedOutside]);

    useEffect((): void => {
        setShowMenu(false);
    }, [location]);

    const onHeaderClick = (): void => {
        setShowMenu(!showMenu);
    };

    if (routesToHideHeader.has(location.pathname)) {
        return null;
    }
    return (
        <header ref={wrapperRef} className={cn("header")}>
            <div onClick={onHeaderClick} title={`Аккаунт Events ${user?.username} \n ${user?.email}`}>
                <UserAvatar username={user?.username} />
            </div>
            {showMenu && <HeaderMenu onClose={() => setShowMenu(false)} />}
        </header>
    );
};
