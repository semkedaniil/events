import { useEffect } from "react";

import { useGameLocalStorage } from "../../hooks/useLocalStorage";
import { getMaxId } from "../../utils/boardUtils";
import { useGameContext } from "../Game/hooks";
import { Tile } from "../types/typers";
import { ScoreBox } from "../ScoreBox/ScoreBox";

import { ACTIONTYPE, ScoresState } from "./types";
import cn from "./ScoresContainer.less";

export const ScoresContainer = (): JSX.Element => {
    const {
        gameState: { tiles },
    } = useGameContext();

    const [state, dispatch] = useGameLocalStorage("scores", initState(), stateReducer);

    useEffect(() => {
        dispatch({ type: "change", payload: tiles });
    }, [tiles, dispatch]);

    useEffect(() => {
        if (state.newPoints > 0) {
            const oldAddScore = document.querySelector("#additionScore") as HTMLElement;
            if (oldAddScore) {
                oldAddScore.innerText = `+${state.newPoints}`;
                const newAddScore = oldAddScore.cloneNode(true);
                oldAddScore.parentNode?.replaceChild(newAddScore, oldAddScore);
            }
        }
    }, [state]);

    return (
        <div className={cn("scoresContainer")}>
            <div className={cn("scores")}>
                <ScoreBox title="Очки" score={state.score} />
                <div className={cn("add-score")} id="additionScore"></div>
            </div>
            <ScoreBox title="Лучший" score={state.bestScore} />
        </div>
    );
};

function initState(tiles: Tile[] = []): ScoresState {
    return {
        score: 0,
        newPoints: 0,
        bestScore: 0,
        tiles,
    };
}

const containsTile = (tiles: Tile[], tile: Tile): boolean => tiles.some((t): boolean => t.id === tile.id);

function stateReducer(state: ScoresState, action: ACTIONTYPE) {
    switch (action.type) {
        case "change": {
            const tiles = action.payload;

            if (state.tiles.length === tiles.length && state.tiles.every(t => containsTile(tiles, t))) {
                return state;
            }

            if (
                tiles.length === 2 &&
                [1, 2].every(id => tiles.find(tile => tile.id === id)) &&
                !state.tiles.every(t => containsTile(tiles, t))
            ) {
                return { ...initState(tiles), bestScore: state.bestScore };
            }

            // handles add new tile
            if (state.tiles.every(t => containsTile(tiles, t)) && tiles.length === state.tiles.length + 1) {
                return { ...state, tiles, newPoints: 0 };
            }

            // handles merge
            const lastGeneratedTileId = getMaxId(tiles);
            const newPoints = tiles.reduce((accumulator: number, current: Tile) => {
                const add =
                    current.id === lastGeneratedTileId || containsTile(state.tiles, current) ? 0 : current.value;
                return accumulator + add;
            }, 0);

            const score = state.score + newPoints;
            const bestScore = Math.max(score, state.bestScore);

            return { tiles, newPoints, score, bestScore };
        }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}
