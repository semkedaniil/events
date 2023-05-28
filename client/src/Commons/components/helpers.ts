import { addMinutes, format, isBefore, isMatch, isSameDay, isSameMinute, isValid, parse } from "date-fns";
import { parseISO } from "date-fns/fp";
import { ru } from "date-fns/locale";

import { DateRange } from "../types/Event";

const datePickerFormat = "dd.MM.yyyy";

export function formatDate(date: Date | string, dateFormat: string): string {
    const copiedDate = new Date(date);
    return format(copiedDate, dateFormat, {
        locale: ru,
    });
}

export function isValidISODate(date: Nullable<string | Date>): date is Date {
    if (!date) {
        return false;
    }
    if (date instanceof Date) {
        return isValid(date);
    }
    return isValid(parseISO(date));
}

export function isValidDate(date: Nullable<string | Date>): date is string | Date {
    return !!date && isValid(new Date(date));
}

export function isCorrectTimeRange(timeRange: DateRange): boolean {
    const start = timeRange.startDate ? new Date(timeRange.startDate) : null;
    const end = timeRange.endDate ? new Date(timeRange.endDate) : null;
    if (start && end) {
        return isBefore(start, end);
    }
    return true;
}

export function isCorrectTime(time: string): boolean {
    return /^([01]?\d|2[0-3]):[0-5]\d$/.test(time);
}

export function isSameDates(oldDate: Nullable<Date>, newDate: Nullable<Date>): boolean {
    return (oldDate && newDate && isSameDay(oldDate, newDate)) || oldDate === newDate;
}
export function isSameDateWithTime(oldDate: Nullable<Date>, newDate: Nullable<Date>): boolean {
    return (oldDate && newDate && isSameMinute(oldDate, newDate)) || oldDate === newDate;
}

export function isLessThan(firstDate: Date, secondDate: Date): boolean {
    return firstDate < secondDate && !isSameDates(firstDate, secondDate);
}

export function parseDate(date: string, formatString?: string): Date {
    return parse(date, formatString ?? datePickerFormat, new Date());
}

export function toTimeZone(date: Date | string): Date {
    const dateDate = new Date(date);
    return addMinutes(dateDate, dateDate.getTimezoneOffset());
}

export function fromDateOrISOString(value: Nullable<Date | string>): Nullable<Date> {
    return typeof value === "string" ? new Date(value) : value;
}

export function endOfGivenTime(source: string): Date {
    const formatToAdditionalTime = [
        { format: "yyyy-MM-dd", timeToAdd: "T23:59:59" },
        { format: "yyyy-MM-dd'T'HH", timeToAdd: ":59:59" },
        { format: "yyyy-MM-dd'T'HH:mm", timeToAdd: ":59" },
    ];
    const matching = formatToAdditionalTime.find(x => isMatch(source, x.format));
    return matching ? new Date(`${source}${matching.timeToAdd}`) : new Date(source);
}

export function startOfGivenTime(source: string): Date {
    const formatToAdditionalTime = [
        { format: "yyyy-MM-dd", timeToAdd: "T00:00:00" },
        { format: "yyyy-MM-dd'T'HH", timeToAdd: ":00:00" },
        { format: "yyyy-MM-dd'T'HH:mm", timeToAdd: ":00" },
    ];
    const matching = formatToAdditionalTime.find(x => isMatch(source, x.format));
    return matching ? new Date(`${source}${matching.timeToAdd}`) : new Date(source);
}
