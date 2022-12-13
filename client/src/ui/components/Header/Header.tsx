import { useEffect, useRef, useState } from "react";

import { UserAvatar } from "../UserAvatar/UserAvatar";
import { useOutsideAlerter } from "../../../hooks/useOutsideAlerter";

import { HeaderMenu } from "./HeaderMenu";
import cn from "./Header.less";

export const Header = (): JSX.Element => {
    const [showMenu, setShowMenu] = useState(false);
    const wrapperRef = useRef(null);
    const clickedOutside = useOutsideAlerter(wrapperRef);
    useEffect((): void => {
        if (clickedOutside && showMenu) {
            setShowMenu(false);
        }
    }, [clickedOutside]);
    const onHeaderClick = (): void => {
        setShowMenu(!showMenu);
    };
    return (
        <header ref={wrapperRef} className={cn("header")}>
            <div onClick={onHeaderClick}>
                <UserAvatar />
            </div>
            {showMenu && <HeaderMenu />}
        </header>
    );
};
