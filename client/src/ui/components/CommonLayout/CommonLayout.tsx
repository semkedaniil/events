import { ReactNode } from "react";

import cn from "./CommonLayout.less";

interface CommonLayoutProps {
    children: ReactNode;
}

export const CommonLayout = ({ children }: CommonLayoutProps): JSX.Element => (
    <div className={cn("common-layout")}>{children}</div>
);

interface CommonLayoutHeaderProps {
    children: ReactNode;
    className?: string;
}
export const CommonLayoutHeader = ({ children, className }: CommonLayoutHeaderProps): JSX.Element => (
    <div className={cn(className, "common-layout-header")}>{children}</div>
);
