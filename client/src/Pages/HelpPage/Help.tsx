import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";

import cn from "./Help.less";

export const Help = (): JSX.Element => (
    <div className={cn("help-page")}>
        <CommonLayout.Header className={cn("header-with-back-url")}>
            <GoBackLink backUrl=".." />
            <h1 className={cn("help-page-header")}>Помощь</h1>
        </CommonLayout.Header>
        <CommonLayout.Content>
            <div className={cn("text")}>
                Данное приложение создано для добавления и просмотра событий, включая систему
                комментариев, редактирование аккаунта, поиск, добавление фотографий, систему администрирования, историю
                событий в аккаунте, систему ссылок и оповещения. Функции включают просмотр, редактирование и ссылки на
                события, аутентификацию, создание и редактирование аккаунта, поиск, историю
                событий.
            </div>
        </CommonLayout.Content>
    </div>
);
