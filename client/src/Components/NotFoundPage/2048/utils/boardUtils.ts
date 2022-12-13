import { Value, Tile, Direction } from "../components/types/typers";

const INDICES = [0, 1, 2, 3];

export const areTilesEqual = (t1: Nullable<Tile>, t2: Nullable<Tile>): boolean =>
    !t1 && !t2
        ? true
        : Object.keys(t1 || {})?.length === Object.keys(t2 || {})?.length &&
          // @ts-ignore
          Object.keys(t1 || {}).every((p: string): boolean => t1[p] === t2[p]);

export const areEqual = (b1: Tile[], b2: Tile[]): boolean =>
    b1.every((x): boolean => b2.some((y): boolean => areTilesEqual(x, y)));

export const isGameWon = (tiles: Tile[]): boolean => tiles.some((tile): boolean => tile.value === 2048);

const tilesOnSamePosition = (tiles: Tile[]): boolean => {
    const tilesMap: Record<string, boolean> = {};
    for (const tile of tiles) {
        const key = `${tile.positionX}${tile.positionY}`;
        if (tilesMap[key]) {
            return true;
        }
        tilesMap[key] = true;
    }

    return false;
};

export const getRow = (tiles: Tile[], row: number): Array<Tile> => tiles.filter((x): boolean => x.positionX === row);

export const getColumn = (tiles: Tile[], column: number): Array<Tile> => tiles.filter(x => x.positionY === column);

export const getMaxId = (tiles: Tile[]): number => Math.max(0, ...tiles.map(x => x.id));

export const getNextId = (tiles: Tile[]): number => getMaxId(tiles) + 1;

export const isGameOver = (tiles: Tile[]): boolean => {
    if (tiles.length < 16 || tilesOnSamePosition(tiles)) {
        return false;
    }

    const movePossible = (array1: Tile[], array2: Tile[], getCoordinate: (x: Tile) => number): boolean =>
        array1.some(x => array2.some(y => getCoordinate(x) === getCoordinate(y) && x.value === y.value));

    for (let index = 0; index < 3; index++) {
        if (
            movePossible(getRow(tiles, index), getRow(tiles, index + 1), x => x.positionY) ||
            movePossible(getColumn(tiles, index), getColumn(tiles, index + 1), x => x.positionX)
        ) {
            return false;
        }
    }

    return true;
};

export const merge = (tiles: Tile[]): Tile[] => {
    let id = getNextId(tiles);
    const values: Record<string, Tile> = {};

    for (const tile of tiles) {
        const key = `${tile.positionX}${tile.positionY}`;
        if (values[key]) {
            const value = (tile.value * 2) as Value;
            values[key] = { ...tile, id: id++, value, type: "merged" };
        } else {
            values[key] = tile;
        }
    }

    return Object.values(values);
};

const shift = (
    line: Tile[],
    getColumn: (v: Tile) => number,
    setColumn: (v: Tile, position: number) => void,
    direction: Direction
): Tile[] => {
    if (line.length === 0) {
        return [];
    }
    const result: Tile[] = JSON.parse(JSON.stringify(line));
    result.sort((v1, v2) => getColumn(v1) - getColumn(v2));

    const startPosition = direction === "left" ? 0 : 4 - result.length;
    for (const [index, element] of result.entries()) {
        setColumn(element, startPosition + index);
    }

    if (direction === "left") {
        result.reverse();
    }
    let index = result.length - 1;
    while (index >= 1) {
        if (result[index].value === result[index - 1].value && result[index].value !== 2048) {
            for (let otherIndex = 0; otherIndex <= index - 1; otherIndex++) {
                const shift = direction === "right" ? 1 : -1;
                setColumn(result[otherIndex], getColumn(result[otherIndex]) + shift);
            }
            index -= 2;
            continue;
        }

        index--;
    }

    return result;
};

const shiftHorizontally = (line: Tile[], direction: Direction): Tile[] =>
    shift(
        line,
        (v: Tile): number => v.positionY,
        (v: Tile, position: number): number => (v.positionY = position),
        direction
    );

const shiftVertically = (line: Tile[], direction: Direction): Tile[] =>
    shift(
        line,
        (v: Tile): number => v.positionX,
        (v: Tile, position: number): number => (v.positionX = position),
        direction
    );

export const moveRight = (tiles: Tile[]): Tile[] =>
    INDICES.flatMap((index): Tile[] => shiftHorizontally(getRow(tiles, index), "right"));

export const moveLeft = (tiles: Tile[]): Tile[] =>
    INDICES.flatMap((index): Tile[] => shiftHorizontally(getRow(tiles, index), "left"));

export const moveUp = (tiles: Tile[]): Tile[] =>
    INDICES.flatMap((index): Tile[] => shiftVertically(getColumn(tiles, index), "left"));

export const moveDown = (tiles: Tile[]): Tile[] =>
    INDICES.flatMap((index): Tile[] => shiftVertically(getColumn(tiles, index), "right"));

const isExists = (tiles: Tile[], positionX: number, positionY: number): boolean =>
    tiles.some(x => x.positionX === positionX && x.positionY === positionY);

export const createRandomTile = (tiles: Tile[]): Tile => {
    const getCoordinates = (position: number): [number, number] => {
        const x = Math.floor(position / 4);
        const y = position % 4;
        return [x, y];
    };

    Math.floor(Math.random() * 16);

    let position = Math.floor(Math.random() * 16);
    let coordinates = getCoordinates(position);
    while (isExists(tiles, ...coordinates)) {
        position = position === 15 ? 0 : position + 1;
        coordinates = getCoordinates(position);
    }

    const value: Value = Math.random() <= 0.2 ? 4 : 2;

    return {
        id: getNextId(tiles),
        value,
        type: "new",
        positionX: coordinates[0],
        positionY: coordinates[1],
    };
};

export const generateBoard = (tilesCount = 2): Tile[] => {
    let currentTilesCount = tilesCount;
    const tiles: Tile[] = [];
    while (currentTilesCount > 0) {
        tiles.push(createRandomTile(tiles));
        currentTilesCount--;
    }

    return tiles;
};

export const MOVES_MAP: Record<string, Function> = {
    up: moveUp,
    down: moveDown,
    right: moveRight,
    left: moveLeft,
};
