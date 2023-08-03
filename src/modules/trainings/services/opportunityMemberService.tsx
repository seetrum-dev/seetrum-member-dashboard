import { COLLECTION_TRAINING_MEMBER } from "@/lib/constants";
import { getDocumentsByQuery } from "@/services/firebase/helper";
import { TrainingMember } from "@/types/models/trainingMember";
import { where } from "firebase/firestore";

export const getOpportunityMemberByMemberId = async (
  memberId: string
): Promise<TrainingMember[]> => {
  try {
    return await getDocumentsByQuery<TrainingMember>(
      COLLECTION_TRAINING_MEMBER,
      where("memberId", "==", memberId),
      where("tag", "==", "opportunity")
    );
  } catch (e) {
    throw e;
  }
};
