import { isMeetingLink, pretyDateTime } from "@/lib/utils";
import { ProtectedPage } from "@/modules/auth/components/ProtectedPage";
import { useFileURLStore } from "@/services/firebase/storage";
import { BackButton } from "@/ui/Button";
import { Typography } from "@/ui/Typography";
import {
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Skeleton,
  Stack,
  TypographyStylesProvider,
} from "@mantine/core";
import { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEventDetail } from "../store/useEventDetail";
import { useEventMemberList } from "../store/useEventMemberList";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import { showErrorNotif } from "@/ui/notifications";
import { Timestamp } from "firebase/firestore";

export const EventDetailPage: React.FC = () => {
  const { id: eventId } = useParams();
  const { user } = useAuthStore();
  const { event, loading, getEvent } = useEventDetail();
  const { getEventMembers, getByEventId, memberId } = useEventMemberList();
  const eventMember = eventId ? getByEventId(eventId) : undefined;
  const isOnlineEvent = () =>
    event?.venue !== undefined ? isMeetingLink(event.venue) : undefined;

  useEffect(() => {
    if (user && (!memberId || memberId !== user.id))
      getEventMembers && user && getEventMembers(user.id);
  }, [memberId, user, getEventMembers]);

  useEffect(() => {
    if (eventId && getEvent) getEvent(eventId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const getFileURL = useFileURLStore((s) => s.getFileURL);
  const [imageUrl, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (event && event.thumbnailFileName && !imageUrl)
      getFileURL(event.thumbnailFileName).then((ur) => setImage(ur));
  }, [getFileURL, event, imageUrl]);

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
      height={300}
      maw={300}
      {...imageProps}
      sx={(t) => ({
        maxHeight: "fit-content",
        height: 300,
        overflow: "hidden",
        borderRadius: "8px",
        borderColor: t.colors.platinum[2],
        [t.fn.smallerThan("sm")]: { minWidth: "100%" },
        ...(sx && sx(t)),
      })}
    />
  );

  return (
    <ProtectedPage>
      <Stack spacing={24}>
        <BackButton to={".."} label={"Back to all events"} />
        <Flex
          gap={24}
          sx={(t) => ({
            flexDirection: "column",
            [t.fn.largerThan("sm")]: { flexDirection: "row" },
          })}
        >
          {/* Thumnail */}
          <Thumbnail />

          {/* Content event detail */}
          <Stack sx={{ flex: 1 }}>
            <Skeleton visible={loading} maw={loading ? "60%" : "100%"}>
              <Typography textVariant="headline-lg">
                {event?.title || "-"}
              </Typography>
            </Skeleton>
            {/* Other details */}
            <Stack spacing={16}>
              <EventDataField
                label="Date & Time"
                data={event && pretyDateTime(event.scheduleDateTime.toDate())}
              />
              <EventDataField
                label="Venue"
                loading={!Boolean(event)}
                data={
                  <MamberOnlyData
                    data={event && event.venue}
                    protectedLabel="Venue location will be displayed upon your registration"
                    isProtected={isOnlineEvent() && !Boolean(eventMember)}
                  />
                }
              />
              <EventDataField
                label="Organized by"
                data={event && event.organizer}
              />
            </Stack>
            {/* Description */}
            <Stack spacing={8}>
              <Typography textVariant="label-lg">Description</Typography>
              <TypographyStylesProvider>
                {event ? (
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: event?.description || "",
                    }}
                  />
                ) : (
                  <Stack>
                    <Skeleton width="90%" height={18} />
                    <Skeleton width="95%" height={18} />
                    <Skeleton width="87%" height={18} />
                    <Skeleton width="40%" height={18} />
                  </Stack>
                )}
              </TypographyStylesProvider>
            </Stack>
            {/* Add to calendar section */}
            <AddToCalendar isRegistered={Boolean(eventMember)} />
          </Stack>
        </Flex>
      </Stack>
    </ProtectedPage>
  );
};

