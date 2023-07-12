import { useEventsList } from "@/modules/event/store/useEventList";
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
  const t = useMantineTheme();
  const borderStyle = {
    borderBottom: "1px solid",
    borderColor: t.fn.rgba(t.colors.night[5], 0.12),
  };
  const { createEvent, getEvents } = useEventsList();
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
            : "ScheduleDateTime must be in the future"
          : "ScheduleDateTime is required";
      },
    },
  });

  return (
    <Modal.Root opened={isOpen} onClose={onClose}>
      <Modal.Overlay
        sx={{ backgroundColor: t.fn.rgba(t.colors.night[5], 0.25) }}
      />
      <Modal.Content radius={16} sx={{ overflowY: "visible" }}>
        <Modal.Header sx={{ ...borderStyle, borderRadius: "16px 16px 0 0" }}>
          <Typography textVariant="title-lg">Create a New Event</Typography>
        </Modal.Header>
        <Modal.Body p={0}>
          <form
            onSubmit={form.onSubmit(async (values) => {
              await createEvent(values);
              await getEvents();
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
                  label="Event date & time"
                  placeholder="Pick the event date & time"
                  minDate={new Date(Date.now())}
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
                <Button onClick={onClose} radius={8} variant="subtle">
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
