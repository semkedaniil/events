import { useLocation } from "react-router-dom";
import { Button } from "@skbkontur/react-ui";
import { useState } from "react";

import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";

import { Game } from "./2048/components/Game/Game";
import cn from "./NotFoundPage.less";

export const NotFoundPage = (): JSX.Element => {
    const { pathname } = useLocation();
    const [showGame, setShowGame] = useState(false);
    return (
        <CommonLayout>
            <CommonLayout.Header>
                <GoBackLink backUrl=".." />
                <h1 className={cn("not-found-page-header")}>Вернуться на главную</h1>
            </CommonLayout.Header>
            <div className={cn("not-found-page")}>
                <p className={cn("not-found-page-title")}>
                    Запрашиваемая страница с URL <b>{pathname}</b> не найдена на этом сервере, но не расстраивайтесь,
                    можете сыграть в игру 2048!
                </p>
                {!showGame && (
                    <Button
                        use="primary"
                        className={cn("not-found-page-button")}
                        size="large"
                        onClick={(): void => setShowGame(true)}
                    >
                        Играть!
                    </Button>
                )}
                {showGame && <Game />}
            </div>
        </CommonLayout>
    );
};
