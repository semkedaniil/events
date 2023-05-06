import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";

import cn from "./Help.less";

export const Help = (): JSX.Element => (
    <div className={cn("help-page")}>
        <CommonLayout.Header className={cn("header-with-back-url")}>
            <GoBackLink backUrl=".." />
            <h1 className={cn("help-page-header")}>Help</h1>
        </CommonLayout.Header>
        <span>help</span>
    </div>
);
