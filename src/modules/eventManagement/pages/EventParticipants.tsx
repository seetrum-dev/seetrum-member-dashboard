import { kRowsPerPageOptions } from "@/lib/constants";
import { pretyDateTime } from "@/lib/utils";
import { ProtectedPage } from "@/modules/auth/components/ProtectedPage";
import { useEventParticipantsStore } from "@/modules/event/store/useEventParticipants";
import { EventMember } from "@/types/models/eventMember";
import { ExportMenu, TablePseudoExportButton } from "@/ui/Button/ExportMenu";
import { IconSearch } from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import {
  Flex,
  Input,
  Loader,
  SelectItem,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export const ManageEventParticipants = () => {
  const theme = useMantineTheme();
  const { id: eventId } = useParams();
  const { participants, getParticipants } = useEventParticipantsStore();

  // Search controllers
  const [globalFilter, setGlobalFilter] = useState("");

  // Pagination Controls
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: parseInt(kRowsPerPageOptions[0]),
  });

  useEffect(() => {
    eventId && getParticipants(eventId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const expAllBtn = useRef<HTMLButtonElement>(null);
  const expRowsBtn = useRef<HTMLButtonElement>(null);

  const columns = useMemo<MRT_ColumnDef<EventMember>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "",
        enableGlobalFilter: false,
      },
      {
        header: "Name",
        accessorKey: "member.name",
      },
      // email
      {
        header: "Email",
        accessorKey: "member.email",
      },
      // roles
      {
        header: "Role",
        minSize: 70,
        maxSize: 100,
        accessorFn(originalRow) {
          let role: string;
          switch (originalRow.member.isAdmin) {
            case true:
              role = "Admin";
              break;

            default:
              role = "Member";
              break;
          }
          return role;
        },
        filterVariant: "select",
        mantineFilterSelectProps: {
          data: ["Member", "Admin"] as (string | SelectItem)[] & string,
        },
      },
      // joined at
      {
        header: "Joining Event at",
        sizw: 100,
        maxSize: 100,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        accessorFn(originalRow) {
          return pretyDateTime(originalRow.createdAt.toDate());
        },
      },
    ],
    []
  );

  if (!participants || !eventId || !participants[eventId])
    return (
      <Stack h={100} w={"100%"} align="center" justify="center">
        <Loader />
      </Stack>
    );

  const fisrtItem = pagination.pageIndex * pagination.pageSize + 1;
  const fisrtItemNumber = participants[eventId].length === 0 ? 0 : fisrtItem;
  const lastItem = (pagination.pageIndex + 1) * pagination.pageSize;
  const lastItemNumber =
    lastItem > participants[eventId].length
      ? participants[eventId].length
      : lastItem;

  return (
    <ProtectedPage>
      <Stack>
        {/* Toolbar: Search bar */}
        <Flex justify={"space-between"}>
          <Input
            placeholder="Search participants"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            radius={100}
            rightSection={<IconSearch color={theme.colors.night[5]} />}
            sx={(t) => ({
              maxWidth: "100%",
              [t.fn.largerThan("sm")]: { maxWidth: "35%" },
            })}
          />
          <ExportMenu exportAllRef={expAllBtn} exportRowsRef={expRowsBtn} />
        </Flex>

        {/* Pagination info */}
        <Typography textVariant="body-md">
          Showing {fisrtItemNumber} - {lastItemNumber} participants of total{" "}
          {participants[eventId].length} event participants.
        </Typography>

        {/* Table view */}
        <MantineReactTable
          columns={columns}
          data={participants[eventId]}
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

              // setActiveIndex(row.index);
              // navigate(row.original.id);
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
            const dataFlatter = (rows: EventMember[]) =>
              rows.map((row, i) => {
                const dt = {
                  joinedEventAt: pretyDateTime(row.createdAt.toDate()),
                  ...row.member,
                  ...row,
                } as Partial<EventMember>;
                delete dt.createdAt;
                delete dt.updatedAt;
                delete dt.member;
                delete dt.id;
                return dt;
              });
            return (
              <TablePseudoExportButton
                exportAllRef={expAllBtn}
                exportRowsRef={expRowsBtn}
                onExportAll={(exporter) => {
                  const exportedData = dataFlatter(participants[eventId]);
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
      </Stack>
    </ProtectedPage>
  );
};
