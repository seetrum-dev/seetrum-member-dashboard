import { getAllUsers, updateUser } from "@/modules/user/services/userService";
import { User, UserType } from "@/types";
import { create } from "zustand";

interface MembersStore {
  members?: User[];
  organization?: User[];
  getMemberDetail: (id: string) => User | undefined;
  getMembers: (type: UserType) => Promise<User[] | undefined>;
  revalidate: (type: UserType) => Promise<void>;
  updateMember: (memberId: string, updateData: Partial<User>) => Promise<void>;
  isValid: Record<UserType, boolean>;
  setValidStatus: (field: UserType, status: boolean) => void;
}

export const useMemberStore = create<MembersStore>((set, get) => ({
  getMemberDetail(id) {
    const user =
      get().members?.find((u) => u.id === id) ||
      get().organization?.find((u) => u.id === id);
    return user;
  },
  async getMembers(type) {
    const users = type === "individual" ? get().members : get().organization;
    const isValid = get().isValid[type];

    if (users && isValid) return users;
    try {
      const updatedUsers = (await getAllUsers()).filter(
        (user) => Boolean(user.organization) === (type === "organization")
      );

      if (type === "individual")
        set((s) => ({
          members: updatedUsers,
          isValid: { ...s.isValid, individual: true },
        }));
      else
        set((s) => ({
          organization: updatedUsers,
          isValid: { ...s.isValid, organization: true },
        }));

      return updatedUsers;
    } catch (error) {
      console.error(error);
    }
  },

  async revalidate(type) {
    const users = await get().getMembers(type);
    if (type === "individual")
      set((s) => ({
        members: users,
        isValid: { ...s.isValid, individual: true },
      }));
    else
      set((s) => ({
        organization: users,
        isValid: { ...s.isValid, organization: true },
      }));
  },

  async updateMember(memberId, updateData) {
    try {
      await updateUser(memberId, updateData);
      set((s) => ({ isValid: { ...s.isValid, individual: false } }));
      await get().revalidate("individual");
    } catch (error) {
      console.error(error);
    }
  },

  isValid: { individual: false, organization: false },
  setValidStatus(field, status) {
    set((s) => ({ isValid: { ...s.isValid, [field]: status } }));
  },
}));
