import { useEffect, useState } from "react";

import { ScreenSizeBreakpoint, TilesScreenTransformFactor } from "../../constants/constants";
import { Tile, TransformFactor } from "../types/typers";

import cn from "./TilesContainer.less";
import { TilesList } from "./Components/TilesList/TilesList";

const calcFactor = (): TransformFactor => {
    if (window.innerWidth <= ScreenSizeBreakpoint.XS) {
        return TilesScreenTransformFactor.XS;
    }
    if (window.innerWidth <= ScreenSizeBreakpoint.S) {
        return TilesScreenTransformFactor.S;
    }

    return TilesScreenTransformFactor.M;
};

interface TileContainerProps {
    tiles: Tile[];
}

export const TileContainer = ({ tiles }: TileContainerProps): JSX.Element => {
    const [factor, setFactor] = useState<TransformFactor>(calcFactor());

    useEffect((): (() => void) => {
        const handleResize = (): void => {
            setFactor(calcFactor());
        };

        window.addEventListener("resize", handleResize);

        return (): void => window.removeEventListener("resize", handleResize);
    }, []);

    const sortedTiles = tiles.sort((t1, t2): number => t1.id - t2.id);
    return (
        <div data-tid="TileContainer" className={cn("tileContainer")}>
            <TilesList tiles={sortedTiles} factor={factor} />
        </div>
    );
};
