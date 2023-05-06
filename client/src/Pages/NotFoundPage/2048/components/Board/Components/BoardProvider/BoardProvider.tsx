import { useEffect, useReducer } from "react";

import { MOVES_MAP } from "../../../../utils/boardUtils";
import { useGameContext } from "../../../Game/hooks";
import { GameState } from "../../../types/typers";
import { Board } from "../../Board";
import "../../Board.less";
import { BoardActionType, BoardState } from "../../types";

export const BoardProvider = (): JSX.Element => {
    const { gameState } = useGameContext();

    const [boardState, dispatch] = useReducer(boardReducer, initState());

    useEffect((): void => {
        dispatch({ type: "addMove", payload: gameState });
    }, [gameState]);

    useEffect((): void => {
        if (boardState.moves.length < 2 || boardState.loading) {
            return;
        }

        dispatch({ type: "startMove" });

        setTimeout((): void => {
            dispatch({
                type: "endMove",
            });
        }, 100);
    }, [boardState]);

    return <Board tiles={boardState.tiles} />;
};

function boardReducer(state: BoardState, action: BoardActionType): BoardState {
    switch (action.type) {
        case "addMove": {
            const isNewGame = !action.payload.lastMove;
            if (isNewGame || state.tiles.length === 0) {
                return initState(action.payload);
            }

            return {
                ...state,
                moves: [...state.moves, action.payload],
            };
        }
        case "startMove": {
            const currentGameState = state.moves[0];
            const nextGameState = state.moves[1];
            return {
                ...state,
                loading: true,
                tiles: nextGameState.lastMove ? MOVES_MAP[nextGameState.lastMove](currentGameState.tiles) : [],
            };
        }
        case "endMove": {
            const nextGameState = state.moves[1];
            return {
                moves: state.moves.slice(1),
                loading: false,
                tiles: nextGameState.tiles,
            };
        }
        default:
            throw new Error(`Unhandled action: ${action}`);
    }
}

function initState(gameState?: GameState): BoardState {
    if (gameState) {
        return { moves: [gameState], loading: false, tiles: gameState.tiles };
    }
    return { moves: [], loading: false, tiles: [] };
}
