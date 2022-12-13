import { useEffect } from "react";

import { useGameLocalStorage } from "../../hooks/useLocalStorage";
import { GameContextActionType, GameState, GameStatus, Tile } from "../types/typers";
import { KEYBOARD_ARROW_TO_DIRECTION_MAP } from "../../constants/constants";
import {
    areEqual,
    createRandomTile,
    generateBoard,
    isGameOver,
    isGameWon,
    merge,
    MOVES_MAP,
} from "../../utils/boardUtils";

import { GameContext } from "./hooks";

interface GameProviderProps {
    children: JSX.Element;
}

export const GameProvider = ({ children }: GameProviderProps): JSX.Element => {
    const [state, dispatch] = useGameLocalStorage<GameState>("game", initState(), gameReducer);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent): void => {
            event.preventDefault();
            const direction = KEYBOARD_ARROW_TO_DIRECTION_MAP[event.key];
            if (direction) {
                dispatch({ type: "move", payload: direction });
            }
        };

        document.addEventListener("keydown", handleKeyPress);

        return (): void => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [dispatch]);

    return <GameContext.Provider value={{ gameState: state, dispatch }}>{children}</GameContext.Provider>;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function gameReducer(state: GameState, action: GameContextActionType) {
    switch (action.type) {
        case "restart":
            return initState();

        case "continue":
            return { ...state, status: "PLAY_AFTER_WIN" };

        case "move": {
            const move = MOVES_MAP[action.payload];
            let tiles: Tile[] = move(state.tiles);
            if (areEqual(state.tiles, tiles)) {
                return state;
            }
            tiles = merge(tiles);
            tiles = [...tiles, createRandomTile(tiles)];
            const status = getGameStatus(tiles);
            const shouldChangeStatus = state.status !== "PLAY_AFTER_WIN" || status === "GAME_OVER";

            return {
                tiles,
                lastMove: action.payload,
                status: shouldChangeStatus ? status : state.status,
            };
        }
        default:
            throw new Error(`Unhandled action: ${action}`);
    }
}

function getGameStatus(tiles: Tile[]): GameStatus {
    if (isGameOver(tiles)) {
        return "GAME_OVER";
    }

    if (isGameWon(tiles)) {
        return "WIN";
    }

    return "IN_PROGRESS";
}

function initState(tilesCount = 2): GameState {
    return {
        tiles: generateBoard(tilesCount),
        lastMove: null,
        status: "IN_PROGRESS",
    };
}
