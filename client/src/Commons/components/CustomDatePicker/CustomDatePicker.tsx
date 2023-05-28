import { DatePicker as DefaultDatePicker } from "@skbkontur/react-ui";
import { forwardRef, ReactText } from "react";

import { formatDate, parseDate } from "../helpers";
import { Time } from "../TimePicker";

const DatePickerDefaultProps = {
    width: 120,
    minDate: "01.01.1900",
    maxDate: "31.12.2099",
    isHoliday: (_day: string, isWeekend: boolean): boolean => isWeekend,
};

export interface DatePickerProps {
    value: Nullable<Date>;
    onChange: (value: Nullable<Date>) => void;
    width?: string | number;
    minDate?: Date | string;
    maxDate?: Date | string;
    isHoliday?: (day: string, isWeekend: boolean) => boolean;
    defaultTime?: Time;
    disabled?: boolean;
    error?: boolean;
    size?: "small" | "medium" | "large";
    warning?: boolean;
    onBlur?: () => void;
    menuAlign?: "left" | "right";
}

function convertStringToDate(newStringifiedDate: string, defaultTime?: Time): Date {
    const date = parseDate(newStringifiedDate);
    const ISODate = formatDate(date, "yyyy-MM-dd");
    const time = defaultTime || "00:00";
    return new Date(`${ISODate}T${time}`);
}

function convertDateToStringWithTimezone(date: Nullable<Date | string>): string {
    return date ? formatDate(date, "dd.MM.yyyy") : "";
}

export const DatePicker = forwardRef<DefaultDatePicker, DatePickerProps>((props, forwardedReference) => {
    const {
        value,
        onChange,
        defaultTime,
        maxDate = DatePickerDefaultProps.maxDate,
        minDate = DatePickerDefaultProps.minDate,
    } = props;

    const maxDateValue = getDate(maxDate);

    const handleChange = (newStringifiedDate: string): void => {
        if (isNullOrWhitespace(newStringifiedDate)) {
            onChange(null);
            return;
        }

        const maxAllowedDateString =
            maxDateValue > parseDate(DatePickerDefaultProps.maxDate)
                ? convertDateToStringWithTimezone(maxDateValue)
                : DatePickerDefaultProps.maxDate;
        if (!DefaultDatePicker.validate(newStringifiedDate, { maxDate: maxAllowedDateString })) {
            return;
        }

        const newDate = convertStringToDate(newStringifiedDate, defaultTime);
        onChange(newDate);
    };

    return (
        <DefaultDatePicker
            {...DatePickerDefaultProps}
            {...props}
            maxDate={convertDateToStringWithTimezone(maxDateValue)}
            minDate={convertDateToStringWithTimezone(getDate(minDate))}
            ref={forwardedReference}
            value={convertDateToStringWithTimezone(value)}
            onValueChange={handleChange}
        />
    );
});

function getDate(x: string | Date): Date {
    return typeof x === "string" ? parseDate(x) : x;
}

function isNullOrWhitespace(value: Nullable<string>): value is null | undefined | "" {
    return !value || value.trim() === "";
}
