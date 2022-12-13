/* eslint-disable import/no-unassigned-import */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { ThemeContext, THEME_2022 } from "@skbkontur/react-ui";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";

const root = ReactDOM.createRoot(document.querySelector("#root") as HTMLElement);
root.render(
    <React.StrictMode>
        <ThemeContext.Provider value={THEME_2022}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeContext.Provider>
    </React.StrictMode>
);
