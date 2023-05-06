import { ReactNode } from "react";

import cn from "./ColumnStack.less";

interface ColumnStackProps {
    children: ReactNode;
}

export const ColumnStack = ({ children }: ColumnStackProps) => <div className={cn("column-stack")}>{children}</div>;
