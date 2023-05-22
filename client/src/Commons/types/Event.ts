export interface Event {
    id: number;
    name: string;
    location: Location;
    dateRange: DateRange<string>;
    creator?: string;
    hidden?: boolean;
    tags?: string[];
    description?: string;
    photos?: string[];
}

export interface Location {
    lat: number;
    lng: number;
}

export interface EventDto {
    name: string;
    location: Location;
    dateRange: DateRange;
    tags?: string[];
    description?: string;
    photos?: File[];
}



export interface DateRange<T = string | Date> {
    startDate: T;
    endDate?: T;
}

export const enum EventType {
    LOCAL = "Локальный",
    GLOBAL = "Глобальный",
}

export interface SearchRequest {
    location?: Location;
    name?: string;
    participantsCount?: number;
    tags?: string[];
    creatorName?: string;
    type?: EventType;
    dateRange?: DateRange;
}