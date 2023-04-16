import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "@skbkontur/react-ui";

import { CommonPage } from "./ui/components/CommonPage/CommonPage";
import { Map } from "./Components/Map/Map";
import { Help } from "./Components/Help/Help";
import { Events } from "./Components/Events/Events";
import { Login } from "./Components/Login/Login";
import { Register } from "./Components/Register/Register";
import { ResetPasswordPage } from "./Components/ResetPasswordPage/ResetPasswordPage";
import { NotFoundPage } from "./Components/NotFoundPage/NotFoundPage";
import cn from "./App.less";
import { useAuthStore } from "./stores/userStore/auth";
import { login } from "./api/auth/auth";

const routes = [
    { path: "/", element: <Map /> },
    { path: "/help", element: <Help /> },
    { path: "/events", element: <Events /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/reset-password", element: <ResetPasswordPage /> },
    { path: "*", element: <NotFoundPage /> },
];

const allowedRoutes = ["/login", "/register", "/reset-password", "/help"];

export const App = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const authStore = useAuthStore();
    const { pathname } = useLocation();
    useEffect(() => {
        // todo: для дев режима сделать пользователя
        // console.log(process.env.NODE_ENV === 'development');
        if (allowedRoutes.includes(pathname)) {
            return;
        }
        setLoading(true);
        authStore.check().catch(x => {
            if (x.response.status === 401) {
                navigate("/login");
            }
        }).finally(() => setLoading(false));
    }, []);
    return (
        <Loader type="big" active={loading} className={cn("app")}>
            <Routes>
                <Route element={<CommonPage />}>
                    {routes.map(
                        ({ path, element }): JSX.Element => (
                            <Route key={path} path={path} element={element} />
                        ),
                    )}
                </Route>
            </Routes>
        </Loader>
    );
};
