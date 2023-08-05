import { useOpportunities } from "@/modules/opportunities/store/useOpportunities";
import {
  AdminTrainingInfo,
  TrainingCard,
} from "@/modules/trainings/components/TrainingCard";
import { IconPlus } from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import { Button, Group, Skeleton, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { CreateOpportunitiesModal } from "../components/CreateOpportunityModal";

export const ManageOpportunitiesPage = () => {
  const [open, setOpen] = useState(false);
  const getTrainings = useOpportunities((s) => s.getOpportunities);
  const trainings = useOpportunities((s) => s.opportunities);

  useEffect(() => {
    getTrainings();
  }, [getTrainings]);

  return (
    <Stack>
      <CreateOpportunitiesModal opened={open} onClose={() => setOpen(false)} />
      <Group position="apart">
        <Typography textVariant="headline-lg">Manage Opportunities</Typography>
        <Button onClick={() => setOpen(true)} leftIcon={<IconPlus size={18} />}>
          Create a new opportunities
        </Button>
      </Group>
      {trainings ? (
        trainings.map((training) => {
          return (
            <TrainingCard key={training.id} variant="horizontal" {...training}>
              <AdminTrainingInfo trainingId={training.id} />
            </TrainingCard>
          );
        })
      ) : (
        <Skeleton h={80} w={"full"} />
      )}
    </Stack>
  );
};
