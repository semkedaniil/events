import { Hint, Link, Tooltip } from "@skbkontur/react-ui";
import { useNavigate } from "react-router-dom";

import { UserAvatar } from "../UserAvatar/UserAvatar";
import { TOKEN_KEY, useAuthStore } from "../../../stores/userStore/userStore";
import { setLocalStorage } from "../../../stores/utils";

import cn from "./Header.less";

interface HeaderMenuProps {
    onClose: () => void;
}

export const HeaderMenu = ({ onClose }: HeaderMenuProps): JSX.Element => {
    const { isAuth, setIsAuth, setUser, user } = useAuthStore();
    const navigate = useNavigate();
    const logout = () => {
        setUser(null);
        setIsAuth(false);
        setLocalStorage(TOKEN_KEY, "");
        onClose();
        navigate("login");
    };

    const onClickCredentials = () => {
        onClose();
        navigate("/profile");
    };

    const renderTooltip = () => <span>Изменить аватар</span>;
    return (
        <div className={cn("header-menu")}>
            {isAuth && (
                <>
                    <div className={cn("credentials-wrapper")}>
                        <Tooltip render={renderTooltip}>
                            <UserAvatar onClick={onClickCredentials} className={cn("user-avatar")} />
                        </Tooltip>
                        <div className={cn("credentials")}>
                            <span className={cn("username")}>{user?.username}</span>
                            <span className={cn("email")}>{user?.email}</span>
                        </div>
                    </div>
                    <Link href="/profile" className={cn("menu-item")}>
                        Личные данные
                    </Link>
                    <Link href="/events" className={cn("menu-item")}>
                        Мои события
                    </Link>
                </>
            )}
            <Link href="/help" className={cn("menu-item")}>
                Помощь
            </Link>
            {isAuth ? (
                <div onClick={logout} className={cn("menu-item")}>
                    Выйти из аккаунта
                </div>
            ) : (
                <Link href="/login" className={cn("menu-item")}>
                    Войти
                </Link>
            )}
        </div>
    );
};
