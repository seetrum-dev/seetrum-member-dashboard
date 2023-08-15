import { pretyDate } from "@/lib/utils";
import { FileInfo } from "@/types/models/fileInfo";
import { Training } from "@/types/models/training";
import { TrainingMember } from "@/types/models/trainingMember";
import { FileCard } from "@/ui/Card/FileCard";
import {
  IconArrowLeft,
  IconCalendarEvent,
  IconClockHistory,
  IconPeople,
} from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Loader,
  Stack,
  TypographyStylesProvider,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ApplicationTrackingCard } from "../components/ApplicationTrackingCard";
import { useTrainings } from "../store/useTrainings";
import { useFileURLStore } from "@/services/firebase/storage";
import { useTrainingMember } from "../store/useTrainingMember";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import { FileScreeningCard } from "@/ui/Card/FileScreeningCard";

export const TrainingDetailPage: React.FC = () => {
  const { id: trainingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const getFileURL = useFileURLStore((s) => s.getFileURL);
  // Data gether
  const loading = useTrainings((state) => state.loading);
  const getTrainingById = useTrainings((state) => state.getTrainingsById);
  const member = useAuthStore((s) => s.user);
  const loadingTM = useTrainingMember((state) => state.loading);
  const getTMByTID = useTrainingMember(
    (state) => state.getTrainingsByTrainingId
  );

  const [trainingData, setTraining] = useState<Training | undefined>(undefined);
  const [tmData, setTM] = useState<TrainingMember | undefined>(undefined);
  const [imageUrl, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (trainingId) {
      getTrainingById(trainingId).then((training) => {
        if (training) setTraining(training);
      });
      if (member)
        getTMByTID(member.id, trainingId).then((tm) => {
          if (tm) setTM(tm);
        });
    }
  }, [trainingId, member, getTrainingById, getTMByTID]);

  useEffect(() => {
    if (!imageUrl && trainingData)
      getFileURL(trainingData.thumbnailFileName).then((ur) => setImage(ur));
  }, [getFileURL, trainingData, trainingData?.thumbnailFileName, imageUrl]);

  if (loading || !trainingData || loadingTM || !member) {
    return (
      <Box mih={100} w={"100%"}>
        <Center>
          <Loader />
        </Center>
      </Box>
    );
  }

  return (
    <Flex
      gap={24}
      direction="column"
      align={"flex-start"}
      sx={{
        "& a.mantine-Button-root:hover": {
          backgroundColor: "unset",
          textDecoration: "underline",
        },
      }}
    >
      <Button
        component="a"
        variant="subtle"
        radius="md"
        p={0}
        sx={{
          color: "black",
        }}
        leftIcon={<IconArrowLeft />}
        onClick={() =>
          navigate(
            "/" +
              (location.pathname.includes("mytraining") ? "my" : "") +
              "trainings"
          )
        }
      >
        Back to all trainings
      </Button>
      <Flex
        gap={24}
        pb={80}
        justify={"space-between"}
        w={"100%"}
        sx={(t) => ({
          flexDirection: "row",
          [t.fn.smallerThan("sm")]: { flexDirection: "column" },
        })}
      >
        <Flex direction="column" gap={24} sx={{ maxWidth: 640, flex: 1 }}>
          <TrainingDetailHeader {...trainingData} />
          <TrainingDetailDescription {...trainingData} />
          <TrainingDetailAttachments attachments={trainingData.attachments} />
        </Flex>
        <Flex
          sx={(t) => ({
            width: 315,
            [t.fn.smallerThan("sm")]: {
              width: "100%",
              "& img": { display: "none" },
            },
            flexShrink: 0,
          })}
          gap={16}
          direction="column"
        >
          <Image
            withPlaceholder
            height={210}
            radius={"lg"}
            src={imageUrl}
            sx={(t) => ({
              overflow: "hidden",
              borderRadius: "16px",
              border: "1px solid",
              borderColor: t.fn.rgba(t.colors.night[6], 0.08),
            })}
          />
          <ApplicationTrackingCard {...tmData} />
          {tmData &&
            Array.isArray(tmData.issuedCertificate) &&
            tmData.issuedCertificate.length > 0 && (
              <Stack
                spacing={8}
                p={16}
                pt={20}
                sx={(t) => ({
                  borderRadius: 16,
                  border: "1px solid",
                  borderColor: t.fn.rgba(t.colors.night[5], 0.12),
                })}
              >
                <Typography textVariant="title-md" pb={8}>
                  Issued Certificate
                </Typography>
                {tmData.issuedCertificate.map((certif) => (
                  <FileScreeningCard {...certif} />
                ))}
              </Stack>
            )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export const TrainingDetailHeader: React.FC<Training> = (trainignData) => {
  const getData = (icon: React.ReactNode, label: string, value: string) => ({
    icon,
    label,
    value,
  });
  const data = [
    getData(<IconPeople />, "Organizer", trainignData.trainerName),
    getData(
      <IconCalendarEvent />,
      "Application deadline",
      pretyDate(trainignData.dueDate.toDate())
    ),
    getData(
      <IconClockHistory />,
      "Last modified",
      pretyDate(trainignData.updatedAt.toDate())
    ),
  ];
  return (
    <Flex direction={"column"} gap={16}>
      <Typography textVariant="headline-lg">{trainignData.title}</Typography>
      <Flex
        sx={(theme) => ({
          background: theme.colors.platinum[1],
          borderRadius: 12,
          [theme.fn.smallerThan("sm")]: {
            flexDirection: "column",
          },
        })}
      >
        {data.map((data, index) => (
          <Flex
            key={index}
            py={12}
            px={16}
            gap={8}
            sx={(t) => ({
              flex: 1,
              borderBottom: "none",
              borderRight: "2px solid",
              borderColor: "white",
              ":last-child": {
                borderRight: "none",
              },
              [t.fn.smallerThan("sm")]: {
                borderRight: "none",
                borderBottom: "2px solid",
                borderColor: "white",
                ":last-child": {
                  borderBottom: "none",
                },
              },
            })}
            direction={"column"}
          >
            <Flex gap={8} align={"center"}>
              <Flex sx={{ width: 16, flexShrink: 0 }}>{data.icon}</Flex>
              <Typography textVariant="body-sm" color="night.5">
                {data.label}
              </Typography>
            </Flex>
            <Typography ml={16 + 8} textVariant="label-lg">
              {data.value}
            </Typography>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export const TrainingDetailDescription: React.FC<Training> = (trainignData) => {
  const isEmpty =
    trainignData.description.trim().startsWith("<p></p>") ||
    trainignData.description === "";
  return (
    <Flex direction={"column"} gap={16}>
      <Typography textVariant="title-md">Description</Typography>
      {isEmpty ? (
        <Typography textVariant="body-md" my={16} align="center" color="dimmed">
          <i>No description available</i>
        </Typography>
      ) : (
        <TypographyStylesProvider>
          <Box dangerouslySetInnerHTML={{ __html: trainignData.description }} />
        </TypographyStylesProvider>
      )}
    </Flex>
  );
};

export const TrainingDetailAttachments: React.FC<{
  attachments: FileInfo[];
}> = ({ attachments }) => {
  const isEmpty: boolean = attachments && attachments.length === 0;

  if (isEmpty) return <></>;

  return (
    <Flex direction="column" gap={16}>
      <Typography textVariant="title-md">Supporting Files</Typography>
      {attachments.map((attachment, index) => (
        <FileCard key={index} {...attachment} />
      ))}
    </Flex>
  );
};
