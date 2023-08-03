import { getOpportunityMemberByMemberId } from "@/modules/trainings/services/opportunityMemberService";
import { TrainingMember } from "@/types/models/trainingMember";
import { create } from "zustand";

interface OpportunitiesMemberStore {
  opportunitiesMember?: TrainingMember[];
  getOpportunitiesMember: (userId: string) => Promise<void>;

  expiredAt?: Date;
  loading: boolean;
  error?: any;
  userId?: string;
}

const cacheTime = 10 * 60; // 10 minutes in seconds

export const useOpportunitiesMember = create<OpportunitiesMemberStore>(
  (set, get) => ({
    loading: false,
    async getOpportunitiesMember(userId) {
      const expiredAt = get().expiredAt;
      const today = new Date(Date.now());
      const isExpired = expiredAt === undefined || expiredAt < today;
      if (!isExpired && userId === get().userId) {
        console.info("cache hit");
        return;
      }

      try {
        console.info("cache missed");
        set({ loading: true });
        const opportunitiesMember = await getOpportunityMemberByMemberId(
          userId
        );
        const expiredTime = today;
        expiredTime.setSeconds(cacheTime);
        set({
          loading: false,
          expiredAt: expiredTime,
          error: undefined,
          opportunitiesMember,
          userId,
        });
      } catch (error) {
        console.error(error);
        set({
          loading: false,
          error: error,
          opportunitiesMember: get().opportunitiesMember,
        });
      }
    },
  })
);
