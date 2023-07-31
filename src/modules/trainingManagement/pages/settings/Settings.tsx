import { Typography } from "@/ui/Typography";
import { Stack } from "@mantine/core";
import {
  AddEditFileDialog,
  FileRequirementManager,
} from "../../components/settings";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { FileRequirement } from "@/types/models/training";

export const ManageTrainingSettingPage = () => {
  const [opened, handler] = useDisclosure(false);
  const [editFileRequirement, setEditData] = useState<FileRequirement>();

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
        onCreate={() => handler.open()}
        onDelete={(fr) => console.log(1349, fr)}
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
