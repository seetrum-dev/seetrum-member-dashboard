import { ProtectedPage } from "@/modules/auth/components/ProtectedPage";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import {
  addNewDocument,
  getAllDocuments,
  getDocumentsByQuery,
} from "@/services/firebase/helper";
import {
  Box,
  Button,
  Container,
  List,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { where } from "firebase/firestore";
import React from "react";
import { FileManagerPlayground } from "./FileManagerPlayground";
import { trainingModelDummy } from "@/types/models/training";

const EXAMPLE_SCIENTIST = {
  firts: "ETH",
  last: "Lovelace",
  born: 1910,
};

export const PlaygroundPage: React.FC = () => {
  const [science, setScience] = React.useState<any[]>([]);
  const user = useAuthStore((state) => state.user);
  const logOut = useAuthStore((state) => state.logOut);

  const addDocument = async () => {
    try {
      const doc = await addNewDocument("scientist", EXAMPLE_SCIENTIST);
      console.log(doc);
    } catch (e) {
      alert("error adding document, see console");
      console.error(e);
    }
  };

  const getScientist = async () => {
    try {
      const scientists = await getAllDocuments("users");

      setScience(scientists);
    } catch (error) {}
  };

  const getScientistAfter19 = async () => {
    try {
      const scientists = await getDocumentsByQuery(
        "scientist",
        where("born", ">=", 1900)
      );

      setScience(scientists);
    } catch (error) {}
  };

  return (
    <ProtectedPage>
      <Container>
        <Stack>
          <Text>
            <pre>Login as {user && user.email}</pre>
          </Text>
          <Paper
            withBorder
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
            }}
          >
            {user &&
              Object.entries(user).map(([key, value]) =>
                key === "organization" ||
                key === "createdAt" ||
                key === "updatedAt" ? (
                  <InfoSummary
                    key={key}
                    label={key}
                    value={JSON.stringify(value, null, 2)}
                  />
                ) : (
                  <InfoSummary key={key} label={key} value={value} />
                )
              )}
            {/* {user && user.createdAt && (
              <InfoSummary label="createdAt" value={"date"} />
            )} */}
          </Paper>
          <FileManagerPlayground />
          <pre>{JSON.stringify(trainingModelDummy, null, 2)}</pre>
          <Stack>
            <Text>Sample Actions:</Text>
            <SimpleGrid cols={3}>
              <Button onClick={logOut}>Logout</Button>
              <Button onClick={addDocument}>add document</Button>
              <Button onClick={getScientist}>get all documents</Button>
              <Button onClick={getScientistAfter19}>
                get all documents with filter
              </Button>
            </SimpleGrid>
          </Stack>
          <List>
            {science.map((s) => (
              <List.Item key={s.id}>{JSON.stringify(s, null, 2)}</List.Item>
            ))}
          </List>
        </Stack>
      </Container>
    </ProtectedPage>
  );
};

interface InfoSummaryProps {
  label: string;
  value?: any;
}

const InfoSummary: React.FC<InfoSummaryProps> = ({ label, value = "-" }) => {
  return (
    <Box px="sm">
      <Text size="md" weight={"bold"}>
        {label}
      </Text>
      <Text c="dimmed" size="md">
        {value || "empty"}
      </Text>
    </Box>
  );
};