import { ReactNode } from "react";

import cn from "./RowStack.less";

interface RowStackProps {
    children: ReactNode;
    className?: string;
    align?: "center" | "right" | "left";
    justify?: "center" | "right" | "left";
}

export const RowStack = ({ children, align, justify, className }: RowStackProps) => (
    <div style={{ alignItems: align, justifyContent: justify }} className={cn("row-stack", className)}>
        {children}
    </div>
);
