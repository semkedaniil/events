import { Tile } from "../types/typers";
import { TileContainer } from "../Tiles/TilesContainer";

import { GameResultContainer } from "./Components/GameResult/GameResult";
import cn from "./Board.less";
import { BoardGrid } from "./Components/BoardGrid/BoardGrid";

interface BoardProps {
    tiles: Tile[];
}

export const Board = ({ tiles }: BoardProps): JSX.Element => (
    <div id="board-container" className={cn("board-container")}>
        <GameResultContainer tiles={tiles} />
        <BoardGrid />
        <TileContainer tiles={tiles} />
    </div>
);
