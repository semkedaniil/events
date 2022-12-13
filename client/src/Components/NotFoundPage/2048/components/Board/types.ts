import { GameState, Tile } from "../types/typers";

export interface BoardState {
    moves: Array<GameState>;
    loading: boolean;
    tiles: Tile[];
}

export type BoardActionType = { type: "addMove"; payload: GameState } | { type: "startMove" } | { type: "endMove" };
