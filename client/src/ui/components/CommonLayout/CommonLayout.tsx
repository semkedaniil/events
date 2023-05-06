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

CommonLayout.Header = ({ children, className }: CommonLayoutHeaderProps): JSX.Element => (
    <div className={cn(className, "common-layout-header")}>{children}</div>
);

interface CommonLayoutContentProps {
    children: ReactNode;
    className?: string;
}

CommonLayout.Content = ({ children, className }: CommonLayoutContentProps) => (
  <div className={cn(className, "common-layout-content")}>{children}</div>
);