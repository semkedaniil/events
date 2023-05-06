import cn from "../../Board.less";

const fourCells = [...Array.from({ length: 4 }).keys()];

export const BoardGrid = (): JSX.Element => {
    const grid = fourCells.map((rowId): JSX.Element => {
        const columns = fourCells.map((colId): JSX.Element => <div key={colId} className={cn("cell")}></div>);
        return (
            <div key={rowId} className={cn("row")}>
                {columns}
            </div>
        );
    });

    return <div className={cn("grid-container")}>{grid}</div>;
};
