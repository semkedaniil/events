import { Link } from "react-router-dom";
import { ReactNode } from "react";

import cn from "./RouterLink.less";

interface RouterLinkProps {
    to: string;
    children?: ReactNode;
    className?: string;
}

export function RouterLink({ to, children, className }: RouterLinkProps): JSX.Element {
    return (
        <Link className={cn(className, "router-link")} to={to}>
            {children}
        </Link>
    );
}
