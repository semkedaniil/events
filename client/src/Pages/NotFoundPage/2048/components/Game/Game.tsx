import { BoardContainer } from "../Board/Components/BoardContainer/BoardContainer";
import { GameHeader } from "../GameHeader/GameHeader";
import { GameRules } from "../GameRules/GameRules";

import cn from "./Game.less";
import { GameProvider } from "./GameProvider";

export const Game = (): JSX.Element => (
    <GameProvider>
        <div className={cn("container")}>
            <div className={cn("game-container")}>
                <GameHeader />
                <BoardContainer />
            </div>
            <GameRules />
        </div>
    </GameProvider>
);
