import { COLLECTION_EVENT, kDefaultThumbnailFilename } from "@/lib/constants";
import {
  addNewDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
} from "@/services/firebase/helper";
import {
  CreateScheduledEventModel,
  ScheduledEvent,
  ScheduledEventModel,
} from "@/types/models/scheduledEvent";

export const createEvent = async (
  payload: CreateScheduledEventModel
): Promise<ScheduledEvent> => {
  return createEventMaster({
    ...payload,
    description: "",
    thumbnailFileName: kDefaultThumbnailFilename,
  });
};

export const createEventMaster = async (
  payload: ScheduledEventModel
): Promise<ScheduledEvent> => {
  try {
    const res = await addNewDocument<ScheduledEventModel>(
      COLLECTION_EVENT,
      payload
    );
    return res;
  } catch (e) {
    throw e;
  }
};

export const getAllScheduledEvents = async (): Promise<ScheduledEvent[]> => {
  try {
    return await getAllDocuments<ScheduledEvent>(COLLECTION_EVENT);
  } catch (e) {
    throw e;
  }
};

export const getScheduledEventById = async (eventId: string) => {
  try {
    const training = await getDocumentById<ScheduledEvent>(
      COLLECTION_EVENT,
      eventId
    );
    if (!training) {
      throw new Error("Event not found");
    }
    return training;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const updateScheduledEvent = async (
  eventId: string,
  payload: Partial<ScheduledEvent>
) => {
  try {
    await updateDocument(COLLECTION_EVENT, eventId, payload);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
