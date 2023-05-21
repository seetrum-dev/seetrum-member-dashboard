import { COLLECTION_TRAINING } from "@/lib/constants";
import {
  addNewDocument,
  getAllDocuments,
  getDocumentById,
} from "@/services/firebase/helper";
import { Training, TrainingModel } from "@/types/models/training";

export const getAllTrainings = async (): Promise<Training[]> => {
  try {
    return await getAllDocuments<Training>(COLLECTION_TRAINING);
  } catch (e) {
    throw e;
  }
};

export const createTraining = async (
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
