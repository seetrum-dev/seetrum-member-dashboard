import { updateTraining } from "@/modules/trainings/services/trainingService";
import { useTrainings } from "@/modules/trainings/store/useTrainings";
import { FileRequirement } from "@/types/models/training";
import { Typography } from "@/ui/Typography";
import { showErrorNotif } from "@/ui/notifications";
import {
  Button,
  Flex,
  Modal,
  Select,
  Slider,
  Stack,
  Switch,
  TextInput,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface AddEditFileDialogProps {
  fileRequirement?: FileRequirement;
  isOpen: boolean;
  onClose: () => void;
}

export const AddEditFileDialog = ({
  fileRequirement,
  isOpen,
  onClose,
}: AddEditFileDialogProps) => {
  const t = useMantineTheme();
  const { id: trainingId } = useParams();
  const { getTrainingsById } = useTrainings();
  const [loading, setLoading] = useState(false);

  const isEditing = fileRequirement !== undefined;

  const form = useForm({
    initialValues: {
      maxSize: 1 * 1024 * 1024,
    } as FileRequirement,
    validate: {
      title: (value) => (Boolean(value) ? null : "File name is required"),
      accepts: (value) => (Boolean(value) ? null : "File type is required"),
      description: (val) => (Boolean(val) ? null : "Description is required"),
    },
  });

  useEffect(() => {
    form.reset();
    if (isOpen && fileRequirement) form.setValues(fileRequirement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, fileRequirement]);

  const handleSubmit = form.onSubmit(async (values) => {
    if (!trainingId) return;
    setLoading(true);
    const training = await getTrainingsById(trainingId);
    const oldFR = training?.fileRequirements;
    try {
      if (!isEditing) {
        await updateTraining(trainingId, {
          fileRequirements: [oldFR || [], values].flat(),
        });
      } else {
        await updateTraining(trainingId, {
          fileRequirements: oldFR?.map((fr) =>
            fr.title === fileRequirement.title ? values : fr
          ),
        });
      }
    } catch (e) {
      showErrorNotif();
    }
    onClose();
    setLoading(false);
  });

  const valueLabelFormat = (value: number) => {
    const units = ["B", "KB", "MB"];

    let unitIndex = 0;
    let scaledValue = value;

    while (scaledValue >= 1024 && unitIndex < units.length - 1) {
      unitIndex += 1;
      scaledValue /= 1024;
    }

    return `${scaledValue} ${units[unitIndex]}`;
  };

  const borderStyle = {
    borderBottom: "1px solid",
    borderColor: t.fn.rgba(t.colors.night[5], 0.12),
  };

  return (
    <Modal.Root opened={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header sx={{ ...borderStyle, borderRadius: "16px 16px 0 0" }}>
          <Typography textVariant="title-lg">
            {isEditing ? "Edit Required File Property" : "Create a New Event"}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Stack spacing={16} p={16} pb={40}>
              <TextInput
                label={
                  <Typography textVariant="title-md">File name</Typography>
                }
                placeholder="Enter the file name"
                {...form.getInputProps("title")}
                value={form.getInputProps("title").value || ""}
              />
              <Select
                label={
                  <Typography textVariant="title-md">File type</Typography>
                }
                placeholder="Select one file type"
                data={[
                  { value: "image/png,image/jpeg", label: "Image" },
                  { value: "application/pdf", label: "PDF" },
                ]}
                {...form.getInputProps("accepts")}
              />
              <Stack spacing={8}>
                <Typography textVariant="title-md">Max file size</Typography>
                <Slider
                  pt="xl"
                  scale={(v) => v}
                  step={256 * 1024}
                  min={512 * 1024}
                  max={5 * 1024 * 1024}
                  labelAlwaysOn
                  defaultValue={1 * 1024 * 1024}
                  label={valueLabelFormat}
                  {...form.getInputProps("maxSize")}
                />
              </Stack>
              <Switch
                size="md"
                styles={{
                  track: { maxWidth: 56 },
                  body: {
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                }}
                label={
                  <Typography textVariant="title-md">
                    Make this file a mandatory requirement
                  </Typography>
                }
                labelPosition="left"
                {...form.getInputProps("required")}
                checked={form.values["required"]}
              />
              <Textarea
                autosize
                label={
                  <Typography textVariant="title-md">Description</Typography>
                }
                placeholder="Enter the file description here"
                {...form.getInputProps("description")}
                value={form.values["description"] || ""}
              />
            </Stack>
            <Flex gap={8} p={12} justify="flex-end">
              <Button radius={8} onClick={onClose} variant="subtle">
                Cancel
              </Button>
              <Button radius={8} type="submit" loading={loading}>
                {isEditing ? "Save changes" : "Add new file requirement"}
              </Button>
            </Flex>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
