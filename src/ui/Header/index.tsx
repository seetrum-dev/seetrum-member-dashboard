import { logoHorizontalUrl } from "@/lib/assets";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import {
  Box,
  Burger,
  Button,
  Flex,
  Header as MantineHeader,
  MediaQuery,
  useMantineTheme,
} from "@mantine/core";
import React from "react";

interface Props {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  withoutNavigation?: boolean;
}

export const Header: React.FC<Props> = ({
  opened,
  setOpened,
  withoutNavigation = false,
}) => {
  const theme = useMantineTheme();
  const logOut = useAuthStore((state) => state.logOut);

  return (
    <MantineHeader height={60} p="xs">
      <Flex justify={"space-between"} align={"center"}>
        <Box
          sx={{
            height: "30px",
            img: {
              height: "100%",
            },
          }}
        >
          {!withoutNavigation && (
            <MediaQuery largerThan="md" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
          )}
          <a href="https://seetrum.id">
            <img src={logoHorizontalUrl} alt={"seetrum logo"} />
          </a>
        </Box>
        <Button onClick={() => logOut()}>Log out</Button>
      </Flex>
    </MantineHeader>
  );
};
