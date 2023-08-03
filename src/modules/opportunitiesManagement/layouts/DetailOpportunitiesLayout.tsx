import { pretyDateTime } from "@/lib/utils";
import { useTrainings } from "@/modules/trainings/store/useTrainings";
import { Training } from "@/types/models/training";
import { BackButton } from "@/ui/Button";
import {
  IconCardHeading,
  IconClockHistory,
  IconGear,
  IconPeople,
} from "@/ui/Icons";
import { TabBar, TabbarData } from "@/ui/Tabbar/tabBar";
import { Typography } from "@/ui/Typography";
import { Flex, Skeleton, Stack, ThemeIcon } from "@mantine/core";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

export const ManageDetailOpportunitiesLayout = () => {
  const { id } = useParams();
  const { getTrainingsById } = useTrainings((s) => ({
    getTrainingsById: s.getTrainingsById,
  }));
  const [training, setTraining] = useState<Training | undefined>();

  useEffect(() => {
    if (id) {
      getTrainingsById(id).then((t) => setTraining(t ? t : undefined));
    }
  }, [id, setTraining, getTrainingsById]);

  return (
    <Stack sx={{ flex: 1, height: "100%", position: "relative" }}>
      <Stack spacing={0}>
        <BackButton to={".."} />
        <Header updatedAt={training?.updatedAt} title={training?.title} />
      </Stack>
      <Stack sx={{ height: "100%" }}>
        <Outlet />
      </Stack>
    </Stack>
  );
};

const manageOpportunitiesTabbarData: TabbarData[] = [
  {
    label: "Opportunities info",
    icon: <IconCardHeading size={24} />,
    value: "info",
  },
  {
    icon: <IconPeople size={24} />,
    label: "Applicants",
    value: "applicants",
  },
  {
    icon: <IconGear size={24} />,
    label: "Settings",
    value: "settings",
  },
];

interface HeaderProps {
  updatedAt?: Timestamp;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ updatedAt, title }) => {
  if (!title || !updatedAt) {
    return (
      <Stack mx={-20} px={20}>
        <Skeleton h={47} w="60%" />
        <Skeleton h={26} w="25%" />
        <TabBar data={manageOpportunitiesTabbarData} />
      </Stack>
    );
  }

  return (
    <Stack
      mx={-20}
      px={20}
      sx={(t) => ({
        zIndex: 20,
        background: "white",
        position: "sticky",
        top: -32,
      })}
      spacing={0}
    >
      <Stack>
        <Typography textVariant="headline-lg">{title}</Typography>
        <Flex align={"center"} gap={4}>
          <ThemeIcon variant="outline" sx={{ border: "none" }}>
            <IconClockHistory />
          </ThemeIcon>
          <Typography textVariant="body-lg" color="dimmed">
            Last modified on {pretyDateTime(updatedAt.toDate())}
          </Typography>
        </Flex>
      </Stack>
      <TabBar data={manageOpportunitiesTabbarData} />
    </Stack>
  );
};
