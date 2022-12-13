import { Button } from "../Button/Button";
import { useGameContext } from "../Game/hooks";
import { ScoresContainer } from "../ScoresContainer/ScoresContainer";

import cn from "./GameHeader.less";

export const GameHeader = (): JSX.Element => {
    const { dispatch } = useGameContext();

    return (
        <div className={cn("game-header")}>
            <div className={cn("game-intro")}>
                <span className={cn("game-title")}>2048</span>
                <p>
                    Наберите <b>2048</b> очков!
                </p>
            </div>
            <div className={cn("actions")}>
                <ScoresContainer />
                <Button
                    className={cn("restart-button")}
                    id="restartGameBtn"
                    onClick={_ => dispatch({ type: "restart" })}
                >
                    Новая игра
                </Button>
            </div>
        </div>
    );
};
