import { memo } from "react";

import { TileType, Value } from "../../../types/typers";

import cn from "./Tile.less";

interface TileProps {
    value: Value;
    type: TileType;
    x: number;
    y: number;
}

export const Tile = memo(
    ({ type, value, x, y }: TileProps): JSX.Element => (
        <div data-tid="Tile" className={cn("tile", `tile-${value}`)} style={{ transform: `translate(${x}px, ${y}px)` }}>
            <div className={cn("tile-inner", type)}>{value}</div>
        </div>
    )
);
