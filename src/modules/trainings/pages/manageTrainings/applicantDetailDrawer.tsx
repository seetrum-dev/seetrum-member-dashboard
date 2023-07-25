import { extractInitials, toTitleCase } from "@/lib/utils";
import { updateTrainingMember } from "@/modules/trainings/services/trainingMemberService";
import { useApplicantStore } from "@/modules/trainings/store/useApplicantsStore";
import { uploadFile } from "@/services/firebase/storage";
import { TrainingMemberStatus } from "@/types/models/trainingMember";
import { FileScreeningCard } from "@/ui/Card/FileScreeningCard";
import { FieldViewer as FieldView } from "@/ui/Drawer/FieldViewer";
import { IconPlus } from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  FileButton,
  Flex,
  Loader,
  Select,
  SimpleGrid,
  Stack,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

type OutletContext = [
  number | undefined,
  React.Dispatch<React.SetStateAction<number | undefined>>
];

const maxSize = 2 * 1024 ** 2;

export const ApplicantDetails = () => {
  const { id: trainingId, applicantId } = useParams();
  const {
    activeApplicant,
    getAplicantById,
    updateActiveApplicant,
    getApplicants,
  } = useApplicantStore();

  useEffect(() => {
    if (trainingId && applicantId) getAplicantById(trainingId, applicantId);
  }, [getAplicantById, trainingId, applicantId]);

  const [loading, setLoading] = useState(false);

  const submitFile = async (file: File[]) => {
    try {
      setLoading(true);

      if (file.some((f) => f.size > maxSize)) {
        throw Error("File size limit exceeded");
      }

      const promises = file.map((f) => uploadFile(f, "certificate"));
      const newFileInfo = await Promise.all(promises);

      if (trainingId && applicantId && activeApplicant) {
        await updateTrainingMember(applicantId, {
          issuedCertificate: [
            activeApplicant.issuedCertificate ?? [],
            newFileInfo,
          ].flat(),
          status: "completed",
        });
        await updateActiveApplicant(trainingId, applicantId, {
          issuedCertificate: [
            activeApplicant.issuedCertificate ?? [],
            newFileInfo,
          ].flat(),
          status: "completed",
        });

        getApplicants(trainingId);
      }
    } catch (e) {
      console.error(e);
    }
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
          <Flex w={"100%"} justify="space-between">
            <Typography textVariant="title-lg">Applicant Details</Typography>
            <Select
              value={
                activeApplicant?.status === "completed"
                  ? "accepted"
                  : activeApplicant?.status
              }
              data={[
                { label: "Accepted", value: "accepted" },
                { label: "Rejected", value: "rejected" },
              ]}
              placeholder="Application Status"
              onChange={async (val) => {
                console.log("Change application status", val);
                if (trainingId && activeApplicant && val) {
                  await updateTrainingMember(activeApplicant.id, {
                    status: val as TrainingMemberStatus,
                  });
                  await updateActiveApplicant(trainingId, activeApplicant.id, {
                    status: val as TrainingMemberStatus,
                  });
                  getApplicants(trainingId);
                }
              }}
            />
          </Flex>
        </Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body mih={"95vh"} pb={0} px={0} sx={{ gap: 0 }}>
        <Stack pb={80} pt={16} px={16}>
          <Typography textVariant="title-md">Applicant Information</Typography>
          <Flex gap={16} align={"center"}>
            <Avatar size={64} radius={64} color="cyan">
              {extractInitials(activeApplicant?.name || "")}
            </Avatar>
            <FieldView label="Full name" value={activeApplicant?.name} />
          </Flex>
          <SimpleGrid cols={2}>
            <FieldView label="Email" value={activeApplicant?.email} />
            <FieldView
              label="Mobile phone number"
              value={activeApplicant?.phoneNumber}
            />
            <FieldView label="Age" value={activeApplicant?.age} />
            <FieldView
              label="Gender"
              value={toTitleCase(activeApplicant?.gender || "")}
            />
            <FieldView
              label="Employment status"
              value={toTitleCase(activeApplicant?.employmentStatus || "")}
            />
            <FieldView
              label="Current institution"
              value={toTitleCase(activeApplicant?.institutionName || "")}
            />
          </SimpleGrid>
          {activeApplicant?.additionalData && (
            <>
              <Divider />
              <Typography textVariant="title-md">
                Additional Information
              </Typography>
              {activeApplicant.additionalData.map((data) => {
                return (
                  <FieldView
                    label={data.label}
                    value={toTitleCase(data.value || "")}
                  />
                );
              })}
            </>
          )}
          <Divider />
          <Typography textVariant="title-md">Uploaded Files</Typography>
          <Stack spacing={16}>
            {activeApplicant &&
              activeApplicant.requiredFiles.map((file) => {
                return (
                  <FileScreeningCard key={file.filename} {...file} showTag />
                );
              })}
          </Stack>
          <Divider />
          <Typography textVariant="title-md">Certificate</Typography>
          <Typography textVariant="body-md">
            You can upload applicant’s certificate here only if the application
            has been accepted,
          </Typography>
          <Stack spacing={16} align="center">
            {activeApplicant &&
            Boolean(activeApplicant.issuedCertificate) &&
            activeApplicant.issuedCertificate.length > 0 ? (
              activeApplicant.issuedCertificate.map((file) => {
                return (
                  <FileScreeningCard
                    key={file.filename}
                    {...file}
                    onDelete={async () => {
                      if (
                        trainingId &&
                        applicantId &&
                        activeApplicant.issuedCertificate
                      ) {
                        const certifs =
                          activeApplicant.issuedCertificate.filter(
                            (c) => c.filename !== file.filename
                          );
                        const updatedApplicationData = {
                          issuedCertificate: certifs,
                          status:
                            certifs.length === 0
                              ? "accepted"
                              : activeApplicant.status,
                        };
                        await updateTrainingMember(
                          applicantId,
                          updatedApplicationData
                        );
                        await updateActiveApplicant(
                          trainingId,
                          applicantId,
                          updatedApplicationData
                        );

                        getApplicants(trainingId);
                      }
                    }}
                  />
                );
              })
            ) : loading ? (
              <Loader />
            ) : (
              <Typography color="dimmed">
                <i>No certificate uploaded</i>
              </Typography>
            )}
          </Stack>
          <FileButton
            onChange={(e) => submitFile(e)}
            accept="image/png,image/jpeg,application/pdf"
            multiple
          >
            {(props) => (
              <Button
                {...props}
                w={"fit-content"}
                disabled={
                  !(
                    activeApplicant?.status === "accepted" ||
                    activeApplicant?.status === "completed"
                  )
                }
                radius={8}
                variant="outline"
                leftIcon={<IconPlus size={18} />}
              >
                Add a new certificate
              </Button>
            )}
          </FileButton>
        </Stack>
        <DrawerFooter />
      </Drawer.Body>
    </Drawer.Content>
  );
};

