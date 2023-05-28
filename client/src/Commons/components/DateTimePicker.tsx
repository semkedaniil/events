import { DatePicker as DefaultPicker } from "@skbkontur/react-ui";
import { forwardRef, SyntheticEvent, useEffect, useMemo, useState } from "react";

import { RowStack } from "../../ui/components/RowStack/RowStack";

import { DatePicker, DatePickerProps } from "./CustomDatePicker/CustomDatePicker";
import { Time, TimePicker } from "./TimePicker";
import { formatDate } from "./helpers";

const datePickerDefaultProps = {
    width: 120,
    minDate: "01.01.1900",
    maxDate: "31.12.2099",
    isHoliday: (_day: string, isWeekend: boolean): boolean => isWeekend,
};

interface DateTimePickerProps extends DatePickerProps {
    defaultTime: Time;
    timeError?: boolean;
}

export const DateTimePicker = forwardRef<DefaultPicker, DateTimePickerProps>((props, forwardedRef) => {
    const { error, timeError, defaultTime, disabled, size, onChange, warning, value: initialValue, ...rest } = props;
    const [value, setValue] = useState<Nullable<Date>>(initialValue);
    const [time, setTime] = useState<Nullable<string>>(null);
    useEffect(() => {
        const time = value ? formatDate(value, "HH:mm") : defaultTime;
        setTime(time);
    }, [value]);

    const onDateChange = (value: Nullable<Date>) => {
        setValue(value);
        onChange(value);
    };

    return (
        <RowStack>
            <span>
                <DatePicker
                    {...datePickerDefaultProps}
                    {...rest}
                    ref={forwardedRef}
                    data-tid="Date"
                    value={value}
                    onChange={onDateChange}
                    error={error}
                    disabled={disabled}
                    warning={warning}
                    size={size}
                />
            </span>
            <span>
                <TimePicker
                    size={size}
                    data-tid="Time"
                    value={time === defaultTime ? null : time}
                    error={timeError || error}
                    warning={warning}
                    defaultTime={defaultTime}
                    disabled={disabled || !value}
                    onChange={handleTimeChange}
                />
            </span>
        </RowStack>
    );

    function handleTimeChange(event: SyntheticEvent<any>, newTime: Time): void {
        if (!value) {
            return;
        }
        const date = formatDate(value, "yyyy-MM-dd");
        const newDateTime = new Date(`${date}T${newTime}`);
        onChange(newDateTime);
    }
});
