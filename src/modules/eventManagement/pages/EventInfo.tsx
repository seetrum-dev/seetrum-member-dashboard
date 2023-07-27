import { Stack } from "@mantine/core";
import { EventThumbnailEditor } from "../components/EventThumbnailEditor";
import { ManageEventGeneralInfo } from "../components/EventGeneralInfo";

export const ManageEventInfo = () => {
  return (
    <Stack spacing={24}>
      {/* Info */}
      <ManageEventGeneralInfo />
      {/* Thumbnail */}
      <EventThumbnailEditor />
    </Stack>
  );
};
