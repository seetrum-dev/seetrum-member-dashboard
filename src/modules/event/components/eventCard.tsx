import { pretyDate } from "@/lib/utils";
import { isMeetingLink, pretyDate } from "@/lib/utils";
import { useFileURLStore } from "@/services/firebase/storage";
import { ScheduledEvent } from "@/types/models/scheduledEvent";
import { Typography } from "@/ui/Typography";
import { Flex, Image, Skeleton, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const EventCard: React.FC<{
  eventData?: ScheduledEvent;
  loading?: boolean;
}> = ({ eventData, loading }) => {
  const getFileURL = useFileURLStore((s) => s.getFileURL);
  const [imageUrl, setImage] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (eventData && eventData.thumbnailFileName && !imageUrl)
      getFileURL(eventData.thumbnailFileName).then((ur) => setImage(ur));
  }, [getFileURL, eventData, imageUrl]);

  const Thumbnail: React.FC<any> = ({
    imageProps,
    sx,
  }: {
    imageProps: any;
    sx?: any;
  }) => (
    <Image
      src={loading ? "" : imageUrl}
      withPlaceholder
      height={220}
      {...imageProps}
      sx={(t) => ({
        overflow: "hidden",
        borderRadius: "8px",
        borderColor: "platinum.2",
        ...(sx && sx(t)),
      })}
    />
  );

  return (
    <Stack
      spacing={0}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        eventData && navigate(`${eventData.id}`);
      }}
      sx={{ cursor: "pointer" }}
    >
      <Flex h={220}>
        <Thumbnail />
      </Flex>
      <Stack spacing={8} py={16} px={4}>
        <Skeleton visible={!eventData}>
          <Typography textVariant="body-md" color="dimmed">
            {eventData ? pretyDate(eventData!.scheduleDateTime.toDate()) : "-"}
          </Typography>
        </Skeleton>
        <Skeleton visible={!eventData}>
          <Typography textVariant="title-md">
            {eventData?.title || "Title events"}
          </Typography>
        </Skeleton>
        <Skeleton visible={!eventData}>
          <Typography textVariant="body-md">
            {eventData
              ? isMeetingLink(eventData.venue)
                ? "Online events"
                : eventData.venue
              : "-"}
          </Typography>
        </Skeleton>
      </Stack>
    </Stack>
  );
};
