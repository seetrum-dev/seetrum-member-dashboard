import {
  COLLECTION_TRAINING,
  kDefaultFileRequirements,
  kDefaultThumbnailFilename,
} from "@/lib/constants";
import {
  addNewDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
} from "@/services/firebase/helper";
import {
  CreateTrainingModel,
  Training,
  TrainingModel,
} from "@/types/models/training";
import { Timestamp } from "firebase/firestore";

export const getAllTrainings = async (): Promise<Training[]> => {
  try {
    return await getAllDocuments<Training>(COLLECTION_TRAINING);
  } catch (e) {
    throw e;
  }
};

export const createTraining = async (
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

export const createTrainingMaster = async (
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

export const getTrainingById = async (trainingId: string) => {
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

export const updateTraining = async (
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
