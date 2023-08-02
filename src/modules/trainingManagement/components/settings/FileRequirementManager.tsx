import { kLineClamp } from "@/lib/utils";
import { FileRequirement } from "@/types/models/training";
import { IconEditSquare, IconPlus, IconTrash } from "@/ui/Icons";
import {
  ActionIcon,
  Button,
  Flex,
  Loader,
  SelectItem,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

interface FileRequirementManagerProps {
  fileRequirements?: FileRequirement[];
  onCreate: () => void;
  onEdit: (fileRequirement: FileRequirement) => void;
  onDelete: (fileRequirement: FileRequirement) => Promise<void>;
  onReorder: (fileRequirements: FileRequirement[]) => void;
}

export const FileRequirementManager = ({
  fileRequirements,
  onCreate,
  onEdit,
  onDelete,
  onReorder,
}: FileRequirementManagerProps) => {
  const t = useMantineTheme();
  const { id: trainingId } = useParams();
  const [loading, setLoading] = useState<string>();

  const columns = useMemo<MRT_ColumnDef<FileRequirement>[]>(
    () => [
      {
        header: "File Name",
        accessorKey: "title",
        enableColumnFilter: false,
      },
      {
        header: "File Format",
        accessorFn(originalRow) {
          return originalRow.accepts.includes("image") ? "Images" : "PDF";
        },
        id: "accepts",
        maxSize: 100,
        enableGlobalFilter: false,
        filterVariant: "select",
        mantineFilterSelectProps: {
          data: ["PDF", "Images"] as (string | SelectItem)[] & string,
        },
      },
      {
        header: "Max File Size",
        accessorKey: "maxSize",
        maxSize: 100,
        Cell(props) {
          return `${props.row.original.maxSize / 1024 / 1024} MB`;
        },
        enableGlobalFilter: false,
        enableColumnFilter: false,
      },
      {
        header: "Is Required",
        id: "required",
        accessorFn(originalRow) {
          return originalRow.required ? "Yes" : "No";
        },
        maxSize: 80,
        filterVariant: "select",
        mantineFilterSelectProps: {
          data: ["Yes", "No"] as (string | SelectItem)[] & string,
        },
      },
      {
        header: "Description",
        accessorKey: "description",
        enableGlobalFilter: false,
        minSize: 500,
        Cell(props) {
          return (
            <Stack sx={{ ...kLineClamp(1) }}>{props.renderedCellValue}</Stack>
          );
        },
      },
      {
        header: "Action",
        id: "action",
        enableGlobalFilter: false,
        maxSize: 100,
        mantineColumnActionsButtonProps: {
          sx: {
            display: "none",
          },
        },
        mantineTableHeadCellProps({ column }) {
          return {
            sx: {
              div: {
                justifyContent: column.id === "action" ? "center" : undefined,
              },
            },
          };
        },
        Cell({ row }) {
          return (
            <Flex w="100%" align="center" justify="center">
              <ActionIcon
                variant="subtle"
                radius="lg"
                color="dark"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(row.original);
                }}
              >
                <IconEditSquare size={18} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                radius="lg"
                loading={loading === `delete-${row.id}`}
                color="dark"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLoading(`delete-${row.id}`);
                  await onDelete(row.original);
                  setLoading(undefined);
                }}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Flex>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onEdit, onDelete]
  );

  if (!trainingId || !fileRequirements)
    return (
      <Stack h={150} w="100%" justify="center" align="center">
        <Loader />
      </Stack>
    );

  return (
    <MantineReactTable
      columns={columns}
      data={fileRequirements}
      enableRowOrdering={true}
      enableSorting={false}
      mantineRowDragHandleProps={({ table }) => ({
        onDragEnd: (event) => {
          const { draggingRow, hoveredRow } = table.getState();
          if (!draggingRow || !hoveredRow) return;
          const sourceIndex = parseInt(draggingRow.id);
          const destIndex = parseInt(hoveredRow.id);
          const newOrder = [...fileRequirements];
          const source = newOrder.splice(sourceIndex, 1)[0];
          newOrder.splice(destIndex, 0, source);

          onReorder(newOrder);
        },
      })}
      mantineTableHeadRowProps={{
        sx: (t) => ({ background: t.colors.gray[0] }),
      }}
      mantineTableBodyRowProps={({ row }) => ({
        sx: { cursor: "pointer" },
        onClick: (e) => {
          e.stopPropagation();
          e.preventDefault();

          onEdit(row.original);
        },
      })}
      renderBottomToolbarCustomActions={() => {
        return (
          <Button
            radius={8}
            ml={8}
            sx={{
              borderColor: t.fn.rgba(t.colors.night[5], 0.12),
            }}
            variant="outline"
            leftIcon={<IconPlus size={18} />}
            onClick={onCreate}
          >
            Add a new file requirement
          </Button>
        );
      }}
      mantinePaperProps={{
        sx: { borderRadius: 16, boxShadow: "none" },
      }}
      initialState={{
        density: "xs",
        columnPinning: { right: ["action"] },
      }}
      enableTopToolbar={false}
      mantineTableHeadCellProps={{
        sx: (t) => ({
          "& .mantine-TableHeadCell-Content": {
            justifyContent: "space-between",
            paddingInlineEnd: 12,
            borderRight: "1px solid",
            borderColor: t.fn.rgba(t.colors.night[5], 0.12),
            ":last-child": {
              borderRight: "none",
            },
          },
        }),
      }}
    />
  );
};
