import { ValidationInfo } from "@skbkontur/react-ui-validations/src/ValidationWrapper";
import { differenceInHours } from "date-fns";

import { DateRange, Location } from "../../Commons/types/Event";

export const getLocationOrDefault = (location: string | null) => {
    if (!location) {
        return null;
    }
    const number = Number(location);
    return isNaN(number) ? null : number;
};

export const getValidationInfo = (
    name: string,
    location: DeepNullable<Location>,
    dateRange: DateRange<Date> | null
) => {
    const validationInfo: Record<string, ValidationInfo | null> = {
        name: null,
        location: null,
        dateRange: null,
    };

    if (name.trim() === "") {
        validationInfo.name = { message: "Название события должно быть непустым", type: "submit" };
    }

    if (
        !location?.latitude ||
        !location?.longitude ||
        location.latitude > 90 ||
        location.latitude < -90 ||
        location.longitude > 180 ||
        location.longitude < -180
    ) {
        validationInfo.location = { message: "Введите корректные координаты", type: "submit" };
    }

    if (!dateRange || (!dateRange?.startDate && dateRange?.endDate)) {
        validationInfo.dateRangeLeft = { message: "Укажите дату начала события", type: "submit" };
    }

    if (dateRange?.endDate && differenceInHours(new Date(dateRange?.endDate), new Date(dateRange?.startDate)) < 0) {
        validationInfo.dateRangeRight = { message: "Укажите корректный временной промежуток", type: "submit" };
    }

    return validationInfo;
};
