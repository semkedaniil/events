import { createContext, useContext } from "react";

import { IGameContext } from "../types/typers";

export const GameContext = createContext<IGameContext | null>(null);

export function useGameContext(): IGameContext {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameContext must be used within a GameContextProvider");
    }
    return context;
}
