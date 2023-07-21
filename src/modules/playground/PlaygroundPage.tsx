import { COLLECTION_USERS } from "@/lib/constants";
import { ProtectedPage } from "@/modules/auth/components/ProtectedPage";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import { getDocumentsByQuery } from "@/services/firebase/helper";
import { User } from "@/types";
import { FileInfo } from "@/types/models/fileInfo";
import {
  fileRequirementDummy,
  fileRequirementImageDummy,
} from "@/types/models/training";
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import React, { useState } from "react";
import { FileUploadButton } from "../../ui/Button/FileUploadButton";
import { EventMemberPlayground, EventPlayground } from "./EventPlayground";
import { FormPlayground } from "./FormPlayground";
import {
  TrainingMemberPlayground,
  TrainingPlayground,
} from "./TrainingPlayground";
import { UserPlayground } from "./UserPlayground";

export const PlaygroundPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const logOut = useAuthStore((state) => state.logOut);
  const [fileInfo, setFileInfo] = useState<FileInfo>();
  const [fileInfoImg, setFileInfoImg] = useState<FileInfo>();

  const getUsersClick = async () => {
    const users = await getAllUsers();

    console.log(users.map((u) => u.name).join(";"));
  };
  return (
    <ProtectedPage>
      <Container>
        <Stack>
          <Flex
            sx={{ borderBottom: "1px solid gray" }}
            p={"sm"}
            justify={"space-between"}
            align={"center"}
          >
            <Group>
              <Text>Login as {user && user.email + " " + user.id}</Text>
              {isAdmin && <Badge>Admin</Badge>}
            </Group>
            <Button onClick={logOut} variant="outline">
              Logout
            </Button>
          </Flex>
          <Button onClick={getUsersClick}>Get all user</Button>
          <Divider />
          <TrainingPlayground />
          <Divider />
          <UserPlayground />
          <TrainingMemberPlayground />
          <EventPlayground />
          <EventMemberPlayground />
          <FormPlayground />
          <Box>
            <pre>{JSON.stringify(fileInfo, null, 2)}</pre>
            <FileUploadButton
              value={fileInfo}
              onFileChange={setFileInfo}
              {...fileRequirementDummy}
            />
          </Box>
          <Box>
            <pre>{JSON.stringify(fileInfoImg, null, 2)}</pre>
            <FileUploadButton
              value={fileInfoImg}
              onFileChange={setFileInfoImg}
              {...fileRequirementImageDummy}
            />
          </Box>
        </Stack>
      </Container>
    </ProtectedPage>
  );
};

const getAllUsers = async () => {
  try {
    const users = await getDocumentsByQuery<User>(COLLECTION_USERS);
    return users;
  } catch (e) {
    console.error(e);
    return [];
  }
};
