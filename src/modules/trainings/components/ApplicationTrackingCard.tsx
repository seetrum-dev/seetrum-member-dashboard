import { pretyDate } from "@/lib/utils";
import {
  TrainingMember,
  TrainingMemberStatus,
} from "@/types/models/trainingMember";
import { Typography } from "@/ui/Typography";
import { Box, Button, Flex, FlexProps, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrainings } from "../store/useTrainings";
import { Training } from "@/types/models/training";
import { Timestamp } from "firebase/firestore";

export const ApplicationTrackingCard: React.FC<
  Partial<TrainingMember> & { flexProps?: FlexProps }
> = ({ flexProps, ...applicantData }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { id: trainingId } = useParams();

  const { getTrainingsById, getTrainings } = useTrainings();
  const [training, setTraining] = useState<Training>();
  const [openState, setOpen] = useState(false);

  useEffect(() => {
    getTrainings();
    trainingId && getTrainingsById(trainingId).then((t) => t && setTraining(t));
  });

  return (
    <Flex
      p={16}
      pt={20}
      direction="column"
      gap={16}
      {...flexProps}
      sx={{
        border: "1px solid",
        borderColor: theme.fn.rgba(theme.colors.night[6], 0.12),
        borderRadius: theme.radius.lg,
        ...flexProps?.sx,
      }}
    >
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        onClick={() => {
          if (Boolean(applicantData.id)) {
            setOpen((v) => !v);
          }
        }}
      >
        <Typography textVariant="title-md">
          {!applicantData.id
            ? "Interested in applying this training?"
            : "Training Activity"}
        </Typography>
        {/* <ThemeIcon
          hidden={!Boolean(applicantData.id)}
          variant="default"
          sx={{
            border: "none",
            transition: "rotate 1500ms ease",
            transform: ("rotate(" + (openState ? 180 : 0) + "deg)") as string,
          }}
        >
          <IconChevronDown />
        </ThemeIcon> */}
      </Flex>
      {applicantData.id ? (
        <ApplicationHistory {...applicantData} isOpen={openState} />
      ) : (
        <Button
          disabled={
            training && training.dueDate.seconds < Timestamp.now().seconds
          }
          radius={"md"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate("apply");
          }}
        >
          Apply now
        </Button>
      )}
    </Flex>
  );
};

const ApplicationLogState: Record<TrainingMemberStatus, string> = {
  completed: "Certificate issued",
  rejected: "Application rejected",
  accepted: "Application accepted",
  applied: "Application received",
};
// TODO: Implement history view with collapsible section
export const ApplicationHistory: React.FC<
  Partial<TrainingMember> & { isOpen: Boolean }
> = ({ isOpen, ...applicantData }) => {
  return (
    <Flex direction="column">
      <Flex justify="space-between" align={"center"}>
        <Flex gap={16} align="center">
          <Box
            w={8}
            h={8}
            bg={applicantData.status === "rejected" ? "red.6" : "biceblue.6"}
            sx={{ borderRadius: "16px", overflow: "hidden" }}
          />
          <Typography>
            {ApplicationLogState[applicantData.status as TrainingMemberStatus]}
          </Typography>
        </Flex>
        <Typography textVariant="body-sm">
          {pretyDate(new Date(Date.now()))}
        </Typography>
      </Flex>
      {/* <Flex
        h={isOpen ? 300 : 0}
        bg="blue"
        sx={{ transition: "all 500ms ease" }}
      >
      </Flex> */}
    </Flex>
  );
};