const EventDataField: React.FC<{
  label: string;
  data?: string | ReactNode;
  loading?: boolean;
}> = ({ label, data, loading }) => {
  return (
    <Flex
      gap={16}
      rowGap={4}
      sx={(t) => ({ [t.fn.smallerThan("sm")]: { flexDirection: "column" } })}
    >
      <Typography miw={120} textVariant="label-lg">
        {label}
      </Typography>
      <Skeleton
        visible={!data || loading === true}
        sx={(t) => ({
          width: !data || loading === true ? "30%" : "100%",
          [t.fn.smallerThan("sm")]: { width: "100%" },
        })}
      >
        <Typography sx={{ flex: 1 }} textVariant="body-md">
          {loading ? "-" : !data ? "-" : data}
        </Typography>
      </Skeleton>
    </Flex>
  );
};

const AddToCalendar: React.FC<{ isRegistered?: boolean }> = ({
  isRegistered,
}) => {
  const { id: eventId } = useParams();
  const { user } = useAuthStore();
  const { joinEvent } = useEventMemberList();
  const { event, getEvent } = useEventDetail();

  useEffect(() => {
    eventId && getEvent(eventId);
  }, [getEvent, eventId]);

  const handleAddToCalendar = () => {
    if (!event) return;
    const timeStampFormater = (time: Timestamp): string =>
      time
        .toDate()
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/g, "");

    const endTime = event.scheduleDateTime.toDate();
    endTime.setSeconds(3600 * 3);

    const uri = new URL(
      `https://calendar.google.com/calendar/r/eventedit?&text=${
        event.title
      }&dates=${timeStampFormater(event.scheduleDateTime)}/${timeStampFormater(
        Timestamp.fromDate(endTime) // TODO: change to end of event schedule date
      )}&details=${event.description}&ctz=${"Asia/Jakarta"}&location=${
        event.venue
      }&sf=true&output=xml`
    );

    window.open(uri.toString(), "_blank");
  };
  const handleRegister = async () => {
    if (eventId && user)
      try {
        await joinEvent(eventId, user);
      } catch (error) {
        console.error(error);
        showErrorNotif({ title: "Could not join event" });
      }
  };
  return (
    <Stack
      maw={621}
      spacing={16}
      sx={(t) => ({
        border: isRegistered ? "none" : "1px solid",
        borderColor: t.fn.rgba(t.colors.night[5], 0.12),
        borderRadius: 8,
        padding: 16,
        backgroundColor: isRegistered ? t.colors.moonstone[0] : "transparent",
        [t.fn.smallerThan("sm")]: { flexDirection: "column" },
      })}
    >
      <Typography sx={{ flex: 1 }} textVariant="body-lg">
        {isRegistered
          ? "You have already registered for this event."
          : "Interested in joining this event?"}
      </Typography>
      <Flex gap={16} wrap={"wrap"}>
        {event?.whatsappLink && (
          <Button
            radius={8}
            onClick={(e) => window.open(event.whatsappLink, "_blank")}
          >
            Join event Whatsapp group
          </Button>
        )}
        <Button
          sx={{ borderRadius: 8 }}
          onClick={isRegistered ? handleAddToCalendar : handleRegister}
          variant={event?.whatsappLink ? "outline" : "filled"}
        >
          {isRegistered ? "Add event to Google Calendar" : "Join now for free"}
        </Button>
      </Flex>
    </Stack>
  );
};

const MamberOnlyData: React.FC<{
  protectedLabel: string | ReactNode;
  data: string | ReactNode;
  isProtected?: boolean;
}> = ({ protectedLabel, data, isProtected }) => {
  if (isProtected)
    return (
      <Badge
        sx={(t) => ({
          backgroundColor: t.colors.platinum[2],
          color: "InfoText",
          textTransform: "initial",
        })}
      >
        {protectedLabel}
      </Badge>
    );
  return <>{data}</>;
};
