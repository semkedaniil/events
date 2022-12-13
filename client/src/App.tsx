import { Route, Routes } from "react-router-dom";
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
import { check } from "./api/auth/auth";

const routes = [
    { path: "/", element: <Map /> },
    { path: "/help", element: <Help /> },
    { path: "/events", element: <Events /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/reset-password", element: <ResetPasswordPage /> },
    { path: "*", element: <NotFoundPage /> },
];

export const App = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        check().finally(() => setLoading(false));
    }, []);
    return (
        <Loader type="big" active={loading}>
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
