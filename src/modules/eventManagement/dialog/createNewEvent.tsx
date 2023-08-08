import {
  CreateScheduledEventModel,
  ScheduledEventModel,
} from "@/types/models/scheduledEvent";
import { Typography } from "@/ui/Typography";
import { showErrorNotif } from "@/ui/notifications";
import {
  Button,
  Flex,
  Modal,
  Stack,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { Timestamp } from "firebase/firestore";

interface NewEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDone: (event: CreateScheduledEventModel) => void;
}
export const CreateNewEventDialog: React.FC<NewEventDialogProps> = ({
  isOpen,
  onClose,
  onDone,
}) => {
  const t = useMantineTheme();
  const borderStyle = {
    borderBottom: "1px solid",
    borderColor: t.fn.rgba(t.colors.night[5], 0.12),
  };
  const isMobile = useMediaQuery(t.fn.smallerThan("sm").replace("@media ", ""));
  const form = useForm({
    initialValues: {
      title: "",
      organizer: "",
      venue: "",
    } as Partial<ScheduledEventModel>,
    validate: {
      title: (val) => (Boolean(val) ? null : "Title is required"),
      venue: (val) => (Boolean(val) ? null : "Venue is required"),
      organizer: (val) => (Boolean(val) ? null : "Organizer is required"),
      scheduleDateTime: (val) => {
        return val ? null : "Event date & time start is required";
      },
      scheduleEndDateTime: (val) => {
        if (!val) {
          return "Event date & time end is required";
        }

        if (val.toDate() <= form.values.scheduleDateTime!.toDate()) {
          return "Event date & time end must be after the start time";
        }
      },
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const event: CreateScheduledEventModel = {
        title: values.title!,
        organizer: values.organizer!,
        venue: values.venue!,
        scheduleDateTime: values.scheduleDateTime!,
        scheduleEndDateTime: values.scheduleEndDateTime!,
      };
      onDone(event);
    } catch (e) {
      showErrorNotif();
    }
    handleClose();
  });

  return (
    <Modal.Root
      opened={isOpen}
      onClose={handleClose}
      sx={{
        "& .mantine-Modal-inner": {
          padding: 0,
        },
      }}
    >
      <Modal.Overlay
        sx={{ backgroundColor: t.fn.rgba(t.colors.night[5], 0.25) }}
      />
      <Modal.Content
        radius={16}
        maw={isMobile ? "90%" : undefined}
        m={"auto"}
        sx={{ overflowY: "visible" }}
      >
        <Modal.Header sx={{ ...borderStyle, borderRadius: "16px 16px 0 0" }}>
          <Typography textVariant="title-lg">Create a New Event</Typography>
        </Modal.Header>
        <Modal.Body p={0}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={0}>
              <Stack p={16} pb={40} spacing={16} sx={{ ...borderStyle }}>
                <TextInput
                  label="Event title"
                  withAsterisk
                  placeholder="Enter the event title here"
                  {...form.getInputProps("title")}
                />
                <DateTimePicker
                  clearable
                  withAsterisk
                  label="Event date & time start"
                  placeholder="Pick the event date & time"
                  modalProps={{
                    withinPortal: true,
                  }}
                  popoverProps={{
                    zIndex: 1000,
                  }}
                  error={form.errors["scheduleDateTime"]}
                  date={form.values.scheduleDateTime?.toDate() || undefined}
                  onChange={(date) => {
                    form.setFieldValue(
                      "scheduleDateTime",
                      date !== null
                        ? Timestamp.fromDate(date as Date)
                        : undefined
                    );
                  }}
                />
                <DateTimePicker
                  clearable
                  withAsterisk
                  label="Event date & time end"
                  placeholder="Pick the event date & time"
                  disabled={!form.values.scheduleDateTime}
                  modalProps={{
                    withinPortal: true,
                  }}
                  minDate={form.values.scheduleDateTime?.toDate() || undefined}
                  popoverProps={{
                    zIndex: 1000,
                  }}
                  error={form.errors["scheduleEndDateTime"]}
                  date={form.values.scheduleEndDateTime?.toDate() || undefined}
                  onChange={(date) => {
                    form.setFieldValue(
                      "scheduleEndDateTime",
                      date !== null
                        ? Timestamp.fromDate(date as Date)
                        : undefined
                    );
                  }}
                />
                <TextInput
                  label="Organizer"
                  withAsterisk
                  placeholder="Enter the organizer name here"
                  {...form.getInputProps("organizer")}
                />
                <TextInput
                  label="Venue"
                  withAsterisk
                  placeholder="Enter the event venue here"
                  {...form.getInputProps("venue")}
                />
              </Stack>
              <Flex px={16} py={8} justify="end" gap={8}>
                <Button onClick={handleClose} radius={8} variant="subtle">
                  Cancel
                </Button>
                <Button type="submit" radius={8}>
                  Create event
                </Button>
              </Flex>
            </Stack>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
