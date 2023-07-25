import { ProtectedPage } from "@/modules/auth/components/ProtectedPage";
import { IconBuliding, IconPerson } from "@/ui/Icons";
import { TabBar, TabbarData } from "@/ui/Tabbar/tabBar";
import { Typography } from "@/ui/Typography";
import { Stack } from "@mantine/core";
import { Outlet } from "react-router-dom";

const tabData: TabbarData[] = [
  {
    icon: <IconPerson size={24} />,
    label: "Individual",
    value: "individual",
  },
  {
    icon: <IconBuliding size={24} />,
    label: "Organization",
    value: "organization",
  },
];

export const MemberListPage = () => {
  return (
    <ProtectedPage>
      <Stack sx={{ flex: 1, height: "100%", position: "relative" }}>
        <Stack
          mx={-20}
          px={20}
          sx={(t) => ({
            zIndex: 20,
            background: "white",
            position: "sticky",
            top: 8,
          })}
          spacing={0}
        >
          <Typography textVariant="headline-lg">Manage Members</Typography>
          <TabBar data={tabData} />
        </Stack>
        <Stack sx={{ height: "100%" }}>
          <Stack h="250vh">
            <Outlet />
          </Stack>
        </Stack>
      </Stack>
    </ProtectedPage>
  );
};
