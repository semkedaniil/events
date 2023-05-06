import { Navigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FcCheckmark } from "react-icons/fc";

import { verify } from "../../api/auth/auth";
import { useAuthStore } from "../../stores/userStore/auth";

import cn from "./Verifying.less";

export const Verifying = () => {
    const [searchParams] = useSearchParams();
    const { setToken } = useAuthStore();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const token = searchParams.get("token");
    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            verify(token).then(x => {
                setIsConfirmed(x);
            });
        }
    }, [searchParams]);

    if (isConfirmed && !token) {
        return <Navigate to="/login" />;
    }

    return (
        <div className={cn("page")}>
            <h2 className={cn("header")}>
                <div className={cn("mark")}>
                    <FcCheckmark />
                </div>
                <span>
                    {isConfirmed
                        ? "Ваш аккаунт подтвержден, теперь вы можете войти в аккаунт"
                        : "На ваш адрес было отправлено письмо с подтверждением аккаунта"}
                </span>
            </h2>
        </div>
    );
};
