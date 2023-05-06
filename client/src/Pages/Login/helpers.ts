export const isValidUsername = (username: string | undefined): boolean =>
    !!username && username.length >= 3 && username.length <= 100;
