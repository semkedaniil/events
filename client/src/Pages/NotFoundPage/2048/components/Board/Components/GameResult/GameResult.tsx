import { useGameContext } from "../../../Game/hooks";
import { Tile } from "../../../types/typers";
import { Result } from "../Result/Result";

export const GameResultContainer = (props: { tiles: Tile[] }): JSX.Element => {
    const {
        gameState: { status },
        dispatch,
    } = useGameContext();

    const handleContinue = (): void => {
        dispatch({ type: "continue" });
    };

    const handleRestart = (): void => {
        dispatch({ type: "restart" });
    };

    const playAfterWin = props.tiles.some(x => x.value === 2048);

    return (
        <>
            {status !== "IN_PROGRESS" && status !== "PLAY_AFTER_WIN" && (
                <Result
                    isWin={status === "WIN"}
                    playAfterWin={playAfterWin}
                    onRestart={handleRestart}
                    onContinue={handleContinue}
                    status={status}
                />
            )}
        </>
    );
};
