import { ReactNode, MouseEvent } from "react";

import cn from "./Button.less";

interface ButtonProps {
    id?: string;
    children: ReactNode;
    className?: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const Button = ({ id, children, className, onClick }: ButtonProps): JSX.Element => (
    <button id={id} className={cn("button", className)} onClick={onClick}>
        {children}
    </button>
);
