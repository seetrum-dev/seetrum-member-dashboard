import { useAuthStore } from "@/modules/auth/stores/authStore";
import { IconEditSquare, IconInfo } from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import { Button, Flex, Skeleton, Stack, useMantineTheme } from "@mantine/core";

export const DashboardHeader = () => {
  const t = useMantineTheme();
  const member = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const isProfileCompleted = Boolean(
    member && member.dateOfBirth && member.gender
  );
  const isOrganization = member?.organization !== undefined;

  const handleOpenUpdateProfileModal = () => {
    const event = new CustomEvent("openUpdateProfileModal");
    window.dispatchEvent(event);
  };

  return (
    <Stack spacing={16}>
      <Stack
        px={16}
        py={20}
        spacing={4}
        sx={{
          backgroundColor: t.colors.platinum[1],
          borderRadius: 16,
        }}
      >
        <Typography textVariant="body-lg">
          Welcome to the Seetrum member’s dashboard,
        </Typography>
        {loading || !member ? (
          <Skeleton width={"50%"} height={36} />
        ) : (
          <Typography textVariant="headline-md">{member.name}</Typography>
        )}
      </Stack>

      {!loading && !isProfileCompleted && !isOrganization && (
        <Flex
          px={16}
          py={12}
          gap={16}
          justify={"space-between"}
          align={"center"}
          sx={{
            flexDirection: "row",
            [t.fn.smallerThan("sm")]: {
              flexDirection: "column",
              alignItems: "flex-end",
            },
            border: "1px solid",
            borderColor: t.fn.rgba(t.colors.night[3], 0.12),
            borderRadius: 16,
          }}
        >
          <Stack spacing={8} sx={{ flex: 1 }}>
            <Flex justify="start" align="center" gap={16}>
              <IconInfo size={18} fill={t.colors.biceblue[5]} />
              <Typography textVariant="body-lg">
                Complete Your Profile
              </Typography>
            </Flex>
            <Typography mx={34} textVariant="body-md" color="dimmed">
              Your profile is missing some information. Completing it will help
              you make the most of our features.
            </Typography>
          </Stack>
          <Button
            variant="subtle"
            sx={{ borderRadius: 8 }}
            leftIcon={<IconEditSquare size={18} />}
            onClick={handleOpenUpdateProfileModal}
          >
            Edit profile
          </Button>
        </Flex>
      )}
    </Stack>
  );
};
