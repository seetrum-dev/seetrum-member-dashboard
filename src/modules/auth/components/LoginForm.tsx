import { routePaths } from "@/routes";
import { Typography } from "@/ui/Typography";
import {
  Anchor,
  Button,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useMediaQuery } from "@mantine/hooks";

export const LoginForm: React.FC = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { redirectTo } = state || {};
  const isExtraSmallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.xs})`
  );

  const [loading, setLoading] = React.useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Provide a valid email address"),
      password: hasLength(
        { min: 6 },
        "Provide a valid password (minimum of 6 character)"
      ),
    },
  });

  const logIn = useAuthStore((state) => state.logIn);

  const handleSubmit = form.onSubmit(async (values) => {
    const { email, password } = values;
    setLoading(true);
    await logIn(email, password);
    if (redirectTo && redirectTo !== "/") navigate(redirectTo);
    setLoading(false);
  });

  return (
    <Flex
      h="100%"
      justify="center"
      align={isExtraSmallScreen ? "flex-start" : "center"}
      pt={isExtraSmallScreen ? 64 : 0}
    >
      <Paper w={400} mx={16}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={24}>
            {/* <BackButton to={"https://seetrum.id"} /> */}
            <Typography textVariant="headline-lg">Sign In</Typography>
            <Typography textVariant="body-lg">
              Welcome back! Sign in to your Seetrum account and stay up-to-date
              on the latest in energy efficiency.
            </Typography>
            <TextInput
              radius="md"
              type="email"
              label="Email"
              autoFocus
              placeholder="Enter your email"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              radius="md"
              label="Password"
              placeholder="Enter your password"
              {...form.getInputProps("password")}
            />
            <Button loading={loading} radius="md" size="md" type="submit">
              Sign In
            </Button>
            <Typography textVariant="body-md">
              Don&apos;t have an account yet?{" "}
              <Link to={routePaths.REGISTER_OPTION} state={{ redirectTo }}>
                <Anchor component="button">Register now</Anchor>
              </Link>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Flex>
  );
};
