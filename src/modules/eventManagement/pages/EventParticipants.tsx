import { ProtectedPage } from "@/modules/auth/components/ProtectedPage";
import { Stack } from "@mantine/core";

export const ManageEventParticipants = () => {
  return (
    <ProtectedPage>
      <Stack>
        <h1>Participants</h1>
      </Stack>
    </ProtectedPage>
  );
};
