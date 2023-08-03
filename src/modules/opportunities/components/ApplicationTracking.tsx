import { ApplicationHistory } from "@/modules/trainings/components/ApplicationTrackingCard";
import { TrainingMember } from "@/types/models/trainingMember";
import { Typography } from "@/ui/Typography";
import { Button, Flex, FlexProps, useMantineTheme } from "@mantine/core";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOpportunities } from "../store/useOpportunities";

export const ApplicationTracking: React.FC<
  Partial<TrainingMember> & { flexProps?: FlexProps }
> = ({ flexProps, ...applicantData }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { id: opportunityId } = useParams();

  const getOpportunities = useOpportunities((s) => s.getOpportunities);
  const opportunities = useOpportunities((s) => s.opportunities);
  const [openState, setOpen] = useState(false);

  useEffect(() => {
    getOpportunities();
  });

  const opportunityData = opportunities?.find((op) => op.id === opportunityId);
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
            opportunityData &&
            opportunityData.dueDate.seconds < Timestamp.now().seconds
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
