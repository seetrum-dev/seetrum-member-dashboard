import { displayEventDate, isMeetingLink } from "@/lib/utils";
import { useFileURLStore } from "@/services/firebase/storage";
import { ScheduledEvent } from "@/types/models/scheduledEvent";
import { Typography } from "@/ui/Typography";
import { Badge, Flex, Image, Skeleton, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const EventCard: React.FC<{
  eventData?: ScheduledEvent;
  loading?: boolean;
  isRegistered?: boolean;
}> = ({ eventData, loading, isRegistered }) => {
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
      <Flex h={220} sx={{ position: "relative" }}>
        {isRegistered && (
          <Badge
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 1,
              boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.12)",
              textTransform: "capitalize",
            }}
          >
            Joined
          </Badge>
        )}
        <Thumbnail />
      </Flex>
      <Stack spacing={8} py={16} px={4}>
        <Skeleton visible={!eventData}>
          <Typography textVariant="body-md" color="dimmed">
            {eventData
              ? displayEventDate(
                  eventData.scheduleDateTime.toDate(),
                  eventData.scheduleEndDateTime?.toDate()
                )
              : "-"}
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
