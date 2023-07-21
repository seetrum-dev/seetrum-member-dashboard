import { User } from "@/types";
import { Typography } from "@/ui/Typography";
import { showErrorNotif } from "@/ui/notifications";
import { Button, Group, Paper, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { getUserById } from "../auth/services/authService";
import { getAllUsers } from "../user/services/userService";
import { ExportToCsv } from "export-to-csv";

export const UserPlayground: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    filename: "users-" + Date.now(),
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
  };

  const csvExporter = new ExportToCsv(options);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  const handleGetById = async () => {
    setLoading(true);
    try {
      const res = await getUserById(value);
      if (!res) throw Error("no user");
      setUsers([res]);
    } catch (e) {
      showErrorNotif({ message: "Cannot fetch user" });
    }
    setLoading(false);
  };

  const handleGetAll = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      if (!res) throw Error("no user");
      setUsers(res);
    } catch (e) {
      showErrorNotif({ message: "Cannot fetch user" });
    }
    setLoading(false);
  };

  const handleExport = () => {
    if (users.length === 0) return;
    const formatted = users.map((u) => ({
      ...u,
      // update createdAt and updatedAt to string for csv format of yyyy-mm-dd
      isAdmin: !!u.isAdmin,
      createdAt: u.createdAt?.toDate().toISOString().split("T")[0],
      updatedAt: u.updatedAt?.toDate().toISOString().split("T")[0],
      // createdAt: u.createdAt?.toDate().toLocaleString(),
      // updatedAt: u.updatedAt?.toDate().toLocaleString(),
    }));
    csvExporter.generateCsv(formatted);
  };

  return (
    <Paper withBorder p="xs">
      <Typography textVariant="title-lg">User</Typography>
      <Stack>
        <TextInput label="input" value={value} onChange={handleChange} />
        <Group>
          <Button onClick={handleGetAll} loading={loading}>
            Get All user
          </Button>
          <Button onClick={handleGetById} loading={loading}>
            Get user by id
          </Button>
          <Button color="green" onClick={handleExport} loading={loading}>
            Export
          </Button>
          <Button ml="auto" color="red" onClick={() => setUsers([])}>
            Clear
          </Button>
        </Group>
        <pre>{JSON.stringify(users, null, 2)}</pre>
      </Stack>
    </Paper>
  );
};
