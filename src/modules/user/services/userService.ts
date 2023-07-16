import { COLLECTION_USERS } from "@/lib/constants";
import {
  getAllDocuments,
  getDocumentById,
  updateDocument,
} from "@/services/firebase/helper";
import { User } from "@/types";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    return await getAllDocuments<User>(COLLECTION_USERS);
  } catch (e) {
    throw e;
  }
};

export const updateUser = async (userId: string, payload: Partial<User>) => {
  try {
    await updateDocument(COLLECTION_USERS, userId, payload);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