const DrawerFooter = () => {
  const [activeIndex, setActiveIndex] = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const { id: trainingId } = useParams();
  const { applicants } = useApplicantStore();

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
            const prevApplicat =
              applicants &&
              trainingId &&
              applicants[trainingId] &&
              applicants[trainingId][prevIndex];
            prevApplicat && navigate(`../${prevApplicat.id}`);
            return prevIndex;
          });
        }}
      >
        Previous applicant
      </Button>
      <Button
        sx={{ borderRadius: 8 }}
        variant="subtle"
        disabled={
          applicants && trainingId && applicants[trainingId]
            ? applicants[trainingId].length - 1 === activeIndex
            : false
        }
        onClick={() => {
          setActiveIndex((s) => {
            const maxIndex =
              applicants && trainingId && applicants[trainingId]
                ? applicants[trainingId].length - 1
                : 1;
            const nextIndex = s ? (s + 1 > maxIndex ? maxIndex : s + 1) : 1;
            const nextApplicat =
              applicants &&
              trainingId &&
              applicants[trainingId] &&
              applicants[trainingId][nextIndex];
            nextApplicat && navigate(`../${nextApplicat.id}`);
            return nextIndex;
          });
        }}
        rightIcon={<IconChevronRight />}
      >
        Next applicant
      </Button>
    </Flex>
  );
};
