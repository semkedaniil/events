import { Sticky } from "@skbkontur/react-ui";
import { CSSProperties, HTMLProps, ReactNode } from "react";

import cn from "./CommonLayout.less";

interface CommonLayoutProps {
    children: ReactNode;
    style?: CSSProperties;
}

export const CommonLayout = ({ children, style }: CommonLayoutProps): JSX.Element => (
    <div style={style} className={cn("common-layout")}>
        {children}
    </div>
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

interface CommonLayoutFooterProps extends HTMLProps<HTMLDivElement> {
    children?: any;
    sticky?: boolean;
    panel?: boolean;
    shadow?: boolean;
}

CommonLayout.Footer = ({ children, sticky, panel, shadow, ...restProps }: CommonLayoutFooterProps) =>
    sticky ? (
        <div>
            {shadow && (
                <Sticky side="bottom" offset={65}>
                    <hr className={cn("footer-border")} />
                </Sticky>
            )}
            <Sticky side="bottom">
                <div className={cn("common-layout-footer", { panel, shadow })} {...restProps}>
                    {children}
                </div>
            </Sticky>
        </div>
    ) : (
        <div className={cn("common-layout-footer", { panel })} {...restProps}>
            {children}
        </div>
    );
