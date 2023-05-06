import { Tile } from "../types/typers";

export interface ACTIONTYPE {
    type: "change";
    payload: Tile[];
}

export interface ScoresState {
    score: number;
    bestScore: number;
    newPoints: number;
    tiles: Tile[];
}
