import { Outlet } from "react-router-dom";

import { Header } from "../Header/Header";

import cn from "./CommonPage.less";

export const CommonPage = (): JSX.Element => (
    <div className={cn("common-page")}>
        <Header />
        <main className={cn("content")}>
            <Outlet />
        </main>
    </div>
);
