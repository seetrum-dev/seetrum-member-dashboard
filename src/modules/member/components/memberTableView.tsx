import { kRowsPerPageOptions } from "@/lib/constants";
import { mergeObjects, pretyDateTime } from "@/lib/utils";
import { User } from "@/types";
import { ExportMenu, TablePseudoExportButton } from "@/ui/Button/ExportMenu";
import { IconEditSquare } from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import {
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
import { IconSearch } from "@tabler/icons-react";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useMemberStore } from "../store/useSeetrumMembers";

export const MembersTableView = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(
    theme.fn.smallerThan("sm").replace("@media ", "")
  );
  const navigate = useNavigate();

  const { tabId, userId } = useParams();
  const isOrg = tabId?.includes("org") || false;

  const { members: users, organization, getMembers } = useMemberStore();

  useEffect(() => {
    getMembers(isOrg ? "organization" : "individual");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId, getMembers]);

  const members = isOrg ? organization : users;

  const [activeIndex, setActiveIndex] = useState<number>();

  // Search controllers
  const [globalFilter, setGlobalFilter] = useState("");

  // Pagination Controls
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: parseInt(kRowsPerPageOptions[0]),
  });

  // Export ref buttons
  const expAllBtn = useRef<HTMLButtonElement>(null);
  const expRowsBtn = useRef<HTMLButtonElement>(null);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "",
        enableGlobalFilter: false,
      },
      {
        header: "Member Name",
        accessorKey: "name",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Role",
        enableGlobalFilter: false,
        size: 100,
        accessorFn(originalRow) {
          let role: string;
          switch (originalRow.isAdmin) {
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
          data: ["Admin", "Member"] as (string | SelectItem)[] & string,
        },
      },
      {
        header: "Joining at",
        enableGlobalFilter: false,
        accessorKey: "createdAt.toString",
        size: 100,
        accessorFn(originalRow) {
          return Boolean(originalRow.createdAt.toDate());
        },
        Cell(props) {
          return pretyDateTime(props.row.original.createdAt.toDate());
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
              <IconEditSquare />
            </Button>
          );
        },
      },
    ],
    [navigate]
  );

  const orgColumns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "",
        enableGlobalFilter: false,
      },
      {
        header: "Oragnization Name",
        accessorKey: "name",
      },
      {
        header: "Organization Email",
        accessorKey: "email",
      },
      {
        header: "Joining at",
        enableGlobalFilter: false,
        accessorKey: "createdAt.toString",
        size: 100,
        accessorFn(originalRow) {
          return Boolean(originalRow.createdAt.toDate());
        },
        Cell(props) {
          return pretyDateTime(props.row.original.createdAt.toDate());
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
              <IconEditSquare />
            </Button>
          );
        },
      },
    ],
    [navigate]
  );

  if (!members)
    return (
      <Stack h={100} w={"100%"} align="center" justify="center">
        <Loader />
      </Stack>
    );

  // Data calculations
  const fisrtItem = pagination.pageIndex * pagination.pageSize + 1;
  const fisrtItemNumber = members.length === 0 ? 0 : fisrtItem;
  const lastItem = (pagination.pageIndex + 1) * pagination.pageSize;
  const lastItemNumber = lastItem > members.length ? members.length : lastItem;

  return (
    <Stack spacing={isMobile ? 16 : 24}>
      <Flex justify="space-between" gap={16} align="center">
        <Input
          placeholder="Search members"
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
        Showing {fisrtItemNumber} - {lastItemNumber} members of total{" "}
        {members.length} training members.
      </Typography>
      <MantineReactTable
        columns={isOrg ? orgColumns : columns}
        data={members}
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
          const dataFlatter = (rows: User[]) =>
            rows.map((row, i) =>
              isOrg
                ? {
                    id: row.id,
                    "organization name": row.name,
                    email: row.email,
                    address: row.address,
                    phone: row.phoneNumber,
                    ...mergeObjects(row.organization ? [row.organization] : []),
                    "joining at": pretyDateTime(row.createdAt.toDate()),
                  }
                : {
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    role: row.isAdmin ? "admin" : "member",
                    phone: row.phoneNumber,
                    address: row.address,
                    "joining at": pretyDateTime(row.createdAt.toDate()),
                  }
            );

          return (
            <TablePseudoExportButton
              exportAllRef={expAllBtn}
              exportRowsRef={expRowsBtn}
              onExportAll={(exporter) => {
                const exportedData = dataFlatter(members);
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
        opened={Boolean(userId)}
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
