import { useAuthStore } from "@/modules/auth/stores/authStore";
import { User } from "@/types";
import {
  Button,
  Flex,
  Modal,
  Select,
  Stack,
  Tabs,
  TextInput,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { ModalRootProps } from "@mantine/core/lib/Modal/ModalRoot/ModalRoot";
import { DatePickerInput } from "@mantine/dates";
import { UseFormReturnType, isNotEmpty, matches, useForm } from "@mantine/form";
import { updateUser } from "../services/userService";
import { Timestamp } from "firebase/firestore";
import { useMediaQuery } from "@mantine/hooks";

export const UpdateProfileModal = (props: ModalRootProps) => {
  const member = useAuthStore((s) => s.user);
  const t = useMantineTheme();
  const isSmallScreen = useMediaQuery(`(max-width: ${t.breakpoints.xs})`);
  const setUser = useAuthStore((s) => s.setUser);
  const initialDob = member?.dateOfBirth
    ? member.dateOfBirth instanceof Timestamp
      ? member.dateOfBirth.toDate()
      : member.dateOfBirth
    : undefined;
  const form = useForm({
    initialValues: {
      ...member,
      dateOfBirth: initialDob,
    } as User,
    validateInputOnBlur: true,
    validate: (values) => {
      const {
        name,
        phoneNumber,
        address,
        dateOfBirth,
        informationChannel,
        gender,
      } = values;
      return {
        name: isNotEmpty("Name can't be empty")(name),
        address: isNotEmpty("Address can't be empty")(address),
        gender: !isOrganization && isNotEmpty("Gander can't be empty")(gender),
        dateOfBirth:
          !isOrganization &&
          isNotEmpty("Date of birth can't be empty")(dateOfBirth),
        phoneNumber: matches(
          /^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/,
          "Provide valid phone number"
        )(phoneNumber),
        informationChannel: isNotEmpty(
          "Please tell us where do you hear about us"
        )(informationChannel),
      };
    },
  });
  const isOrganization = member?.organization !== undefined;

  const handleClose = () => {
    form.reset();
    props.onClose();
  };

  const handleSubmit = async () => {
    form.validate();
    if (!form.isValid()) return;
    if (member === undefined || member === null) return;

    const user: Partial<User> = {
      name: form.values.name,
      address: form.values.address,
      phoneNumber: form.values.phoneNumber,
      dateOfBirth: form.values.dateOfBirth
        ? new Date(form.values.dateOfBirth)
        : undefined,
      gender: form.values.gender,
      informationChannel: form.values.informationChannel,
      motivationToJoin: form.values.motivationToJoin,
    };
    updateUser(member.id, user);
    handleClose();
    setUser({ ...member, ...user });
  };

  return (
    <Modal.Root
      {...props}
      size="lg"
      onClose={handleClose}
      fullScreen={isSmallScreen}
      centered
      styles={{ inner: { paddingLeft: "0px !important" } }}
    >
      <Modal.Overlay />
      <Modal.Content pos="relative">
        <Modal.Header>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            defaultValue={
              isOrganization ? "detailOrganization" : "detailIndividual"
            }
          >
            <Tabs.List>
              <Tabs.Tab value="detailIndividual">General Information</Tabs.Tab>
              <Tabs.Tab value="additional">Additional Information</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="detailIndividual">
              <IndividualPanel form={form} />
            </Tabs.Panel>

            <Tabs.Panel value="additional">
              <AdditionalPanel form={form} />
            </Tabs.Panel>
          </Tabs>
          <Flex
            px={16}
            pt={12}
            mx={-16}
            gap={8}
            align="center"
            justify="end"
            sx={(t) => ({
              borderTop: "1px solid",
              borderColor: t.colors.platinum[3],
              [t.fn.smallerThan("sm")]: {
                width: "calc(100dvw - 32px)",
                position: "absolute",
                bottom: 0,
                paddingBottom: 16,
              },
            })}
          >
            <Button variant="subtle" radius={8} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="filled"
              radius={8}
              color="biceblue"
              onClick={handleSubmit}
              disabled={!form.isValid() || !form.isDirty()}
            >
              Save changes
            </Button>
          </Flex>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

const IndividualPanel = ({
  form,
}: {
  form: UseFormReturnType<User, (values: User) => User>;
}) => {
  return (
    <Stack spacing={16} pt={16} pb={40}>
      <TextInput
        label={"Full name"}
        autoFocus
        type="text"
        placeholder={`Enter your name`}
        withAsterisk
        {...form.getInputProps("name")}
      />
      <Textarea
        label={"Address"}
        maxRows={3}
        rows={3}
        placeholder={`Enter your address`}
        withAsterisk
        {...form.getInputProps("address")}
      />
      <Select
        label="Gender"
        placeholder="Pick one"
        data={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ]}
        withAsterisk
        {...form.getInputProps("gender")}
      />
      <DatePickerInput
        label="Date of birth"
        placeholder="Enter your date of birth"
        withAsterisk
        {...form.getInputProps("dateOfBirth")}
        defaultValue={undefined}
        defaultDate={undefined}
      />
      <TextInput
        label="Phone number"
        type="text"
        placeholder="Enter your phone number"
        inputMode="numeric"
        withAsterisk
        {...form.getInputProps("phoneNumber")}
      />
    </Stack>
  );
};

const AdditionalPanel = ({
  form,
}: {
  form: UseFormReturnType<User, (values: User) => User>;
}) => {
  return (
    <Stack spacing={16} pt={16} pb={40}>
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
    </Stack>
  );
};
