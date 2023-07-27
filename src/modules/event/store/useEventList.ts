import {
  CreateScheduledEventModel,
  ScheduledEvent,
} from "@/types/models/scheduledEvent";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createEvent, getAllScheduledEvents } from "../services/eventService";

interface EventListStore {
  events?: ScheduledEvent[];
  getEvents: () => Promise<ScheduledEvent[]>;

  sortEvents: (orderBy: keyof ScheduledEvent, sortBy: "asc" | "desc") => void;
  createEvent: (event: CreateScheduledEventModel) => Promise<ScheduledEvent>;
  isValid: boolean;
  loading: boolean;
  setValidStatus: (val: boolean) => void;
}

export const useEventsList = create(
  devtools<EventListStore>((set, get) => ({
    isValid: false,
    loading: true,
    getEvents: async () => {
      set({ loading: true });
      if (get().events && get().isValid) {
        set({ loading: false });
        return get().events!;
      }

      const events = await getAllScheduledEvents();
      set({ events, isValid: true, loading: false });
      return events;
    },
    async sortEvents(orderBy, sortBy) {
      const eventsList = get().events;
      if (!eventsList || !get().isValid) {
        const evs = await get().getEvents();
        return set({ events: sortData(evs, orderBy, sortBy) });
      }

      return set({ events: sortData(eventsList, orderBy, sortBy) });
    },
    async createEvent(event) {
      const newEvent = await createEvent({
        title: event.title!,
        organizer: event.organizer!,
        venue: event.venue!,
        scheduleDateTime: event.scheduleDateTime!,
        scheduleEndDateTime: event.scheduleEndDateTime!,
      });
      set((s) => {
        if (s.events)
          return {
            events: [...s.events, newEvent],
            isValid: false,
            loading: false,
          };
        else return s;
      });
      return newEvent;
    },
    setValidStatus(val) {
      set({ isValid: val });
    },
  }))
);

function sortData<T>(
  data: T[],
  orderBy: keyof T,
  sort: "asc" | "desc",
  sortFn?: (datum: T) => any
): T[] {
  const sortedData = [...data];

  const compareFn = (a: T, b: T): number => {
    const valueA = sortFn ? sortFn(a) : a[orderBy];
    const valueB = sortFn ? sortFn(b) : b[orderBy];

    if (valueA < valueB) {
      return sort === "asc" ? -1 : 1;
    } else if (valueA > valueB) {
      return sort === "asc" ? 1 : -1;
    } else {
      return 0;
    }
  };

  sortedData.sort(compareFn);

  return sortedData;
}
