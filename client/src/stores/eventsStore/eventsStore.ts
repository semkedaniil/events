import { create } from "zustand";
import { persist } from "zustand/middleware";
import _ from "lodash";
import { Event, FilterRequest } from "../../Commons/types/Event";

interface EventsStore {
    events: Event[];
}

interface Actions {
    setEvents: (event: Event[]) => void;
    addEvents: (event: Event[]) => void;
    removeEvent: (eventId: number) => void;
    hideEvent: (eventId: number) => void;
    showEvent: (eventId: number) => void;
    filterEvents: (params: FilterRequest) => void;
}

type EventsStoreState = EventsStore & Actions;

const defaultUserState = {
    events: [],
};

export const useEventsStore = create<EventsStoreState>()(
    persist(
        (set, get) => ({
            ...defaultUserState,
            setEvents: events => set(() => ({ events })),
            addEvents: events => {
                const { events: currentEvents } = get();
                const newEvents = mergeArrays(currentEvents, events);
                return set(() => ({ events: newEvents }));
            },
            removeEvent: eventsId => {
                set(() => ({ events: _.remove(get().events, { id: eventsId }) }));
            },
            hideEvent(eventId) {
                const event = get().events.find(x => x.id === eventId);
                if (event) {
                    event.hidden = true;
                }
            },
            showEvent(eventId) {
                const event = get().events.find(x => x.id === eventId);
                if (event) {
                    event.hidden = false;
                }
            },
            filterEvents: params => {
                // some logic
            },
        }),
        { name: "global" }
    )
);

function mergeArrays(original: Event[], updated: Event[]): Event[] {
    return _.unionBy(updated, original, "id");
}
