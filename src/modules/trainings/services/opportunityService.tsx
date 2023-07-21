import {
  COLLECTION_TRAINING,
  kDefaultFileRequirements,
  kDefaultThumbnailFilename,
} from "@/lib/constants";
import {
  addNewDocument,
  getDocumentById,
  getDocumentsByQuery,
  updateDocument,
} from "@/services/firebase/helper";
import {
  CreateTrainingModel,
  Training,
  TrainingModel,
} from "@/types/models/training";
import { Timestamp, where } from "firebase/firestore";

export const getAllOpportunities = async (): Promise<Training[]> => {
  try {
    return await getDocumentsByQuery<Training>(
      COLLECTION_TRAINING,
      where("tag", "==", "opportunity")
    );
  } catch (e) {
    throw e;
  }
};

export const createOpportunity = async (
  payload: CreateTrainingModel,
  tag: "training" | "opportunity" = "training",
  withTemplate = true
): Promise<Training> => {
  try {
    const payloadWithDefault: TrainingModel = {
      ...payload,
      dueDate: payload.deadline ?? Timestamp.fromDate(new Date()),
      tag,
      description: "",
      thumbnailFileName: kDefaultThumbnailFilename,
      attachments: [],
      fileRequirements: withTemplate ? kDefaultFileRequirements : [],
    };

    delete payloadWithDefault.deadline;

    const res = await addNewDocument<TrainingModel>(
      COLLECTION_TRAINING,
      payloadWithDefault
    );
    return res;
  } catch (e) {
    throw e;
  }
};

export const createOpportunityMaster = async (
  payload: TrainingModel
): Promise<Training> => {
  try {
    const res = await addNewDocument<TrainingModel>(
      COLLECTION_TRAINING,
      payload
    );
    return res;
  } catch (e) {
    throw e;
  }
};

export const getOpportunityById = async (trainingId: string) => {
  try {
    const training = await getDocumentById<Training>(
      COLLECTION_TRAINING,
      trainingId
    );
    if (!training) {
      throw new Error("Training not found");
    }
    return training;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const updateOpportunity = async (
  trainingId: string,
  payload: Partial<Training>
) => {
  try {
    await updateDocument(COLLECTION_TRAINING, trainingId, payload);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
