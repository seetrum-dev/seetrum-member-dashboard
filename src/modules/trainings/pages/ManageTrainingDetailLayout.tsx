import { Divider, Flex, Skeleton, Stack, ThemeIcon } from "@mantine/core";
import { Timestamp } from "firebase/firestore";
import { Outlet, useParams } from "react-router-dom";
import { useTrainings } from "../store/useTrainings";
import { useEffect, useState } from "react";
import { Training } from "@/types/models/training";
import { Typography } from "@/ui/Typography";
import { pretyDateTime } from "@/lib/utils";
import { IconAdminAward, IconClockHistory } from "@/ui/Icons";
import { TabBar, TabbarData } from "@/ui/Tabbar/tabBar";

export const ManageDetailTrainingLayout = () => {
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
      <Header updatedAt={training?.updatedAt} title={training?.title} />
      <Stack sx={{ height: "100%" }}>
        <Outlet />
      </Stack>
    </Stack>
  );
};

const manageTrainingTabbarData: TabbarData[] = [
  {
    label: "Training info",
    icon: <IconAdminAward size={24} />,
    value: "info",
  },
  {
    icon: <IconAdminAward size={24} />,
    label: "Applicants",
    value: "applicants",
  },
  {
    icon: <IconAdminAward size={24} />,
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
        <TabBar data={manageTrainingTabbarData} />
        <Divider />
      </Stack>
    );
  }

  return (
    <Stack
      mx={-20}
      px={20}
      sx={(t) => ({
        background: "white",
        position: "sticky",
        top: -32,
      })}
    >
      <Typography textVariant="headline-lg">{title}</Typography>
      <Flex align={"center"} gap={4}>
        <ThemeIcon variant="outline" sx={{ border: "none" }}>
          <IconClockHistory />
        </ThemeIcon>
        <Typography textVariant="body-lg" color="dimmed">
          Last modified on {pretyDateTime(updatedAt.toDate())}
        </Typography>
      </Flex>
      <TabBar data={manageTrainingTabbarData} />
      <Divider />
    </Stack>
  );
};
