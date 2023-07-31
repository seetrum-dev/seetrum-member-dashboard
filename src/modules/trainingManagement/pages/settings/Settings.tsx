import { Typography } from "@/ui/Typography";
import { Stack } from "@mantine/core";
import { FileRequirementManager } from "../../components/settings";

export const ManageTrainingSettingPage = () => {
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
      <FileRequirementManager />
    </Stack>
  );
};
