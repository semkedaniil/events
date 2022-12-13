import { Tile } from "../../../types/typers";
import { Tile as BoardTile } from "../Tile/Tile";

interface TilesListProps {
    tiles: Tile[];
    factor: number;
}

export const TilesList = ({ factor, tiles }: TilesListProps): JSX.Element => (
    <div data-tid="TilesList">
        {tiles.map(
            ({ id, positionX, positionY, type, value }): JSX.Element => (
                <BoardTile key={id} value={value} type={type} x={positionY * factor} y={positionX * factor} />
            )
        )}
    </div>
);
