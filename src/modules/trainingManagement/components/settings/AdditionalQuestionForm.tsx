import { updateTraining } from "@/modules/trainings/services/trainingService";
import { FormMeta } from "@/types/models/inputMeta";
import {
  IconAsterisk,
  IconChevronDown,
  IconCopy,
  IconEditSquare,
  IconPlus,
  IconTrash,
} from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import {
  ActionIcon,
  Button,
  Flex,
  Loader,
  Select,
  Stack,
  Switch,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

interface AdditionalQuestionFormProps {
  additionalQuestions?: FormMeta[];
  onChange: () => void;
}

export const AdditionalQuestionForm = ({
  additionalQuestions,
  onChange,
}: AdditionalQuestionFormProps) => {
  const t = useMantineTheme();
  const { id: trainingId } = useParams();
  const [loading, setLoading] = useState<"create" | "duplicate" | string>();

  const handleDuplicate = async (question: FormMeta) => {
    if (!trainingId || !additionalQuestions) return;

    setLoading("duplicate");
    await updateTraining(trainingId, {
      formMetas: [...additionalQuestions, question],
    });
    onChange();
    setLoading(undefined);
  };

  const handleDelete = async (index: number) => {
    if (!trainingId || !additionalQuestions) return;

    setLoading(`delete-${index}`);
    await updateTraining(trainingId, {
      formMetas: additionalQuestions.filter((q, id) => id !== index),
    });
    onChange();
    setLoading(undefined);
  };

  const colums = useMemo<MRT_ColumnDef<FormMeta>[]>(
    () => [
      {
        accessorKey: "label",
        header: "Additional information question",
        enableColumnActions: false,
        enableSorting: false,
        size: 500,
        Cell({ renderedCellValue, row }) {
          return (
            <Flex gap={4}>
              {renderedCellValue}
              {row.original.required && (
                <IconAsterisk style={{ color: "#F03E3E" }} size={9} />
              )}
            </Flex>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableColumnActions: false,
        enableSorting: false,
        maxSize: 100,
        mantineColumnActionsButtonProps: {
          sx: {
            display: "none",
          },
        },
        Cell({ row, renderedCellValue, table, cell }) {
          const expandRow = () => {
            table.resetExpanded();
            if (!row.getIsExpanded()) {
              row.toggleExpanded();
            }
          };
          return (
            <Flex gap={4} m={0} justify="flex-end">
              <ActionIcon
                loading={loading === "duplicate"}
                radius="xl"
                color="dark"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDuplicate(row.original);
                }}
              >
                <IconCopy size={18} />
              </ActionIcon>
              <ActionIcon
                color="dark"
                radius="xl"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  expandRow();
                }}
              >
                <IconEditSquare size={18} />
              </ActionIcon>
              <ActionIcon
                color="dark"
                loading={loading === `delete-${row.index}`}
                radius="xl"
                onClick={() => handleDelete(row.index)}
              >
                <IconTrash size={18} />
              </ActionIcon>
              <ActionIcon
                color="dark"
                radius="xl"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  expandRow();
                }}
              >
                <IconChevronDown
                  style={{
                    transition: "all ease-in-out 200ms",
                    transform: `rotate(${row.getIsExpanded() ? 180 : 0}deg)`,
                  }}
                  size={18}
                />
              </ActionIcon>
            </Flex>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleDelete, handleDuplicate, trainingId]
  );

  const handleCreate = async () => {
    if (!trainingId || !additionalQuestions) return;

    setLoading("create");
    await updateTraining(trainingId, {
      formMetas: [
        ...additionalQuestions,
        { data: [], label: "Question", inputType: "input", required: false },
      ],
    });
    onChange();
    setLoading(undefined);
  };
  const handleReorder = async (quesitons: FormMeta[]) => {
    if (!trainingId) return;

    await updateTraining(trainingId, { formMetas: quesitons });
    onChange();
  };

  if (additionalQuestions === undefined)
    return (
      <Stack h={150} w="100%" justify="center" align="center">
        <Loader />
      </Stack>
    );

  return (
    <MantineReactTable
      columns={colums}
      data={additionalQuestions}
      enableTopToolbar={false}
      enableRowOrdering
      enableSorting={false}
      mantineRowDragHandleProps={({ table }) => ({
        onDragEnd: (event) => {
          const { draggingRow, hoveredRow } = table.getState();
          if (!draggingRow || !hoveredRow) return;
          const sourceIndex = parseInt(draggingRow.id);
          const destIndex = parseInt(hoveredRow.id);
          const newOrder = [...additionalQuestions];
          const source = newOrder.splice(sourceIndex, 1)[0];
          newOrder.splice(destIndex, 0, source);

          handleReorder(newOrder);
        },
      })}
      renderBottomToolbarCustomActions={() => {
        return (
          <Button
            radius={8}
            ml={8}
            loading={loading === "create"}
            sx={{
              borderColor: t.fn.rgba(t.colors.night[5], 0.12),
            }}
            variant="outline"
            leftIcon={<IconPlus size={18} />}
            onClick={handleCreate}
          >
            Add a new question
          </Button>
        );
      }}
      mantinePaperProps={{
        sx: { borderRadius: 16, boxShadow: "none" },
      }}
      mantineTableHeadRowProps={{
        sx: { background: t.colors.gray[0] },
      }}
      mantineDetailPanelProps={{
        sx: {
          ":hover": {
            background: "white",
          },
        },
      }}
      renderDetailPanel={({ row }) => {
        const formMeta = row.original;
        return (
          <FormMetaDetailPane
            formMeta={formMeta}
            index={row.index}
            questions={additionalQuestions}
            onChage={onChange}
          />
        );
      }}
      initialState={{
        density: "xs",
      }}
      enableExpandAll={false}
      mantineTableBodyCellProps={({ column }) => ({
        w: column.id.includes("expand") ? 0 : undefined,
        maw: column.id.includes("expand") ? 0 : undefined,
        display: column.id.includes("expand") ? "none" : undefined,
      })}
      mantineTableHeadCellProps={({ column }) => ({
        w: column.id.includes("expand") ? 0 : undefined,
        maw: column.id.includes("expand") ? 0 : undefined,
        display: column.id.includes("expand") ? "none" : undefined,
        sx: column.id.includes("action")
          ? {
              div: {
                justifyContent: "end",
                margin: "0 16px 0 0",
              },
            }
          : undefined,
      })}
      positionExpandColumn="last"
    />
  );
};

