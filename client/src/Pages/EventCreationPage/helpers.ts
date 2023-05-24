import { ValidationInfo } from "@skbkontur/react-ui-validations/src/ValidationWrapper";
import { DateRange, Location } from "../../Commons/types/Event";
import { differenceInHours } from "date-fns";

export const getLocationOrDefault = (location: string | null) => {
    if (!location) {
        return null;
    }
    const num = Number(location);
    return isNaN(num) ? null : num;
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

    if (dateRange?.endDate && differenceInHours(dateRange?.endDate, dateRange?.startDate) < 0) {
        validationInfo.dateRangeRight = { message: "Укажите корректный временной промежуток", type: "submit" };
    }

    return validationInfo;
};