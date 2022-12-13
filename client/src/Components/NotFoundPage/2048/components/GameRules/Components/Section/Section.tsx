import { ReactNode } from "react";

interface SectionProps {
    id?: string;
    title: string;
    children: ReactNode;
    bottomSeparator?: boolean;
}

export const Section = ({ bottomSeparator, children, id, title }: SectionProps): JSX.Element => (
    <div id={id}>
        <h4>{title}</h4>
        {children}
        {bottomSeparator ? <hr /> : null}
    </div>
);