const FormMetaDetailPane = ({
  formMeta,
  questions,
  index,
  onChage,
}: {
  index: number;
  formMeta: FormMeta;
  questions: FormMeta[];
  onChage: () => void;
}) => {
  const { id: trainingId } = useParams();
  const form = useForm({
    initialValues: formMeta as FormMeta,
  });
  const [debbounceForm] = useDebouncedValue(form.values, 1000);

  useEffect(() => {
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debbounceForm]);

  const handleSubmit = form.onSubmit(async (values) => {
    if (!trainingId) return;

    const updatedFormMeta: FormMeta = {
      ...values,
      data: values.inputType === "input" ? [] : values.data,
    };

    updateTraining(trainingId, {
      formMetas: questions.map((q, i) => (i === index ? updatedFormMeta : q)),
    });
    onChage();
  });

  const handleOption = (index: number, val: string | undefined) => {
    const options: (string | undefined)[] = availableOptions;

    options[index] = val;
    const clearOptions = options.filter((op) => typeof op !== "undefined");
    form.setFieldValue("data", clearOptions as string[]);
  };

  const availableOptions =
    form.values["data"].length === 0 ? [""] : form.values.data;

  return (
    <form>
      <Stack spacing={16} px={6} py={0}>
        <Flex gap={24}>
          <TextInput
            label={"Question"}
            sx={{
              flex: 1,
              width: "100%",
            }}
            placeholder={"Enter your question here"}
            {...form.getInputProps("label")}
          />
          <Select
            sx={{ flexShrink: 0 }}
            label="Response type"
            data={[
              { value: "input", label: "Short answer" },
              { value: "select", label: "Dropdown" },
            ]}
            {...form.getInputProps("inputType")}
          />
        </Flex>
        {form.values["inputType"] === "select" ? (
          <Stack spacing={16}>
            <Typography textVariant="title-md">Answer options</Typography>
            {availableOptions.map((data, index) => {
              return (
                <Flex key={index} align="center" gap={8}>
                  <Typography textVariant="body-lg">{index + 1}.</Typography>
                  <TextInput
                    sx={{
                      width: "min(100%, 430px)",
                      maxWidth: "min(100%, 430px)",
                      flex: 1,
                    }}
                    placeholder={`Option ${index + 1}`}
                    onChange={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOption(index, e.target.value);
                    }}
                    value={form.values["data"][index] || ""}
                  />
                  {availableOptions.length === 1 ? undefined : (
                    <ActionIcon
                      radius={8}
                      size="lg"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOption(index, undefined);
                      }}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  )}
                  {index + 1 === availableOptions.length && (
                    <ActionIcon
                      radius={8}
                      size="lg"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOption(index + 1, "");
                      }}
                    >
                      <IconPlus size={20} />
                    </ActionIcon>
                  )}
                </Flex>
              );
            })}
          </Stack>
        ) : undefined}
        <Switch
          label={
            <Typography textVariant="title-md">Required question</Typography>
          }
          description={
            <Typography textVariant="body-md">
              If this option is selected, this question will be mandatory and
              must be answered by the form respondents.
            </Typography>
          }
          labelPosition="left"
          styles={{
            body: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            },
            track: {
              width: 56,
            },
          }}
          size="md"
          {...form.getInputProps("required")}
          checked={form.values.required}
        />
      </Stack>
    </form>
  );
};
