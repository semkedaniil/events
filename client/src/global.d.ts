declare module "*.png" {
    const value: any;
    export = value;
}

declare module "*.svg" {
    const value: any;
    export = value;
}

declare module "*.jpg" {
    const value: any;
    export = value;
}

declare type Nullable<T> = null | undefined | T;
declare type DeepNullable<T> = null | undefined | T | { [K in keyof T]: DeepNullable<T[K]> | null };
