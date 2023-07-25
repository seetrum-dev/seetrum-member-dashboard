import { pretyDateTime } from "@/lib/utils";
import { useEventDetail } from "@/modules/event/store/useEventDetail";
import { BackButton } from "@/ui/Button";
import { IconCardHeading, IconClockHistory, IconPeople } from "@/ui/Icons";
import { TabBar, TabbarData } from "@/ui/Tabbar/tabBar";
import { Typography } from "@/ui/Typography";
import { Divider, Flex, Skeleton, Stack, ThemeIcon } from "@mantine/core";
import { Timestamp } from "firebase/firestore";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";

export const ManageEventDetailsLayout = () => {
  const { id } = useParams();
  const { getEvent, event, loading } = useEventDetail();

  useEffect(() => {
    id && getEvent(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Stack sx={{ flex: 1, height: "100%", position: "relative" }}>
      <BackButton to={".."} />
      <Headers
        title={event?.title}
        updatedAt={event?.updatedAt}
        loading={loading}
      />
      <Stack
        pt={8}
        mt={-8}
        sx={{ position: "sticky", top: 60, backgroundColor: "white" }}
      >
        <TabBar data={manageTrainingTabbarData} />
        <Divider />
      </Stack>
      <Stack sx={{ height: "100%" }}>
        <Outlet />
      </Stack>
    </Stack>
  );
};

const manageTrainingTabbarData: TabbarData[] = [
  {
    label: "Event info",
    icon: <IconCardHeading size={24} />,
    value: "info",
  },
  {
    icon: <IconPeople size={24} />,
    label: "Participants",
    value: "participants",
  },
];

const Headers = ({
  title,
  updatedAt,
  loading,
}: {
  title?: string;
  updatedAt?: Timestamp;
  loading?: boolean;
}) => {
  return (
    <Stack spacing={8}>
      <Skeleton visible={loading} w={loading ? "50%" : undefined}>
        <Typography textVariant="headline-lg">{title || "-"}</Typography>
      </Skeleton>
      <Flex align="center">
        <ThemeIcon variant="outline" sx={{ border: "none" }}>
          <IconClockHistory />
        </ThemeIcon>
        <Skeleton visible={loading} w={loading ? 200 : undefined}>
          <Typography textVariant="body-md" color="dimmed">
            {updatedAt ? pretyDateTime(updatedAt.toDate()) : "-"}
          </Typography>
        </Skeleton>
      </Flex>
    </Stack>
  );
};
