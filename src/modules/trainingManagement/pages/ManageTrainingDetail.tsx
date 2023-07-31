import { useParams } from "react-router-dom";
import { ManageTrainingApplicants } from "./applicants";
import { TrainingInfoManagement } from "./info";
import { ManageTrainingSettingPage } from "./settings";

type manageTrainingTabId = "info" | "applicants" | "settings";
export const ManageTrainingDetail = () => {
  const { tabId: tId } = useParams();
  const tabId = tId as manageTrainingTabId | undefined;

  switch (tabId) {
    case "applicants":
      return <ManageTrainingApplicants />;

    case "settings":
      return <ManageTrainingSettingPage />;
    default:
      return <TrainingInfoManagement />;
  }
};
