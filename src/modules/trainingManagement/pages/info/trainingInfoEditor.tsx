import { useTrainings } from "@/modules/trainings/store/useTrainings";
import { Training, TrainingModel } from "@/types/models/training";
import { IconCalendar } from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import { Button, Flex, Stack, TextInput, useMantineTheme } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Timestamp } from "firebase/firestore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const editorInitialValues: Partial<TrainingModel> = {
  title: "",
  trainerName: "",
  dueDate: undefined,
  description: "",
};

export const TrainingInfoEditor = ({
  onSubmit,
}: {
  onSubmit: (training: Partial<Training>) => void;
}) => {
  const thm = useMantineTheme();
  const { getTrainingsById } = useTrainings();
  const { id } = useParams();

  const form = useForm({
    initialValues: editorInitialValues,
    validate: {
      title: isNotEmpty("Title can not be empty"),
      trainerName: isNotEmpty("Trainer name can not be empty"),
      dueDate: isNotEmpty("Due date can not be empty"),
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
    console.log("called");
    const updateTraining = async (tid: string) => {
      const t = await getTrainingsById(tid);
      if (t) {
        const { title, trainerName, dueDate, description } = t;
        form.setValues({
          title,
          trainerName,
          dueDate,
          description,
        });
      }
    };
    if (id) {
      updateTraining(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, getTrainingsById]);

  const handleSubmit = form.onSubmit((values) => {
    console.log(values);
    console.log(editor?.getHTML());
    onSubmit({
      title: values.title?.trim(),
      trainerName: values.trainerName?.trim(),
      dueDate: values.dueDate,
      description: editor?.getHTML() ?? values.description,
    });
  });

  return (
    <Stack
      mt={8}
      mb={24}
      spacing={16}
      p={16}
      pb={20}
      sx={{
        borderRadius: 16,
        border: "1px solid",
        borderColor: thm.fn.rgba(thm.colors.night[5], 0.12),
      }}
    >
      <Flex gap={16} align="center">
        <Typography textVariant="title-lg" sx={{ flex: 1 }}>
          General Info
        </Typography>
        <Button
          variant="filled"
          radius={8}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Typography textVariant="label-lg">Save changes</Typography>
        </Button>
      </Flex>
      <Stack>
        <TextInput
          label={
            <Typography textVariant="title-md" mb={4}>
              Title
            </Typography>
          }
          placeholder="Title"
          maw="min(430px, 100%)"
          radius={8}
          {...form.getInputProps("title")}
        />
        <TextInput
          label={
            <Typography textVariant="title-md" mb={4}>
              Organizer
            </Typography>
          }
          placeholder="Input organizer"
          maw="min(430px, 100%)"
          radius={8}
          {...form.getInputProps("trainerName")}
        />

        <DatePickerInput
          icon={<IconCalendar size={18} />}
          label={
            <Typography textVariant="title-md" mb={4}>
              Application Deadline
            </Typography>
          }
          placeholder="Input application deadline"
          value={form.values.dueDate?.toDate()}
          onChange={(e) =>
            form.setFieldValue(
              "dueDate",
              e !== null ? Timestamp.fromDate(e) : undefined
            )
          }
          error={form.errors.dueDate}
          maw="min(430px, 100%)"
          radius={8}
        />

        <Stack spacing={0}>
          <Typography textVariant="title-md" mb={4}>
            Description
          </Typography>
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
    </Stack>
  );
};
