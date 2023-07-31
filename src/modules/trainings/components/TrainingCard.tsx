import { useFileURLStore } from "@/services/firebase/storage";
import { Training } from "@/types/models/training";
import { IconArrowRight, IconPeople } from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import {
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Skeleton,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainingMemberCountByTrainingId } from "../services/trainingMemberService";
import { useTrainings } from "../store/useTrainings";
import { Timestamp } from "firebase/firestore";
import { pretyDate } from "@/lib/utils";
import { useTrainingMember } from "../store/useTrainingMember";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import { TrainingMember } from "@/types/models/trainingMember";

interface TrainingCardProps extends Training {
  variant: "horizontal" | "vertical";
}

interface TrainingCardAddonProps {
  loading?: boolean;
  children?: ReactNode;
}

interface TrainingCardChildProps extends TrainingCardAddonProps {
  thumbnail: ReactNode;
}

export const TrainingCard: React.FC<
  TrainingCardProps & TrainingCardAddonProps
> = ({ variant: type, loading = false, children, ...trainingData }) => {
  const getFileURL = useFileURLStore((s) => s.getFileURL);
  const [imageUrl, setImage] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (trainingData.thumbnailFileName && !imageUrl)
      getFileURL(trainingData.thumbnailFileName).then((ur) => setImage(ur));
  }, [getFileURL, trainingData.thumbnailFileName, imageUrl]);

  const Thumbnail: React.FC<any> = ({
    imageProps,
    sx,
  }: {
    imageProps: any;
    sx?: any;
  }) => (
    <Image
      src={imageUrl}
      withPlaceholder
      height={180}
      {...imageProps}
      sx={(t) => ({
        minWidth: 180,
        overflow: "hidden",
        borderRadius: "16px",
        border: "1px solid",
        borderColor: t.fn.rgba(t.colors.night[6], 0.08),
        ...(sx && sx(t)),
      })}
    />
  );
  if (type === "horizontal")
    return (
      <HorizontalCard
        {...trainingData}
        loading={loading}
        thumbnail={
          <Thumbnail
            height={140}
            sx={(t: any) => ({
              minWidth: 210,
              maxWidth: 210,
              flexShrink: 0,
              [t.fn.smallerThan("sm")]: {
                maxWidth: "45%",
                ".mantine-Image-imageWrapper img": {
                  maxWidth: "100%",
                  objectPosition: "50% 50%",
                },
              },
            })}
          />
        }
      >
        {children}
      </HorizontalCard>
    );
  return <VerticalCard {...trainingData} thumbnail={<Thumbnail />} />;
};

const HorizontalCard: React.FC<Training & TrainingCardChildProps> = ({
  loading,
  thumbnail,
  children,
  ...trainingData
}) => {
  const navigate = useNavigate();
  const isClosed = trainingData.dueDate.seconds < Timestamp.now().seconds;
  return (
    <Flex
      pb={16}
      sx={(theme) => ({
        borderBottom: "1px solid",
        borderColor: theme.colors.gray[4],
        cursor: "pointer",
      })}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`${trainingData.id}`);
      }}
    >
      <Box sx={{ opacity: isClosed ? 0.3 : 1, width: "auto", flexShrink: 0 }}>
        {thumbnail}
      </Box>
      <Flex px={16} py={8} gap={8} direction="column">
        <Skeleton visible={loading}>
          <Typography
            textVariant="title-md"
            sx={{
              // TODO: This should be refactored to somewhere accessible
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              // ---
            }}
          >
            {trainingData.title}
          </Typography>
        </Skeleton>
        <Skeleton visible={loading}>
          <Typography textVariant="body-md">
            {trainingData.trainerName}
          </Typography>
        </Skeleton>
        {children}
      </Flex>
    </Flex>
  );
};

export const ApplicationStatusUpdate = ({
  trainingId,
}: {
  trainingId: string;
}) => {
  const { user } = useAuthStore();
  const { getTrainingsByTrainingId } = useTrainingMember();
  const [applicationStatus, setTM] = useState<TrainingMember>();
  useEffect(() => {
    if (user && trainingId)
      getTrainingsByTrainingId(user.id, trainingId).then(
        (tm) => tm && setTM(tm)
      );
  }, [getTrainingsByTrainingId, trainingId, user]);

  if (!applicationStatus) return <Skeleton />;
  return (
    <Typography
      textVariant="body-md"
      color="dimmed"
      sx={{ width: "fit-content" }}
    >
      {applicationStatus.issuedCertificate &&
      applicationStatus.issuedCertificate.length >= 1
        ? `Certificate issued on ${pretyDate(
            applicationStatus.updatedAt.toDate()
          )}`
        : `${
            applicationStatus.status[0].toUpperCase() +
            applicationStatus.status.slice(1)
          } on ${pretyDate(applicationStatus.updatedAt.toDate())}`}
    </Typography>
  );
};
export const AdminTrainingInfo = ({ trainingId }: { trainingId: string }) => {
  const thm = useMantineTheme();
  const [applicantCount, setCount] = useState<number>();
  const [training, setTraining] = useState<Training>();
  const { getTrainingsById } = useTrainings();
  useEffect(() => {
    getTrainingMemberCountByTrainingId(trainingId).then((count) =>
      setCount(count)
    );
    getTrainingsById(trainingId).then((training) =>
      setTraining(training ?? undefined)
    );
  }, [getTrainingsById, trainingId]);
  const isOpen = training && training.dueDate.seconds > Timestamp.now().seconds;
  return (
    <Stack spacing={8}>
      <Flex gap={8} align="center">
        <Badge
          size="sm"
          sx={{
            backgroundColor: thm.colors.platinum[3],
            color: "InfoText",
            textTransform: "capitalize",
          }}
        >
          {isOpen ? "Open" : "Closed"}
        </Badge>
        <Typography textVariant="body-md">
          {training
            ? `Posted on ${pretyDate(training.createdAt.toDate())}`
            : undefined}
        </Typography>
      </Flex>
      {applicantCount !== undefined && (
        <Flex gap={8} align="center">
          <IconPeople />
          <Typography textVariant="body-md">
            {applicantCount} applicant{applicantCount > 1 ? "s" : ""}
          </Typography>
        </Flex>
      )}
    </Stack>
  );
};

const VerticalCard: React.FC<Training & TrainingCardChildProps> = ({
  id,
  title,
  thumbnail,
}) => {
  const navigate = useNavigate();

  return (
    <Flex
      p={12}
      pb={16}
      gap={16}
      direction="column"
      sx={(t) => ({
        borderRadius: "28px 16px",
        border: "1px solid",
        borderColor: t.fn.rgba(t.colors.night[6], 0.12),
        "& a.mantine-Button-root:hover": {
          backgroundColor: "unset",
          textDecoration: "underline",
        },
      })}
    >
      {thumbnail}
      <Typography textVariant="title-lg">{title}</Typography>
      <Button
        component="a"
        variant="subtle"
        w={"fit-content"}
        p={0}
        color="night"
        rightIcon={<IconArrowRight />}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/trainings/${id}`);
        }}
      >
        View training details
      </Button>
    </Flex>
  );
};
