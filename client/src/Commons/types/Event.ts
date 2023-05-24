export interface Event {
    id: number;
    name: string;
    location: Location;
    dateRange: DateRange<Date>;
    creator?: string;
    hidden?: boolean;
    marks: Marks,
    tags?: string[];
    description?: string;
    photos?: string[];
}

export interface Marks {
    likes: number;
    dislikes: number;
}

export interface Location {
    latitude: number;
    longitude: number;
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