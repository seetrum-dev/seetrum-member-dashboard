import { UserType } from "@/types";
import { FieldViewer } from "@/ui/Drawer/FieldViewer";
import { IconChevronRight } from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import {
  Button,
  Divider,
  Drawer,
  Flex,
  SimpleGrid,
  Stack,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useMemberStore } from "../store/useSeetrumMembers";

export const UserDetails = () => {
  const { tabId, userId } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const { getMemberDetail, getMembers, isValid, updateMember, revalidate } =
    useMemberStore();
  useEffect(() => {
    if (!isValid[(tabId || "individual") as UserType]) {
      getMembers(tabId as UserType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId, userId, isValid]);

  const user = userId ? getMemberDetail(userId) : undefined;
  const isOrganization = user?.organization !== undefined;

  const handleUpdateUser = async (isAdmin: boolean) => {
    if (!user) return;
    setLoading(true);
    await updateMember(user.id, { isAdmin: isAdmin });
    await revalidate((tabId || "individual") as UserType);
    setLoading(false);
  };

  return (
    <Drawer.Content>
      <Drawer.Header
        sx={(t) => ({
          zIndex: 1,
          gap: 16,
          padding: 16,
          borderBottom: "1px solid",
          borderColor: t.fn.rgba(t.colors.night[5], 0.12),
        })}
      >
        <Drawer.Title w={"100%"}>
          <Typography textVariant="title-lg">Member Details</Typography>
        </Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body mih={"95vh"} pb={0} px={0} sx={{ gap: 0 }}>
        <Stack pb={80} pt={16} px={16} mih="calc(100dvh - 80px - 60px - 60px)">
          <Typography textVariant="title-md">General Information</Typography>
          <SimpleGrid cols={2}>
            <FieldViewer
              label={isOrganization ? "Organization name" : "Full name"}
              value={user?.name}
            />
            <FieldViewer
              label="Member type"
              value={isOrganization ? "Organization" : "Individual"}
            />
            <FieldViewer
              label={isOrganization ? "Orgainzation email" : "Email"}
              value={user?.email}
            />
            <FieldViewer
              label={isOrganization ? "Organization industry" : "Phone number"}
              value={
                isOrganization ? user.organization?.industry : user?.phoneNumber
              }
            />
          </SimpleGrid>
          <FieldViewer label="Address" value={user?.address} />
          <Divider />
          {isOrganization ? (
            <>
              <Typography textVariant="title-md">PIC Information</Typography>
              <Stack spacing={16}>
                <FieldViewer
                  label="PIC’s name"
                  value={user?.organization?.picName}
                />
                <FieldViewer
                  label="PIC’s email"
                  value={user?.organization?.picEmail}
                />
                <FieldViewer
                  label="PIC’s mobile phone number"
                  value={user?.organization?.picPhoneNumber}
                />
              </Stack>
            </>
          ) : (
            <Flex
              align="center"
              justify="space-between"
              gap={16}
              p={12}
              sx={(t) => ({
                borderRadius: 12,
                border: "1px solid",
                borderColor: t.fn.rgba(t.colors.night[5], 0.12),
              })}
            >
              <Stack spacing={4}>
                <Typography textVariant="label-lg">Role</Typography>
                <Typography textVariant="body-lg">
                  {user?.isAdmin ? "Admin" : "Member"}
                </Typography>
              </Stack>
              <Button
                variant="outline"
                radius={8}
                sx={(t) => ({
                  borderColor: t.fn.rgba(t.colors.night[5], 0.12),
                })}
                loading={loading}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  user && handleUpdateUser(!user.isAdmin);
                }}
              >
                {user?.isAdmin
                  ? "Change to become member"
                  : "Change to become admin"}
              </Button>
            </Flex>
          )}
          <Divider />
          <Typography textVariant="title-md">Additional Information</Typography>
          <Stack spacing={16}>
            <FieldViewer
              label="How did you hear about us?"
              value={user?.informationChannel || "-"}
            />
            <FieldViewer
              label="Why do you want to join us?"
              value={user?.motivationToJoin || "-"}
            />
          </Stack>
        </Stack>
        <DrawerFooter userType={(tabId || "individual") as UserType} />
      </Drawer.Body>
    </Drawer.Content>
  );
};

type OutletContext = [
  number | undefined,
  React.Dispatch<React.SetStateAction<number | undefined>>
];

const DrawerFooter = ({ userType }: { userType: UserType }) => {
  const [activeIndex, setActiveIndex] = useOutletContext<OutletContext>();
  const { members, organization } = useMemberStore();
  const navigate = useNavigate();

  const users = userType === "individual" ? members : organization;
  return (
    <Flex
      px="1rem"
      sx={(t) => ({
        position: "sticky",
        bottom: 0,
        right: 0,
        borderTop: "1px solid",
        borderColor: t.fn.rgba(t.colors.night[5], 0.12),
        height: 60,
        width: "calc(100% - 2rem)",
        background: "white",
        justifyContent: "space-between",
        alignItems: "center",
      })}
    >
      <Button
        variant="subtle"
        disabled={activeIndex === 0}
        sx={{ borderRadius: 8 }}
        leftIcon={<IconChevronRight style={{ transform: "rotate(180deg)" }} />}
        onClick={() => {
          setActiveIndex((s) => {
            const prevIndex = s ? (s - 1 < 0 ? 0 : s - 1) : 0;
            const prevUser = users && users[prevIndex];
            prevUser && navigate(`../${prevUser.id}`);
            return prevIndex;
          });
        }}
      >
        Previous member
      </Button>
      <Button
        sx={{ borderRadius: 8 }}
        variant="subtle"
        disabled={users ? users.length - 1 === activeIndex : false}
        onClick={() => {
          setActiveIndex((s) => {
            const maxIndex = users ? users.length - 1 : 1;
            const nextIndex = s ? (s + 1 > maxIndex ? maxIndex : s + 1) : 1;
            const nextUser = users && users[nextIndex];
            nextUser && navigate(`../${nextUser.id}`);
            return nextIndex;
          });
        }}
        rightIcon={<IconChevronRight />}
      >
        Next member
      </Button>
    </Flex>
  );
};
