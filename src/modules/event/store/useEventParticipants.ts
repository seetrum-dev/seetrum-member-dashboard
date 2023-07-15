import { EventMember } from "@/types/models/eventMember";
import { create } from "zustand";
import { getEventMemberByEventId } from "../services/eventMemberService";

interface EventParticipantsStoreProps {
  eventId?: string;
  isValid?: boolean;

  participants?: Record<string, EventMember[]>;
  getParticipants: (eventId?: string) => void;
}

export const useEventParticipantsStore = create<EventParticipantsStoreProps>(
  (set, get) => ({
    async getParticipants(eventId) {
      if (!eventId) throw new Error("eventId is required");
      const participants = get().participants;
      const isValid = get().isValid;
      if (isValid && participants && participants[eventId]) return;

      const lastParticipants = await getEventMemberByEventId(eventId);
      set((s) => ({
        eventId,
        isValid: true,
        participants: Object.assign(s.participants || {}, {
          [eventId]: lastParticipants,
        }),
      }));
      return;
    },
  })
);
