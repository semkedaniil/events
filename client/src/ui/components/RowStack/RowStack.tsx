import { ReactNode } from "react";

import cn from "./RowStack.less";

interface RowStackProps {
    children: ReactNode;
}

export const RowStack = ({ children }: RowStackProps) => <div className={cn("row-stack")}>{children}</div>;
