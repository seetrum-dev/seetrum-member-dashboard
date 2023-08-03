import { getAllOpportunities } from "@/modules/trainings/services/opportunityService";
import { sortTraining } from "@/modules/trainings/store/useTrainings";
import { Training } from "@/types/models/training";
import { create } from "zustand";

interface OpportunitiesStore {
  opportunities?: Training[];
  getOpportunities: () => Promise<void>;
  setOpportunitiesSort: (sortBy: number, orderBy: number) => void;

  expiredAt?: Date;
  loading?: boolean;
  error?: any;

  sortBy: number;
  orderBy: number;
}

const cacheTime = 10 * 60; // 10 minutes in seconds

export const useOpportunities = create<OpportunitiesStore>((set, get) => ({
  sortBy: 0,
  orderBy: 1,
  async getOpportunities() {
    const expiredAt = get().expiredAt;
    const today = new Date(Date.now());
    const isExpired = expiredAt === undefined || expiredAt < today;
    if (!isExpired) return;

    try {
      set({ loading: true });
      const unsortedOpportunities = await getAllOpportunities();
      const opportunities = sortTraining(
        get().sortBy,
        get().orderBy,
        unsortedOpportunities
      );
      const expiredTime = today;
      expiredTime.setSeconds(cacheTime);
      set({
        loading: false,
        expiredAt: expiredTime,
        opportunities,
        error: undefined,
      });
    } catch (error) {
      console.error(error);
      set({ loading: false, error: error, opportunities: get().opportunities });
    }
  },
  setOpportunitiesSort(sortBy, orderBy) {
    const opportunities = get().opportunities;
    if (opportunities === undefined)
      throw new Error("Please use after fetch opportunities");

    const newOrder = sortTraining(sortBy, orderBy, opportunities);
    set({ sortBy, orderBy, opportunities: newOrder });
  },
}));
