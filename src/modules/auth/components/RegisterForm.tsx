import { kProvinsi } from "@/lib/constants";
import { routePaths } from "@/routes";
import { UserRegistrationData, UserType } from "@/types";
import { BackButton } from "@/ui/Button";
import { Typography } from "@/ui/Typography";
import {
  Box,
  Button,
  Group,
  Paper,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Timeline,
  useMantineTheme,
} from "@mantine/core";
import {
  isEmail,
  isNotEmpty,
  matches,
  matchesField,
  useForm,
} from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

type OrganizationFlat = {
  org_industry: string;
  org_pic_name: string;
  org_pic_phone_number: string;
  org_pic_email: string;
};

type RegisterFormData = UserRegistrationData &
  OrganizationFlat & { confirmPassword: string };

const userTypeCopy = {
  individual: {
    email: "Individual email",
    name: "Full name",
    account: "account",
  },
  organization: {
    email: "Organization email",
    name: "Organization name",
    account: "organization",
  },
};

export const RegisterForm: React.FC = () => {
  const theme = useMantineTheme();
  const isExtraSmallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.xs})`
  );

  const [active, setActive] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const [searchParams] = useSearchParams();
  const userType: UserType =
    searchParams.get("userType") === "organization"
      ? "organization"
      : "individual";

  const isOrganization = userType === "organization";
  const registerInitialValue: RegisterFormData = {
    name: "",
    email: "",
    address: "",
    informationChannel: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    userType,
    motivationToJoin: "",
    org_industry: "",
    org_pic_name: "",
    org_pic_email: "",
    org_pic_phone_number: "",
  };

  const form = useForm({
    initialValues: registerInitialValue,
    validate: (values) => {
      const {
        name,
        email,
        userType,
        phoneNumber,
        password,
        confirmPassword,
        address,
        org_industry,
        informationChannel,
        org_pic_email,
        org_pic_name,
        org_pic_phone_number,
      } = values;
      if (active === 0) {
        return {
          userType: isNotEmpty("Jenis anggota harus diisi")(userType),
          email: isEmail("Provide valid email address")(email),
          password:
            password.length < 6
              ? "Password needs a minimum of 6 character"
              : null,
          confirmPassword: matchesField(
            "password",
            "Password confirmation is different"
          )(confirmPassword, values),
        };
      }

      if (active === 1) {
        return {
          name: isNotEmpty("Name can't be empty")(name),
          phoneNumber: matches(
            /^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/,
            "Provide valid phone number"
          )(phoneNumber),
          address: isNotEmpty("Address can't be empty")(address),
          informationChannel: isNotEmpty(
            "Please tell us where do you hear about us"
          )(informationChannel),
          org_industry:
            isOrganization &&
            isNotEmpty("Industry can't be empty")(org_industry),
        };
      }

      if (active === 2) {
        return {
          org_pic_email: isEmail("Provide valid email address")(org_pic_email),
          org_pic_name: isNotEmpty("Name can't be empty")(org_pic_name),
          org_pic_phone_number: matches(
            /^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/,
            "Provide valid phone number"
          )(org_pic_phone_number),
        };
      }

      return {};
    },
  });

  const register = useAuthStore((state) => state.register);

  const nextStep = () => {
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 2 ? current + 1 : current;
    });
  };

  const prevStep = () => {
    setActive((current) => current - 1);
  };

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    try {
      const {
        org_industry,
        org_pic_email,
        org_pic_name,
        org_pic_phone_number,
        confirmPassword,
        ...newUser
      } = values;

      if (isOrganization) {
        newUser.organization = {
          industry: org_industry,
          picName: org_pic_name,
          picEmail: org_pic_email,
          picPhoneNumber: org_pic_phone_number,
        };
      }

      await register(newUser as UserRegistrationData);
    } catch (error) {}
    setLoading(true);
  });

  return (
    <Paper
      maw={456}
      mih={"100svh"}
      mt={isExtraSmallScreen ? 64 : 120}
      style={{
        marginInline: "auto",
        boxSizing: "content-box",
      }}
      px={16}
      pb={160}
    >
      <Stack spacing={24} mb={24}>
        <BackButton to={routePaths.REGISTER_OPTION} />
        <Typography textVariant="headline-lg">
          Create a new {userType} account
        </Typography>
        <Typography textVariant="body-lg">
          Join our community of diverse voices, innovative individuals, and big
          ideas to make a difference in energy efficiency
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit}>
        <Timeline active={active}>
          <Timeline.Item
            title="Input your email and password"
            bullet={<Text>1</Text>}
            bulletSize={32}
          >
            {active === 0 ? (
              <Stack spacing={16} pb={24}>
                <TextInput
                  label={userTypeCopy[userType].email}
                  autoFocus
                  type="email"
                  withAsterisk
                  placeholder="Enter your email"
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  withAsterisk
                  {...form.getInputProps("password")}
                />
                <PasswordInput
                  label="Confirmation your password"
                  placeholder="Re-enter your password "
                  withAsterisk
                  {...form.getInputProps("confirmPassword")}
                />
                <Group position="left">
                  {active !== 0 && <Button onClick={prevStep}>Back</Button>}
                  <Button onClick={nextStep}>Next</Button>
                </Group>
              </Stack>
            ) : (
              active > 0 && (
                <Box p="sm">
                  <Text size="sm" weight={"bold"}>
                    {userTypeCopy[userType].email}
                  </Text>
                  <Text c="dimmed" size="sm">
                    {form.values.email}
                  </Text>
                </Box>
              )
            )}
          </Timeline.Item>
          <Timeline.Item
            bullet={<Text>2</Text>}
            bulletSize={32}
            title={`Input your ${userTypeCopy[userType].account} detail`}
          >
            {active === 1 ? (
              <Stack spacing={16} pb={24}>
                <TextInput
                  label={userTypeCopy[userType].name}
                  autoFocus
                  type="text"
                  placeholder={`Enter your ${
                    isOrganization ? "organization name" : "name"
                  }`}
                  withAsterisk
                  {...form.getInputProps("name")}
                />
                {isOrganization ? (
                  <Textarea
                    label={"Address"}
                    placeholder="Enter your address"
                    withAsterisk
                    {...form.getInputProps("address")}
                  />
                ) : (
                  <Select
                    label={"Address"}
                    data={kProvinsi}
                    placeholder="Enter address"
                    searchable
                    withAsterisk
                    {...form.getInputProps("address")}
                  />
                )}
                {isOrganization && (
                  <>
                    <TextInput
                      withAsterisk
                      label="Organization industry"
                      type="text"
                      placeholder="Enter organization industry"
                      {...form.getInputProps("org_industry")}
                    />
                  </>
                )}
                <TextInput
                  label="Phone number"
                  type="text"
                  placeholder="Enter your phone number"
                  inputMode="numeric"
                  withAsterisk
                  {...form.getInputProps("phoneNumber")}
                />
                <Select
                  data={[
                    "Social Media",
                    "Seetrum website",
                    "Friends or colleague",
                    "Adverstisement",
                    "Event",
                    "Other",
                  ]}
                  label="How did you hear about us?"
                  type="text"
                  withAsterisk
                  placeholder="Pick one"
                  {...form.getInputProps("informationChannel")}
                />
                <Textarea
                  label="Why do you want to join?"
                  placeholder="Enter you motivation in joining"
                  {...form.getInputProps("motivationToJoin")}
                />
                <Group position="left">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  {!isOrganization ? (
                    <Button loading={loading} type="submit">
                      Create my account
                    </Button>
                  ) : (
                    <Button onClick={nextStep}>Next</Button>
                  )}
                </Group>
              </Stack>
            ) : (
              active > 1 &&
              isOrganization && (
                <Stack py="sm" spacing={12}>
                  <InfoSummary
                    label={userTypeCopy[userType].email}
                    value={form.values.email}
                  />
                  <InfoSummary label={"Address"} value={form.values.address} />
                  <InfoSummary
                    label={"Industry"}
                    value={form.values.org_industry}
                  />
                  <InfoSummary
                    label={"How did you hear about us?"}
                    value={form.values.informationChannel}
                  />
                  <InfoSummary
                    label={"Why do you want to join?"}
                    value={form.values.motivationToJoin}
                  />
                </Stack>
              )
            )}
          </Timeline.Item>
          {isOrganization && (
            <Timeline.Item
              bullet={<Text>3</Text>}
              bulletSize={32}
              title="Input your organization PIC details"
            >
              {active === 2 && (
                <Stack spacing={16} pb={24}>
                  <TextInput
                    autoFocus
                    label={"PIC's full name"}
                    type="text"
                    placeholder="Enter your full name"
                    withAsterisk
                    {...form.getInputProps("org_pic_name")}
                  />
                  <TextInput
                    label={"PIC's email"}
                    type="text"
                    placeholder="Enter your full email"
                    withAsterisk
                    {...form.getInputProps("org_pic_email")}
                  />
                  <TextInput
                    label={"PIC's phone number"}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter your full phone number"
                    withAsterisk
                    {...form.getInputProps("org_pic_phone_number")}
                  />
                  <Group position="left">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button loading={loading} type="submit">
                      Create my account
                    </Button>
                  </Group>
                </Stack>
              )}
            </Timeline.Item>
          )}
        </Timeline>
      </form>
    </Paper>
  );
};

interface InfoSummaryProps {
  label: string;
  value?: string;
}

const InfoSummary: React.FC<InfoSummaryProps> = ({ label, value = "-" }) => {
  return (
    <Box px="sm">
      <Text size="sm" weight={"bold"}>
        {label}
      </Text>
      <Text c="dimmed" size="sm">
        {value || "-"}
      </Text>
    </Box>
  );
};
