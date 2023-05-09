export const isDevelopment = process.env.NODE_ENV === "development";

export const pluralize = (count: number, forms: string[]) => {
    const pluralType = count % 10 === 1 && count % 100 !== 11
        ? 0
        : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)
            ? 1
            : 2;
    return forms[pluralType] ?? "";
};

