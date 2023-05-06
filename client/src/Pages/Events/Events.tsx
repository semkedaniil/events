import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";

export const Events = (): JSX.Element => (
    <CommonLayout>
        <CommonLayout.Header>
            <GoBackLink backUrl=".." />
            <h1>Events</h1>
        </CommonLayout.Header>
    </CommonLayout>
);
