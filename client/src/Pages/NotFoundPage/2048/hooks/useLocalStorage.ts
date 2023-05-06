import { Dispatch, useEffect, useReducer } from "react";

const GAME_ID = "2048game";

const useStateReducer = (previousState: any, newState: any): any =>
    typeof newState === "function" ? newState(previousState) : newState;

const getInitialValue = <T>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(GAME_ID);
        if (item) {
            const gameState = JSON.parse(item);
            const value = gameState?.[key];
            return (value as T) ?? defaultValue;
        }
    } catch {
        return defaultValue;
    }
    return defaultValue;
};

export function useGameLocalStorage<T>(key: string, defaultValue: T, reducer = useStateReducer): [T, Dispatch<any>] {
    const [value, dispatch] = useReducer(reducer, getInitialValue<T>(key, defaultValue));

    useEffect((): void => {
        const item = window.localStorage.getItem(GAME_ID);
        if (item) {
            const state = JSON.parse(item) || {};
            state[key] = value;
            window.localStorage.setItem(GAME_ID, JSON.stringify(state));
        }
    }, [value, key]);

    return [value, dispatch];
}
