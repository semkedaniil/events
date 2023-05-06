import {ValidationInfo} from "@skbkontur/react-ui-validations/src/ValidationWrapper";

import {isValidUsername} from "../Login/helpers";
import {subtractYears} from "../Register/helpers";

export const stringToColor = (str: string): string => {
    let hash = 0;
    let color = "#";
    let index;
    let value;

    if (!str) {
        return `${color}333333`;
    }

    const strLength = str.length;

    for (index = 0; index < strLength; index++) {
        // eslint-disable-next-line no-bitwise
        hash = (str.codePointAt(index) ?? 0) + ((hash << 5) - hash);
    }

    for (index = 0; index < 3; index++) {
        // eslint-disable-next-line no-bitwise
        value = (hash >> (index * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
};

export const getValidationInfo = (username: string | undefined, birthdate: string | null) => {
    const validationInfo: Record<string, ValidationInfo | null> = {
        username: null,
        birthdate: null,
    };

    if (!isValidUsername(username)) {
        validationInfo.username = { message: "Имя должно быть длиннее 3 символов и короче 100", type: "submit" };
    }

    if (!birthdate) {
        validationInfo.birthdate = { message: "Должно быть заполнено", type: "submit" };
    }

    if (birthdate && subtractYears(new Date(), 18) < new Date(birthdate)) {
        validationInfo.birthdate = { message: "Возраст должен быть не меньше 18 лет", type: "submit" };
    }

    return validationInfo;
};
