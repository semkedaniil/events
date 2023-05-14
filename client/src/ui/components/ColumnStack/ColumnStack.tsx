import { ReactNode } from "react";

import cn from "./ColumnStack.less";

interface ColumnStackProps {
    children: ReactNode;
    className?: string;
}

export const ColumnStack = ({ children, className }: ColumnStackProps) => (
    <div className={cn("column-stack", className)}>{children}</div>
);
