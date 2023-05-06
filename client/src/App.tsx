import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "@skbkontur/react-ui";

import { CommonPage } from "./ui/components/CommonPage/CommonPage";
import { Map } from "./Pages/Map/Map";
import { Help } from "./Pages/Help/Help";
import { Events } from "./Pages/Events/Events";
import { Login } from "./Pages/Login/Login";
import { Register } from "./Pages/Register/Register";
import { ResetPasswordPage } from "./Pages/ResetPasswordPage/ResetPasswordPage";
import { NotFoundPage } from "./Pages/NotFoundPage/NotFoundPage";
import cn from "./App.less";
import { useAuthStore } from "./stores/userStore/auth";
import { isDevelopment } from "./Commons/utlis";
import { Verifying } from "./Pages/Verifying/Verifying";
import { ProfilePage } from "./Pages/ProfilePage/ProfilePage";

const routes = [
    { path: "/", element: <Map /> },
    { path: "/help", element: <Help /> },
    { path: "/events", element: <Events /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/verify", element: <Verifying /> },
    { path: "/reset-password", element: <ResetPasswordPage /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "*", element: <NotFoundPage /> },
];

const allowedRoutes = new Set(["/login", "/register", "/reset-password", "/help"]);

export const App = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const authStore = useAuthStore();
    const { pathname } = useLocation();
    useEffect(() => {
        if (isDevelopment || allowedRoutes.has(pathname)) {
            return;
        }
        setLoading(true);
        authStore
            .check()
            .catch(error => {
                if (error.response.status === 401) {
                    navigate("/login");
                }
            })
            .finally(() => setLoading(false));
    }, [authStore, navigate, pathname]);

    return (
        <Loader type="big" active={loading} className={cn("app")}>
            <Routes>
                <Route element={<CommonPage />}>
                    {routes.map(
                        ({ path, element }): JSX.Element => (
                            <Route key={path} path={path} element={element} />
                        )
                    )}
                </Route>
            </Routes>
        </Loader>
    );
};
