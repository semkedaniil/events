import { Link } from "@skbkontur/react-ui";

import { UserAvatar } from "../UserAvatar/UserAvatar";

import cn from "./Header.less";
import { TOKEN_KEY, useAuthStore } from "../../../stores/userStore/auth";
import { setLocalStorage } from "../../../stores/utils";
import { useNavigate } from "react-router-dom";

interface HeaderMenuProps {
    onClose: () => void;
}
export const HeaderMenu = ({ onClose }: HeaderMenuProps): JSX.Element => {
    const { isAuth, setIsAuth, setUser } = useAuthStore();
    const navigate = useNavigate();
    const logout = () => {
        setUser(null);
        setIsAuth(false);
        setLocalStorage(TOKEN_KEY, "");
        onClose();
        navigate("login");
    }
    return (
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
            {!isAuth ? <Link href="/login" className={cn("menu-item")}>
                Войти
            </Link> : <div onClick={logout} className={cn("menu-item")}>Выйти из аккаунта</div>
            }
        </div>
    );
};
