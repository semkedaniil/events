import { GameStatus } from "../../../types/typers";
import { Button } from "../../../Button/Button";

import cn from "./Result.less";

const DATA = {
    WIN: {
        message: "Поздравляю! Ты победил!",
        buttonText: "Еще раз",
        containerClass: "game-result-win",
    },
    GAME_OVER: {
        message: "Игра окончена!",
        buttonText: "Еще раз",
        containerClass: "game-result-lose",
    },
};

interface ResultProps {
    isWin: boolean;
    onContinue: () => void;
    onRestart: () => void;
    playAfterWin: boolean;
    status: GameStatus;
}

export const Result = ({ isWin, onContinue, onRestart, playAfterWin }: ResultProps): JSX.Element => {
    const { message, buttonText, containerClass } = isWin || playAfterWin ? DATA.WIN : DATA.GAME_OVER;

    return (
        <div className={cn("game-result", containerClass)}>
            <p className={cn("result-message")}>{message}</p>
            <div>
                {isWin && (
                    <Button className={cn("continue-button")} onClick={() => onContinue()}>
                        Continue
                    </Button>
                )}
                <Button onClick={() => onRestart()}>{buttonText}</Button>
            </div>
        </div>
    );
};
