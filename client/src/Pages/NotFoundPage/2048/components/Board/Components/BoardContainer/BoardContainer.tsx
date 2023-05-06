import { useEffect } from "react";

import { useGameContext } from "../../../Game/hooks";
import { BoardProvider } from "../BoardProvider/BoardProvider";

let startClientX: number | null = null;
let startClientY: number | null = null;

export const BoardContainer = (): JSX.Element => {
    const { dispatch } = useGameContext();

    useEffect(() => {
        function handleTouchStart({ touches }: any): void {
            if (touches.length === 1) {
                const { clientX, clientY } = touches[0];
                startClientX = clientX;
                startClientY = clientY;
            }
        }

        function handleTouchEnd(event: any): void {
            if (!startClientX || !startClientY || event.touches.length > 0) {
                return;
            }

            const endTouch = event.changedTouches[0];
            const endClientX = endTouch.clientX;
            const endClientY = endTouch.clientY;

            const xDiff = startClientX - endClientX;
            const yDiff = startClientY - endClientY;

            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                dispatch({ type: "move", payload: xDiff < 0 ? "right" : "left" });
            } else {
                dispatch({ type: "move", payload: yDiff < 0 ? "down" : "up" });
            }
            startClientX = null;
            startClientY = null;
        }

        const boardContainer = document.querySelector("#boardContainer");
        boardContainer?.addEventListener("touchstart", handleTouchStart);
        boardContainer?.addEventListener("touchend", handleTouchEnd);

        return (): void => {
            boardContainer?.removeEventListener("touchstart", handleTouchStart);
            boardContainer?.removeEventListener("touchend", handleTouchEnd);
        };
    }, [dispatch]);

    return <BoardProvider />;
};
