import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "@skbkontur/react-ui";

import { CommonPage } from "./ui/components/CommonPage/CommonPage";
import { Map } from "./Pages/Map/Map";
import { Help } from "./Pages/HelpPage/Help";
import { Events } from "./Pages/EventsPage/Events";
import { Login } from "./Pages/LoginPage/Login";
import { Register } from "./Pages/RegisterPage/Register";
import { ResetPasswordPage } from "./Pages/ResetPasswordPage/ResetPasswordPage";
import { NotFoundPage } from "./Pages/NotFoundPage/NotFoundPage";
import cn from "./App.less";
import { useAuthStore } from "./stores/userStore/userStore";
import { Verifying } from "./Pages/VerifyingPage/Verifying";
import { ProfilePage } from "./Pages/ProfilePage/ProfilePage";
import { EventPage } from "./Pages/EventPage/EventPage";
import { EventCreationPage } from "./Pages/EventCreationPage/EventCreationPage";
import { EventEditingPage } from "./Pages/EventEditingPage/EventEditingPage";
import { SubscriptionsPage } from "./Pages/SubscriptionsPage/SubscriptionsPage";

const routes = [
    { path: "/", element: <Map /> },
    { path: "/help", element: <Help /> },
    { path: "/subscriptions", element: <SubscriptionsPage /> },
    { path: "/events", element: <Events /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/verify", element: <Verifying /> },
    { path: "/reset-password", element: <ResetPasswordPage /> },
    { path: "/event/:id", element: <EventPage /> },
    { path: "/event/:id/edit", element: <EventEditingPage /> },
    { path: "/event/create", element: <EventCreationPage /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "*", element: <NotFoundPage /> },
];

const allowedRoutes = new Set(["/login", "/register", "/reset-password", "/help", "/verify"]);

export const App = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { check, setUser, setToken, setIsAuth } = useAuthStore();
    const { pathname } = useLocation();
    useEffect(() => {
        if (allowedRoutes.has(pathname)) {
            return;
        }
        setLoading(true);
        check()
            .then(() => setIsAuth(true))
            .catch(error => {
                if (error.response.status >= 400 && error.response.status < 500) {
                    navigate("/login");
                    setUser(null);
                    setIsAuth(false);
                    setToken("");
                }
            })
            .finally(() => setLoading(false));
    }, []);

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
