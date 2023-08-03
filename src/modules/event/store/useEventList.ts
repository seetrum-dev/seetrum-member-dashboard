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
  checkValidity(): boolean;
  loading: boolean;
  expiredAt: number;
  setValidStatus: (val: boolean) => void;
}

export const useEventsList = create(
  devtools<EventListStore>((set, get) => ({
    checkValidity: () => {
      const now = Date.now();
      const { events, expiredAt } = get();
      return events !== undefined && now < expiredAt;
    },
    isValid: false,
    expiredAt: 0,
    loading: true,
    getEvents: async () => {
      set({ loading: true });
      if (get().checkValidity()) {
        set({ loading: false });
        return get().events!;
      }

      const events = await getAllScheduledEvents();
      // expired in 5 minutes
      const expiredAt = Date.now() + 5 * 60 * 1000;
      set({ events, loading: false, expiredAt });
      return events;
    },
    async sortEvents(orderBy, sortBy) {
      const eventsList = get().events;
      if (!eventsList || !get().checkValidity()) {
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
            loading: false,
          };
        else return s;
      });
      return newEvent;
    },
    setValidStatus(val) {
      if (!val) {
        set({ expiredAt: Date.now() });
      }
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
