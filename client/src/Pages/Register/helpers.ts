import { ValidationInfo } from "@skbkontur/react-ui-validations/src/ValidationWrapper";

import { isValidUsername } from "../Login/helpers";

export const subtractYears = (date: Date, years: number): Date => {
    const dateCopy = new Date(date);
    dateCopy.setFullYear(date.getFullYear() - years);

    return dateCopy;
};

export const isValidEmail = (mail: string): boolean => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail);
const isValidPassword = (password: string): boolean =>
    /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*\d))|((?=.*[A-Z])(?=.*\d)))(?=.{6,})/.test(password);
export const getRegistrationValidationInfo = (
    username: string,
    email: string,
    password: string,
    repeatedPassword: string,
    birthdate: string | null
): Record<string, ValidationInfo | null> => {
    const validationInfo: Record<string, ValidationInfo | null> = {
        username: null,
        email: null,
        password: null,
        repeatedPassword: null,
        birthdate: null,
    };

    if (!isValidUsername(username)) {
        validationInfo.username = { message: "Имя должно быть длиннее 3 символов и короче 100", type: "submit" };
    }

    if (!isValidEmail(email)) {
        validationInfo.email = { message: "Введите корректный email", type: "submit" };
    }

    if (!isValidPassword(password)) {
        validationInfo.password = {
            message: "Пароль должен содержать как минимум 6 символов, иметь хотя бы одну букву и одну цифру",
            type: "submit",
        };
    }

    if (password !== repeatedPassword) {
        validationInfo.repeatedPassword = {
            message: "Пароли не совпадают",
            type: "submit",
        };
    }

    if (!birthdate) {
        validationInfo.birthdate = { message: "Должно быть заполнено", type: "submit" };
    }

    if (birthdate && subtractYears(new Date(), 18) < new Date(birthdate)) {
        validationInfo.birthdate = { message: "Возраст должен быть не меньше 18 лет", type: "submit" };
    }
    return validationInfo;
};
