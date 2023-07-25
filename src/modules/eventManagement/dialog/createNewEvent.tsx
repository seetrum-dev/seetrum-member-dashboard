import { ScheduledEventModel } from "@/types/models/scheduledEvent";
import { Typography } from "@/ui/Typography";
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
  onDone: (event: Partial<ScheduledEventModel>) => void;
}
export const CreateNewEventDialog: React.FC<NewEventDialogProps> = ({
  isOpen,
  onClose,
  onDone,
}) => {
  const todayAtMidnight = new Date().setHours(0, 0, 0, 0);
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
        const today = new Date(Date.now());
        return val
          ? val.toDate() > today
            ? null
            : "Event date & time start must be in the future"
          : "Event date & time start is required";
      },
      scheduleEndDateTime: (val) => {
        const today = new Date(Date.now());
        if (!val) {
          return "Event date & time end is required";
        }

        if (val.toDate() <= today) {
          return "Event date & time end must be in the future";
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
          <form
            onSubmit={form.onSubmit(async (values) => {
              onDone({ ...values });
              form.reset();
              onClose();
            })}
          >
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
                  minDate={new Date(todayAtMidnight)}
                  modalProps={{
                    withinPortal: true,
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
                  minDate={new Date(todayAtMidnight)}
                  modalProps={{
                    withinPortal: true,
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
