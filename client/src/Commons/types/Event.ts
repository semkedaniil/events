export interface Event {
    id: number;
    name: string;
    location: Location;
    dateRange: DateRange;
    creator?: string;
    hidden?: boolean;
    tags?: string[];
    description?: string;
    photos?: string[];
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface DateRange {
    startDate: string;
    endDate?: string;
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