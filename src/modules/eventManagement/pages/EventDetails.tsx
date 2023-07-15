import { useParams } from "react-router-dom";
import { ManageEventParticipants } from "./EventParticipants";

type manageEventTabId = "info" | "participants";
export const ManageEventDetail = () => {
  const { tabId: tId } = useParams();
  const tabId = tId as manageEventTabId | undefined;

  switch (tabId) {
    case "participants":
      return <ManageEventParticipants />;

    default:
      return <h1>Event Details/Info</h1>;
  }
};
