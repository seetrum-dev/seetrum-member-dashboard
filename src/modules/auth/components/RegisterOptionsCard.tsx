import { routePaths } from "@/routes";
import { IconArrowRight, IconPeople, IconPerson } from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import {
  Anchor,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const RegisterOptionsCard: React.FC = () => {
  const theme = useMantineTheme();
  const { state: locationState } = useLocation();
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const isExtraSmallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.xs})`
  );
  return (
    <Paper
      maw={640}
      mt={120}
      px={16}
      pb={"xl"}
      mx={"auto"}
      sx={{ boxSizing: "content-box" }}
    >
      <Stack spacing={40}>
        <Stack spacing={12}>
          <Typography textVariant="headline-lg">
            Ready to build sustainable future for Indonesia?
          </Typography>
          <Typography textVariant="body-lg" c="dimmed">
            Register now and become part of the Seetrum community, where you can
            connect with like-minded individuals and help build a more
            sustainable future through energy efficiency
          </Typography>
        </Stack>
        <SimpleGrid cols={isExtraSmallScreen ? 1 : 2} spacing={24}>
          <RegisterCard userType="individual" />
          <RegisterCard userType="organization" />
        </SimpleGrid>
        <Typography
          textVariant="body-md"
          align={isSmallScreen && !isExtraSmallScreen ? "center" : "left"}
        >
          Already have an account?{" "}
          <Link to={routePaths.SIGNIN} state={locationState}>
            <Anchor component="button">Sign in now</Anchor>
          </Link>
        </Typography>
      </Stack>
    </Paper>
  );
};

export const RegisterOptionsAltCard: React.FC = () => {
  const theme = useMantineTheme();
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
  return (
    <Paper maw={630} p={40}>
      <Stack spacing={8}>
        <Typography textVariant="headline-lg">
          Ready to build sustainable future for Indonesia?
        </Typography>
        <Typography textVariant="body-lg" c="dimmed">
          Register now and become part of the Seetrum community, where you can
          connect with like-minded individuals and help build a more sustainable
          future through energy efficiency
        </Typography>
      </Stack>
      <SimpleGrid cols={isSmallScreen ? 1 : 2} mt={40}>
        <RegisterCard userType="individual" />
        <RegisterCard userType="organization" />
      </SimpleGrid>
    </Paper>
  );
};

interface Props {
  userType: "individual" | "organization";
}

const RegisterCard: React.FC<Props> = ({ userType }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const registerCopy = {
    individual: {
      logo: <IconPerson />,
      title: "Join as individual",
      description:
        "Join our community of diverse voices, innovative individuals, and big ideas to make a difference in energy efficiency",
      linkTo: `${routePaths.REGISTER}?userType=individual`,
    },
    organization: {
      logo: <IconPeople />,
      title: "Join as organization",
      description:
        "Collaborate with us to promote sustainability and drive the energy efficiency ecosystem forward in Indonesia as an organization",
      linkTo: `${routePaths.REGISTER}?userType=organization`,
    },
  };

  const { title, description, linkTo, logo } = registerCopy[userType];
  const handleClick = () => {
    navigate(linkTo, { state });
  };
  return (
    <Paper
      onClick={handleClick}
      withBorder
      p={24}
      h={308}
      radius="xs"
      sx={(theme) => ({
        cursor: "pointer",
        ":hover": {
          boxShadow: theme.shadows.sm,
        },
      })}
    >
      <Stack h={"100%"} justify="space-between">
        <Stack spacing={12}>
          <Flex gap="xs" align={"center"}>
            {logo}
            <Typography textVariant="title-lg">{title}</Typography>
          </Flex>
          <Typography c="dimmed" textVariant="body-md">
            {description}
          </Typography>
        </Stack>
        <Group position="right">
          <IconArrowRight />
        </Group>
      </Stack>
    </Paper>
  );
};
