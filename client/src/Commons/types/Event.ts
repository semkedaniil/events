export interface Event {
    id: number;
    name: string;
    creator?: string;
    location: Location;
    dateRange: DateRange;
    hidden?: boolean;
    tags?: string[];
    description?: string;
    photos?: File[];
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface DateRange {
    startDate: Date;
    endDate?: Date;
}

export interface FilterRequest {

}