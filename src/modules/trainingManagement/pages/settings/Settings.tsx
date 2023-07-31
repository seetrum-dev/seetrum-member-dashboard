import { updateTraining } from "@/modules/trainings/services/trainingService";
import { useTrainings } from "@/modules/trainings/store/useTrainings";
import { FileRequirement, Training } from "@/types/models/training";
import { Typography } from "@/ui/Typography";
import { Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AddEditFileDialog,
  FileRequirementManager,
} from "../../components/settings";

export const ManageTrainingSettingPage = () => {
  const { id: trainingId } = useParams();
  const { getTrainingsById } = useTrainings();
  const [training, setTraining] = useState<Training | null>(null);
  const [opened, handler] = useDisclosure(false);
  const [editFileRequirement, setEditData] = useState<FileRequirement>();

  useEffect(() => {
    if (trainingId) getTrainingsById(trainingId).then((t) => setTraining(t));
  }, [trainingId, getTrainingsById, opened, editFileRequirement]);

  const handleDeleteFR = async (fr: FileRequirement) => {
    if (!trainingId || !training) return;
    const newFR = training?.fileRequirements.filter(
      (f) => f.title !== fr.title
    );
    await updateTraining(trainingId, { fileRequirements: newFR });
    getTrainingsById(trainingId).then((t) => setTraining(t));
  };

  return (
    <Stack spacing={24}>
      <Stack spacing={8}>
        <Typography textVariant="title-lg">
          Manage additional information question
        </Typography>
        <Typography textVariant="body-md" color="dimmed">
          This section allows you to manage and customize additional questions
          for the training application form, providing flexibility and control
          over the information collected.
        </Typography>
      </Stack>
      {/* TODO: Put Additional information question section here */}
      <Stack spacing={8}>
        <Typography textVariant="title-lg">
          Manage application file requirement
        </Typography>
        <Typography textVariant="body-md" color="dimmed">
          This section allows you to define and manage the required files for
          the application process, ensuring that applicants submit the necessary
          documents efficiently and accurately.
        </Typography>
      </Stack>
      <FileRequirementManager
        fileRequirements={training?.fileRequirements}
        onCreate={() => handler.open()}
        onDelete={(fr) => handleDeleteFR(fr)}
        onEdit={(fr) => {
          setEditData(fr);
          handler.open();
        }}
      />
      <AddEditFileDialog
        fileRequirement={editFileRequirement}
        isOpen={opened}
        onClose={() => {
          handler.close();
          setEditData(undefined);
        }}
      />
    </Stack>
  );
};
