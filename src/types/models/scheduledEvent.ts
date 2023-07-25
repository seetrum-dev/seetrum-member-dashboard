import { Timestamp } from "firebase/firestore";
import { BaseModel } from ".";
import { kDefaultThumbnailFilename } from "@/lib/constants";

export type ScheduledEvent = BaseModel & ScheduledEventModel;

export type ScheduledEventModel = {
  title: string;
  scheduleDateTime: Timestamp;
  scheduleEndDateTime: Timestamp;
  venue: string;
  organizer: string;
  description: string;
  thumbnailFileName: string;
  whatsappLink?: string;
};

export const getDummyEvent = () => {
  const date = new Date().getTime();

  const de: ScheduledEventModel = {
    title: "dummy event " + date,
    scheduleDateTime: Timestamp.fromDate(new Date()),
    scheduleEndDateTime: Timestamp.fromDate(new Date()),
    venue: "https://zoom.com",
    organizer: "Seetrum",
    description: "<h1>description</h1>",
    thumbnailFileName: kDefaultThumbnailFilename,
  };

  return de;
};
