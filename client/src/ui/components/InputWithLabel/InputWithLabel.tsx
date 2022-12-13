import { Input, InputProps } from "@skbkontur/react-ui";

import cn from "./InputWithLabel.less";

interface InputWithLabelProps extends InputProps {
    label: string;
}

export const InputWithLabel = ({ label, ...restProps }: InputWithLabelProps): JSX.Element => (
    <div className={cn("input-with-label")}>
        <span>{label}</span>
        <Input {...restProps} />
    </div>
);
