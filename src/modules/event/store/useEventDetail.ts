import { ScheduledEvent } from "@/types/models/scheduledEvent";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getScheduledEventById } from "../services/eventService";

interface EventDetailStore {
  eventId?: string;
  event?: ScheduledEvent;
  getEvent: (id: string) => Promise<ScheduledEvent | undefined>;
  revalidate: () => Promise<void>;
  isValid: boolean;
  loading: boolean;
}

export const useEventDetail = create(
  devtools<EventDetailStore>((set, get) => ({
    loading: true,
    isValid: false,
    async getEvent(id) {
      set({ loading: true });
      const eventId = get().eventId;
      const event = get().event;
      if (event && eventId && eventId === id && get().isValid) {
        set({ loading: false });
        return event;
      }
      const updatedEvent = await getScheduledEventById(id);
      set({
        eventId: updatedEvent.id,
        event: updatedEvent,
        loading: false,
        isValid: true,
      });
      return updatedEvent;
    },
    async revalidate() {
      if (!get().eventId) return;
      const updatedEvent = await getScheduledEventById(get().eventId!);
      set({
        eventId: updatedEvent.id,
        event: updatedEvent,
        loading: false,
        isValid: true,
      });
    },
  }))
);
