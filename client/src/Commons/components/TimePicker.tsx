import { FC, SyntheticEvent, useEffect, useState } from "react";
import { tooltip, ValidationInfo, ValidationWrapper } from "@skbkontur/react-ui-validations";
import { isCorrectTime } from "../utlis";
import { Input } from "@skbkontur/react-ui";

export type Time = string;

interface TimePickerProps {
    error?: boolean;
    value: Nullable<Time>;
    defaultTime: Time;
    disabled?: boolean;
    onChange: (event: SyntheticEvent<any>, value: Time) => void;
    warning?: boolean;
    date?: Nullable<Date>;
    size?: "small" | "medium" | "large";
}

export const TimePickerErrorMessage = (): JSX.Element => (
    <>
        <span>Время неверно.</span>
        <br />
        <span>Проверьте часы и минуты.</span>
    </>
);

export const timeValidate = (
    timeValue: Nullable<Time>,
    isFocused: boolean,
    date?: Nullable<Date>,
    error?: boolean
): Nullable<ValidationInfo> => {
    if (date === null) {
        return null;
    }

    if (error) {
        return { type: "submit", message: <TimePickerErrorMessage /> };
    }

    if (isCorrectTime(timeValue ?? "") || timeValue === "") {
        return null;
    } else {
        if (!isFocused) {
            return { type: "immediate", message: <TimePickerErrorMessage /> };
        }
        return { type: "lostfocus", message: <TimePickerErrorMessage /> };
    }
};

export const TimePicker: FC<TimePickerProps> = ({
    onChange,
    value,
    size,
    disabled,
    defaultTime,
    warning,
    error,
    date,
}): JSX.Element => {
    const [time, setTime] = useState<string>(value ?? "");
    const [isFocused, setIsFocused] = useState<boolean>(false);
    useEffect(() => {
        setTime(value ?? defaultTime ?? "");
    }, [value]);

    const handleChange = (newValue: Time): void => {
        setTime(newValue);
    };

    const handleBlur = (event: SyntheticEvent<any>): void => {
        setIsFocused(false);
        const timeOrDefault = time === "" ? defaultTime : time;
        if (isCorrectTime(timeOrDefault)) {
            onChange(event, timeOrDefault);
        }
    };

    const handleFocus = (): void => {
        setIsFocused(true);
    };

    return (
        <ValidationWrapper
            validationInfo={timeValidate(time, isFocused, date, error)}
            renderMessage={tooltip("top left")}>
            <Input
                data-tid="Input"
                mask="99:99"
                value={time}
                size={size}
                width={64}
                error={error}
                placeholder={disabled ? undefined : defaultTime}
                onValueChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                warning={warning}
                disabled={disabled}
            />
        </ValidationWrapper>
    );
};
