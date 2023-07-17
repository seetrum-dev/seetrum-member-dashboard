import { pretyDateTime } from "@/lib/utils";
import { useEventDetail } from "@/modules/event/store/useEventDetail";
import { Typography } from "@/ui/Typography";
import {
  Box,
  Button,
  Divider,
  Flex,
  Loader,
  Skeleton,
  Stack,
  TypographyStylesProvider,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ManageEventGeneralInfo = () => {
  const [editState, setMode] = useState<"edit" | "view">("view");

  const toggleState = () => setMode(editState === "edit" ? "view" : "edit");

  return (
    <Stack
      p={16}
      pb={20}
      maw={"min(100%, 684px)"}
      sx={(t) => ({
        borderRadius: 16,
        border: "1px solid",
        borderColor: t.fn.rgba(t.colors.night[5], 0.12),
      })}
    >
      <Flex justify="space-between" gap={16}>
        <Typography textVariant="title-lg">General Information</Typography>
        <Button
          onClick={() => {} /* toggleState */}
          radius={8}
          variant={editState === "view" ? "subtle" : "filled"}
        >
          {editState === "edit" ? "Save changes" : "Edit"}
        </Button>
      </Flex>
      {editState === "edit" ? <GeneralInfoEditor /> : <GeneralInfoViewer />}
    </Stack>
  );
};

const GeneralInfoViewer = () => {
  const { id: eventId } = useParams();
  const { event, getEvent } = useEventDetail();
  useEffect(() => {
    if (event?.id === eventId) return;
    eventId && getEvent(eventId);
  }, [eventId]);

  return (
    <Stack>
      <Stack spacing={8}>
        <Typography variant="title-md">Event Title</Typography>
        <Skeleton visible={event === undefined} w={event ? "100%" : "45%"}>
          <Typography>{event?.title || "-"}</Typography>
        </Skeleton>
      </Stack>
      <Divider />
      <Flex gap={16}>
        <Stack spacing={8} miw={150} sx={{ flex: 1 }}>
          <Typography textVariant="title-md">Date & Time</Typography>
          <Skeleton visible={event === undefined} w={event ? "100%" : "70%"}>
            <Typography>
              {event ? pretyDateTime(event.scheduleDateTime.toDate()) : "-"}
            </Typography>
          </Skeleton>
        </Stack>
        <Stack spacing={8} miw={150} sx={{ flex: 1 }}>
          <Typography textVariant="title-md">Venue</Typography>
          <Skeleton visible={event === undefined} w={event ? "100%" : "70%"}>
            <Typography>{event?.venue ?? "-"}</Typography>
          </Skeleton>
        </Stack>
        <Stack spacing={8} miw={150} sx={{ flex: 1 }}>
          <Typography textVariant="title-md">Organizer</Typography>
          <Skeleton visible={event === undefined} w={event ? "100%" : "70%"}>
            <Typography>{event?.organizer ?? "-"}</Typography>
          </Skeleton>
        </Stack>
      </Flex>
      <Divider />
      <Stack>
        <Typography variant="title-md">Description</Typography>
        {event ? (
          <TypographyStylesProvider>
            <Box
              component="div"
              dangerouslySetInnerHTML={{ __html: event?.description || "-" }}
            />
          </TypographyStylesProvider>
        ) : (
          <Stack h={100} w="100%" justify="center" align="center">
            <Loader />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

const GeneralInfoEditor = () => {
  return <Stack></Stack>;
};
