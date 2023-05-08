import { ReactNode } from "react";

import cn from "./RowStack.less";

interface RowStackProps {
    children: ReactNode;
    align?: "center" | "right" | "left";
}

export const RowStack = ({ children, align }: RowStackProps) => (
    <div style={{ justifyContent: align }} className={cn("row-stack")}>
        {children}
    </div>
);
