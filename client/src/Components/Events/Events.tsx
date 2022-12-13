import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { CommonLayout, CommonLayoutHeader } from "../../ui/components/CommonLayout/CommonLayout";

export const Events = (): JSX.Element => (
    <CommonLayout>
        <CommonLayoutHeader>
            <GoBackLink backUrl=".." />
            <h1>Events</h1>
        </CommonLayoutHeader>
    </CommonLayout>
);
