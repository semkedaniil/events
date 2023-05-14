import { ReactNode } from "react";

import cn from "./RowStack.less";

interface RowStackProps {
    children: ReactNode;
    className?: string;
    align?: "center" | "right" | "left";
}

export const RowStack = ({ children, align, className }: RowStackProps) => (
    <div style={{ justifyContent: align }} className={cn("row-stack", className)}>
        {children}
    </div>
);
