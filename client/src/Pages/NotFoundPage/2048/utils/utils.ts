import { REGEX_MAP } from "../constants/regex";

export const isMobile = (value: string): boolean =>
    REGEX_MAP.mobileDevice.test(value) || REGEX_MAP.mobileDeviceExtend.test(value.slice(0, 4));
