import { displayEventDate, kLineClamp } from "@/lib/utils";
import { updateScheduledEvent } from "@/modules/event/services/eventService";
import { useEventDetail } from "@/modules/event/store/useEventDetail";
import { useEventsList } from "@/modules/event/store/useEventList";
import { ScheduledEvent } from "@/types/models/scheduledEvent";
import { IconCalendar } from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import {
  Box,
  Button,
  Divider,
  Flex,
  Loader,
  Skeleton,
  Stack,
  TextInput,
  Tooltip,
  TypographyStylesProvider,
  useMantineTheme,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { UseFormReturnType, isNotEmpty, useForm } from "@mantine/form";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ManageEventGeneralInfo = () => {
  const [editState, setMode] = useState<"edit" | "view">("view");
  const [loading, setLoading] = useState<boolean>(false);

  const { id } = useParams();
  const eventId = useEventDetail((s) => s.eventId);
  const event = useEventDetail((s) => s.event);
  const getEvent = useEventDetail((s) => s.getEvent);
  const revalidate = useEventDetail((s) => s.revalidate);
  const setValidStatus = useEventsList((s) => s.setValidStatus);

  const { createdAt, updatedAt, thumbnailFileName, ...initialValues } =
    event || {};

  const form = useForm<Partial<ScheduledEvent>>({
    initialValues,
    validate: {
      title: isNotEmpty("Title can not be empty"),
      organizer: isNotEmpty("Trainer name can not be empty"),
      venue: isNotEmpty("Due date can not be empty"),
    },
  });

  const editor = useEditor(
    {
      extensions: [StarterKit, Link],
      content: form.values.description,
    },
    [form.values.description]
  );

  useEffect(() => {
    if (id === eventId) return;
    id && getEvent(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (eventId !== id) form.reset();
    if (event && (!form.isDirty() || event.id !== form.values.id)) {
      const { createdAt, updatedAt, thumbnailFileName, ...eventData } = event;
      form.setValues(eventData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, event]);

  const handleSavingEvent = async () => {
    event &&
      (await updateScheduledEvent(event.id, {
        ...form.values,
        description: editor?.getHTML(),
      }));
    await revalidate();
    setValidStatus(false);
  };

  const handleResetForm = () => {
    form.reset();
    const { createdAt, updatedAt, thumbnailFileName, ...eventData } =
      event || {};
    form.setValues(eventData);
  };

  const toggleState = async () => {
    if (editState === "edit") {
      setLoading(true);
      await handleSavingEvent();
      setLoading(false);
      handleResetForm();
    }
    setMode(editState === "edit" ? "view" : "edit");
  };

  return (
    <Stack
      p={16}
      pb={20}
      maw={"min(100%, 684px)"}
      sx={(t) => ({
        borderRadius: 16,
        border: "1px solid",
        borderColor: t.fn.rgba(t.colors.night[5], 0.12),
      })}
    >
      <Flex justify="space-between" gap={16}>
        <Typography textVariant="title-lg">General Information</Typography>
        <Flex gap={8}>
          {editState === "edit" && (
            <Button
              onClick={() => {
                setMode("view");
                handleResetForm();
              }}
              radius={8}
              variant={"subtle"}
            >
              Discard
            </Button>
          )}
          <Button
            onClick={toggleState}
            radius={8}
            loading={loading}
            variant={editState === "view" ? "subtle" : "filled"}
          >
            {editState === "edit" ? "Save changes" : "Edit"}
          </Button>
        </Flex>
      </Flex>
      {editState === "edit" ? (
        <GeneralInfoEditor form={form} editor={editor} />
      ) : (
        <GeneralInfoViewer event={event} />
      )}
    </Stack>
  );
};

const GeneralInfoViewer = ({ event }: { event?: ScheduledEvent }) => {
  return (
    <Stack>
      <Stack spacing={8}>
        <Typography textVariant="title-md">Event Title</Typography>
        <Skeleton visible={event === undefined} w={event ? "100%" : "45%"}>
          <Typography>{event?.title || "-"}</Typography>
        </Skeleton>
      </Stack>
      <Divider />
      <Flex gap={16}>
        <Stack spacing={8} miw={150} sx={{ flex: 1 }}>
          <Typography textVariant="title-md">Date & Time</Typography>
          <Skeleton visible={event === undefined} w={event ? "100%" : "70%"}>
            <Typography sx={{ wordBreak: "break-all", ...kLineClamp(2) }}>
              {event
                ? displayEventDate(
                    event.scheduleDateTime?.toDate(),
                    event.scheduleEndDateTime?.toDate()
                  )
                : "-"}
            </Typography>
          </Skeleton>
        </Stack>
        <Stack spacing={8} miw={150} sx={{ flex: 1 }}>
          <Typography textVariant="title-md">Venue</Typography>
          <Tooltip withArrow label={event?.venue ?? "-"}>
            <Skeleton visible={event === undefined} w={event ? "100%" : "70%"}>
              <Typography sx={{ wordBreak: "break-all", ...kLineClamp(2) }}>
                {event?.venue ?? "-"}
              </Typography>
            </Skeleton>
          </Tooltip>
        </Stack>
        <Stack spacing={8} miw={150} sx={{ flex: 1 }}>
          <Typography textVariant="title-md">Organizer</Typography>
          <Skeleton visible={event === undefined} w={event ? "100%" : "70%"}>
            <Typography sx={{ wordBreak: "break-all", ...kLineClamp(2) }}>
              {event?.organizer ?? "-"}
            </Typography>
          </Skeleton>
        </Stack>
      </Flex>
      <Divider />
      <Stack>
        <Typography variant="title-md">Description</Typography>
        {event ? (
          <TypographyStylesProvider>
            <Box
              component="div"
              dangerouslySetInnerHTML={{ __html: event?.description || "-" }}
            />
          </TypographyStylesProvider>
        ) : (
          <Stack h={100} w="100%" justify="center" align="center">
            <Loader />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

const GeneralInfoEditor = ({
  form,
  editor,
}: {
  form: UseFormReturnType<
    Partial<ScheduledEvent>,
    (values: Partial<ScheduledEvent>) => Partial<ScheduledEvent>
  >;
  editor: Editor | null;
}) => {
  const t = useMantineTheme();

  const handleDateChange = (field: keyof ScheduledEvent, value: Date) => {
    value.setSeconds(0);
    const timestamp = Timestamp.fromDate(value);
    form.setFieldValue(field, timestamp);
  };

  return (
    <Stack>
      <TextInput
        label={<Typography textVariant="title-md">Event title</Typography>}
        placeholder="Enter the event title here"
        {...form.getInputProps("title")}
      />
      <Stack spacing={8}>
        <Typography textVariant="title-md">Date & time</Typography>
        <Flex gap={16} align="center">
          <DateTimePicker
            placeholder="Pick the event start date & time"
            sx={{ flex: 1 }}
            minDate={new Date(Date.now())}
            rightSection={<IconCalendar color={t.colors.gray[6]} />}
            value={form.values.scheduleDateTime?.toDate()}
            onChange={(date: Date) => {
              handleDateChange("scheduleDateTime", date);
              const endEventDate = new Date(date.toISOString());
              endEventDate.setSeconds(60 * 60);
              handleDateChange("scheduleEndDateTime", endEventDate);
            }}
          />
          <Typography>to</Typography>
          <DateTimePicker
            placeholder="Pick the event end date & time"
            minDate={form.values.scheduleDateTime?.toDate()}
            sx={{ flex: 1 }}
            rightSection={<IconCalendar color={t.colors.gray[6]} />}
            value={form.values.scheduleEndDateTime?.toDate()}
            onChange={(date: Date) =>
              handleDateChange("scheduleEndDateTime", date)
            }
          />
        </Flex>
      </Stack>
      <TextInput
        label={<Typography textVariant="title-md">Venue</Typography>}
        placeholder="Enter the event venue here"
        {...form.getInputProps("venue")}
      />
      <TextInput
        label={<Typography textVariant="title-md">Organizer</Typography>}
        placeholder="Enter the event organizer here"
        {...form.getInputProps("organizer")}
      />
      <TextInput
        label={
          <Typography textVariant="title-md">
            Event Whatsapp Group Link
          </Typography>
        }
        placeholder="Enter the event whatsapp group link here"
        {...form.getInputProps("whatsappLink")}
      />
      <Stack spacing={8}>
        <Typography textVariant="title-md">Description</Typography>
        <RichTextEditor editor={editor} sx={{ borderRadius: 8 }}>
          <RichTextEditor.Toolbar
            sx={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
            sticky
            stickyOffset={60}
          >
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
              <RichTextEditor.H5 />
              <RichTextEditor.H6 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content sx={{ borderRadius: 8 }} />
        </RichTextEditor>
      </Stack>
    </Stack>
  );
};
