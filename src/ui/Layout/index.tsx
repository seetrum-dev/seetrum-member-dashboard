import { DEFAULT_TITLE } from "@/lib/constants";
import { Header } from "../Header";

import { extractInitials } from "@/lib/utils";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import {
  AppShell,
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Loader,
  Navbar,
  UnstyledButton,
  rem,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { IconChevronRight, IconWhatsapp } from "../Icons";
import { Typography } from "../Typography";
import { MainLinks } from "./MainLinks";
import { Outlet } from "react-router-dom";
import { ProtectedPage } from "@/modules/auth/components/ProtectedPage";

export const MainLayout = ({ title = DEFAULT_TITLE }) => {
  const [opened, setOpened] = React.useState(false);

  return (
    <AppShell
      padding="lg"
      navbarOffsetBreakpoint={"md"}
      navbar={
        <Navbar
          hiddenBreakpoint={"md"}
          hidden={!opened}
          width={{ sm: 256, lg: 300 }}
          p="sm"
        >
          <Navbar.Section grow mt="xs">
            <MainLinks
              onNavigate={() => {
                setOpened(false);
              }}
            />
          </Navbar.Section>
          <ContactCard />
          <Navbar.Section>
            <User />
          </Navbar.Section>
        </Navbar>
      }
      header={<Header opened={opened} setOpened={setOpened} />}
    >
      <ProtectedPage>
        <Box sx={{ position: "relative", height: "100%" }}>
          <Outlet />
        </Box>
      </ProtectedPage>
    </AppShell>
  );
};

export const User: React.FC<any> = (props) => {
  const theme = useMantineTheme();
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <Flex
        sx={{
          height: 60,
          paddingTop: theme.spacing.sm,
          borderTop: `${rem(1)} solid ${theme.colors.gray[2]}`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </Flex>
    );
  }

  const { name, email } = user;

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `${rem(1)} solid ${theme.colors.gray[2]}`,
      }}
    >
      <UnstyledButton
        sx={{
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.md,
          color: theme.black,

          "&:hover": {
            backgroundColor: theme.colors.gray[0],
          },
        }}
      >
        <Group>
          <Avatar
            // src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
            radius="xl"
            color="cyan"
          >
            {extractInitials(name)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography textVariant="label-lg">{name}</Typography>
            <Typography textVariant="body-sm" color="dimmed">
              {email}
            </Typography>
          </Box>

          <IconChevronRight size={rem(18)} />
        </Group>
      </UnstyledButton>
    </Box>
  );
};

export const ContactCard = () => {
  return (
    <Flex
      p={12}
      pt={16}
      mb={12}
      gap={4}
      bg={"platinum.1"}
      direction="column"
      sx={{ borderRadius: 16 }}
    >
      <Typography textVariant="title-md">Need Assistance?</Typography>
      <Typography textVariant="body-md" mb={12}>
        Our team is here to help! Click here to contact us directly on WhatsApp.
      </Typography>
      <Button
        component="a"
        variant="outline"
        radius={"md"}
        target="_blank"
        sx={(theme) => ({ borderColor: theme.colors.gray[4] })}
        href="https://wa.me/6285175016649"
      >
        <IconWhatsapp size={18} />
        <Typography px={8} textVariant="label-lg">
          Contact us
        </Typography>
      </Button>
    </Flex>
  );
};
