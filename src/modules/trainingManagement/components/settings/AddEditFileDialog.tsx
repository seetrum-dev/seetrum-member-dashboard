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
import { useEffect } from "react";

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
  const isEditing = fileRequirement !== undefined;

  const t = useMantineTheme();
  const borderStyle = {
    borderBottom: "1px solid",
    borderColor: t.fn.rgba(t.colors.night[5], 0.12),
  };

  const form = useForm({
    initialValues: {} as FileRequirement,
  });

  useEffect(() => {
    form.reset();
    if (isOpen && fileRequirement) form.setValues(fileRequirement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, fileRequirement]);

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      //
      if (!isEditing) console.log(1349, "add this FR", values);
      else console.log(1349, "edit with this FR", values);
    } catch (e) {
      showErrorNotif();
    }
    onClose();
  });

  function valueLabelFormat(value: number) {
    const units = ["B", "KB", "MB"];

    let unitIndex = 0;
    let scaledValue = value;

    while (scaledValue >= 1024 && unitIndex < units.length - 1) {
      unitIndex += 1;
      scaledValue /= 1024;
    }

    return `${scaledValue} ${units[unitIndex]}`;
  }
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
          <Stack spacing={16} p={16} pb={40}>
            <TextInput
              label={<Typography textVariant="title-md">File name</Typography>}
              placeholder="Enter the file name"
              {...form.getInputProps("title")}
              value={form.getInputProps("title").value || ""}
            />
            <Select
              label={<Typography textVariant="title-md">File type</Typography>}
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
            <Button
              radius={8}
              onClick={() => {
                handleSubmit();
                form.reset();
              }}
            >
              {isEditing ? "Save changes" : "Add new file requirement"}
            </Button>
          </Flex>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
