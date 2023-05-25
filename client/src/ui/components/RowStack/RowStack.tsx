import { ReactNode } from "react";
import {Property} from "csstype";

import cn from "./RowStack.less";

interface RowStackProps {
    children: ReactNode;
    className?: string;
    align?: Property.AlignItems;
    justify?: Property.JustifyContent;
}

export const RowStack = ({ children, align, justify, className }: RowStackProps) => (
    <div style={{ alignItems: align, justifyContent: justify }} className={cn("row-stack", className)}>
        {children}
    </div>
);
