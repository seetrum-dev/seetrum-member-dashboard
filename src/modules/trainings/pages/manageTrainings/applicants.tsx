import { kRowsPerPageOptions } from "@/lib/constants";
import { mergeObjects, pretyDateTime, toTitleCase } from "@/lib/utils";
import { useApplicantStore } from "@/modules/trainings/store/useApplicantsStore";
import { TrainingMember } from "@/types/models/trainingMember";
import { ExportMenu, TablePseudoExportButton } from "@/ui/Button/ExportMenu";
import { IconChevronRight, IconPDF, IconSearch } from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import {
  Badge,
  Box,
  Button,
  Drawer,
  Flex,
  Input,
  Loader,
  SelectItem,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

const firestorageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
export const ManageTrainingApplicants = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(
    theme.fn.smallerThan("sm").replace("@media ", "")
  );
  const navigate = useNavigate();
  const { applicants, getApplicants } = useApplicantStore();
  const [activeIndex, setActiveIndex] = useState<number>();
  const { id: trainingId, applicantId } = useParams();

  // Search controllers
  const [globalFilter, setGlobalFilter] = useState("");

  // Pagination Controls
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: parseInt(kRowsPerPageOptions[0]),
  });

  const expAllBtn = useRef<HTMLButtonElement>(null);
  const expRowsBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (trainingId) getApplicants(trainingId);
  }, [trainingId, getApplicants]);

  const columns = useMemo<MRT_ColumnDef<TrainingMember>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "",
        enableGlobalFilter: false,
      },
      {
        header: "No",
        Cell(props) {
          return (
            <Typography textVariant="body-lg">{props.row.index + 1}</Typography>
          );
        },
        size: 40,
        enableGlobalFilter: false,
      },
      {
        header: "Name",
        accessorKey: "name",
        Cell: ({ row, renderedCellValue }) => (
          <Stack sx={{ gap: 0 }}>
            <Typography textVariant="body-lg">{renderedCellValue}</Typography>
            <Flex gap={4} align="center">
              <Typography textVariant="body-sm" color="dimmed">
                {toTitleCase(row.original.province)}
              </Typography>
              {row.original.institutionName !== "-" && (
                <Box
                  w={4}
                  h={4}
                  sx={(t) => ({
                    borderRadius: 4,
                    background: t.colors.night[5],
                  })}
                />
              )}
              <Typography textVariant="body-sm" color="dimmed">
                {row.original.institutionName !== "-"
                  ? row.original.institutionName
                  : ""}
              </Typography>
            </Flex>
          </Stack>
        ),
      },
      {
        header: "Status",
        enableGlobalFilter: false,
        size: 100,
        accessorFn(originalRow) {
          let status: string;
          switch (originalRow.status) {
            case "rejected":
              status = "Rejected";
              break;
            case "accepted":
            case "completed":
              status = "Accepted";
              break;

            case "applied":
            default:
              status = "Received";
              break;
          }
          return status;
        },
        filterVariant: "select",
        mantineFilterSelectProps: {
          data: ["Received", "Accepted", "Rejected"] as (
            | string
            | SelectItem
          )[] &
            string,
        },
        Cell: ({ row, renderedCellValue }) => {
          return (
            <Badge
              size="md"
              variant="filled"
              color={
                row.original.status === "rejected"
                  ? "red"
                  : row.original.status === "applied"
                  ? "platinum.6"
                  : "biceblue"
              }
              sx={{
                textTransform: "none",
                color: row.original.status === "applied" ? "black" : undefined,
              }}
            >
              {renderedCellValue}
            </Badge>
          );
        },
      },
      {
        header: "Certificate",
        enableGlobalFilter: false,
        accessorKey: "issuedCertificate",
        accessorFn(originalRow) {
          return Boolean(originalRow.issuedCertificate?.length ?? 0)
            ? "true"
            : "false";
        },
        filterVariant: "checkbox",
        Cell({ row }) {
          if (
            !Boolean(row.original.issuedCertificate) ||
            row.original.issuedCertificate.length === 0
          )
            return (
              <Typography textVariant="body-md" color="dimmed">
                <i>No certificate uploaded</i>
              </Typography>
            );
          return (
            <Flex align="center" gap={4}>
              {row.original.issuedCertificate.slice(0, 2).map((certif) => (
                <Badge
                  key={certif.filename}
                  variant="outline"
                  h={26}
                  py={4}
                  sx={(t) => ({
                    textTransform: "none",
                    borderColor: t.fn.rgba(t.colors.night[6], 0.12),
                    ".file-icon": {
                      lineHeight: "1 !important",
                      color: t.colors.red[6],
                    },
                  })}
                >
                  <Flex gap={8} align="center">
                    <IconPDF className="file-icon" size={16} />
                    <Typography textVariant="label-md" c="night">
                      {certif.filename.split("-").slice(1).join("-")}
                    </Typography>
                  </Flex>
                </Badge>
              ))}
              {row.original.issuedCertificate.length > 2
                ? `and ${row.original.issuedCertificate.length - 2} more`
                : undefined}
            </Flex>
          );
        },
      },
      {
        id: "actions",
        enableGlobalFilter: false,
        header: "",
        size: 40,
        Cell(props) {
          return (
            <Button
              variant="subtle"
              size="small"
              sx={{ borderRadius: 100, padding: 4 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(props.row.getValue("id"));
                setActiveIndex(props.row.index);
              }}
            >
              <IconChevronRight />
            </Button>
          );
        },
      },
    ],
    [navigate]
  );

  if (!(trainingId && applicants && applicants[trainingId]))
    return (
      <Stack h={100} w={"100%"} align="center" justify="center">
        <Loader />
      </Stack>
    );

  const fisrtItem = pagination.pageIndex * pagination.pageSize + 1;
  const fisrtItemNumber = applicants[trainingId].length === 0 ? 0 : fisrtItem;
  const lastItem = (pagination.pageIndex + 1) * pagination.pageSize;
  const lastItemNumber =
    lastItem > applicants[trainingId].length
      ? applicants[trainingId].length
      : lastItem;

  return (
    <Stack spacing={isMobile ? 16 : 24}>
      <Flex justify="space-between" gap={16} align="center">
        <Input
          placeholder="Search applicants"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          radius={100}
          rightSection={<IconSearch color={theme.colors.night[5]} />}
          sx={(t) => ({
            maxWidth: !isMobile ? "50%" : "100%",
            flexGrow: 1,
          })}
        />
        <ExportMenu exportAllRef={expAllBtn} exportRowsRef={expRowsBtn} />
      </Flex>
      <Typography textVariant="body-md">
        Showing {fisrtItemNumber} - {lastItemNumber} applicants of total{" "}
        {applicants[trainingId].length} training applicants.
      </Typography>
      <MantineReactTable
        columns={columns}
        data={applicants[trainingId]}
        onPaginationChange={setPagination}
        onGlobalFilterChange={setGlobalFilter}
        state={{ pagination, globalFilter }}
        mantinePaginationProps={{
          rowsPerPageOptions: kRowsPerPageOptions,
        }}
        mantineTableHeadRowProps={{
          sx: (t) => ({ background: t.colors.gray[0] }),
        }}
        mantineTableBodyRowProps={({ row }) => ({
          sx: { cursor: "pointer" },
          onClick: (e) => {
            e.stopPropagation();
            e.preventDefault();

            setActiveIndex(row.index);
            navigate(row.original.id);
          },
        })}
        mantinePaperProps={{
          sx: { borderRadius: 16, boxShadow: "none" },
        }}
        initialState={{
          density: "xs",
          columnVisibility: { id: false },
        }}
        enableTopToolbar={true}
        mantineTopToolbarProps={{ display: "none" }}
        renderTopToolbarCustomActions={({ table }) => {
          const fileUrlParser = (filename: string) =>
            `https://firebasestorage.googleapis.com/v0/b/${firestorageBucket}/o/temp%2F${filename}?alt=media`;

          const dataFlatter = (rows: TrainingMember[]) =>
            rows.map((row, i) => {
              const dt = {
                ...row,
                createdAt: pretyDateTime(row.createdAt.toDate()),
                updatedAt: pretyDateTime(row.updatedAt.toDate()),
                ...mergeObjects(
                  row.additionalData?.map((data) => ({
                    [data.label]: data.value,
                  })) || []
                ),
                additionalData: undefined,
                requiredFiles: row.requiredFiles.length,
                ...mergeObjects(
                  row.requiredFiles.map((data) => ({
                    [data.tag]: fileUrlParser(data.filename),
                  }))
                ),
                issuedCertificate: row.issuedCertificate.length,
                ...mergeObjects(
                  row.issuedCertificate.map((data) => ({
                    [data.tag]: fileUrlParser(data.filename),
                  }))
                ),
              } as Record<keyof TrainingMember, any>;
              delete dt.additionalData;
              delete dt.id;
              return dt;
            });
          return (
            <TablePseudoExportButton
              exportAllRef={expAllBtn}
              exportRowsRef={expRowsBtn}
              onExportAll={(exporter) => {
                const exportedData = dataFlatter(applicants[trainingId]);
                exporter(exportedData);
              }}
              onExportRows={(exporter) => {
                const rows = table.getPrePaginationRowModel().rows;
                const exportedData = rows.map((row) => row.original);
                exporter(dataFlatter(exportedData));
              }}
            />
          );
        }}
      />
      <Drawer.Root
        opened={Boolean(applicantId)}
        onClose={() => navigate(".")}
        position="right"
        size={640}
        style={{
          height: "100%",
        }}
      >
        <Drawer.Overlay
          sx={(t) => ({
            background: "transparent",
          })}
        />
        <Outlet context={[activeIndex, setActiveIndex]} />
      </Drawer.Root>
    </Stack>
  );
};
