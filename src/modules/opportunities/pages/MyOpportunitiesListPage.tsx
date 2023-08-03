import { ProtectedPage } from "@/modules/auth/components/ProtectedPage";
import { TrainingEmptyState } from "@/modules/trainings/components/EmptyState";
import {
  ApplicationStatusUpdate,
  TrainingCard,
} from "@/modules/trainings/components/TrainingCard";
import { TrainingToolbar } from "@/modules/trainings/components/TrainingToolbar";
import { Typography } from "@/ui/Typography";
import { Button, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useOpportunities } from "../store/useOpportunities";
import { shallow } from "zustand/shallow";
import { trainingModelDummy } from "@/types/models/training";
import { Timestamp } from "firebase/firestore";
import { MyTrainingFilter } from "@/modules/trainings/components/MyTrainingFilter";
import { useOpportunitiesMember } from "../store/useOpportunitiesMember";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import { TrainingMemberStatus } from "@/types/models/trainingMember";
import { useNavigate } from "react-router-dom";

export const MyOpportunitiesListPage = () => {
  const user = useAuthStore((s) => s.user);
  const { opportunitiesMember, loading } = useOpportunitiesMember(
    (s) => ({ opportunitiesMember: s.opportunitiesMember, loading: s.loading }),
    shallow
  );
  const getOpportunitiesMember = useOpportunitiesMember(
    (s) => s.getOpportunitiesMember
  );
  const opportunities = useOpportunities((s) => s.opportunities);
  const getOpportunities = useOpportunities((s) => s.getOpportunities);

  const [searchVal, setSearchV] = useState("");
  const [filter, setFilter] = useState<TrainingMemberStatus>();

  const navigate = useNavigate();

  useEffect(() => {
    getOpportunities();
    if (user) getOpportunitiesMember(user.id);
  }, [user]);

  const opportunityList = opportunitiesMember
    ?.filter((oppt) => (filter ? oppt.status === filter : true))
    .map((opMember) => {
      const oppt = opportunities?.find((op) => op.id === opMember.trainingId);
      if (!oppt) return undefined;

      return (
        <TrainingCard key={oppt.id} variant="horizontal" {...oppt}>
          <ApplicationStatusUpdate trainingId={oppt.id} />
        </TrainingCard>
      );
    })
    .filter((op) => op !== undefined);

  const isEmpty = opportunityList === undefined || opportunityList.length === 0;
  return (
    <ProtectedPage>
      <Stack>
        <Typography textVariant="headline-lg">My Opportunities</Typography>
      </Stack>
      <TrainingToolbar
        myTrainings={true}
        onSearchChanged={(val) => setSearchV(val)}
        onSortChanged={() => {}}
      >
        <MyTrainingFilter
          value=""
          onChange={(val) => setFilter(val as TrainingMemberStatus)}
        />
      </TrainingToolbar>
      <Stack spacing={24} pt={16} pb={80}>
        {loading || opportunitiesMember === undefined
          ? Array(8)
              .fill("")
              .map((__o, id) => {
                return (
                  <TrainingCard
                    key={id}
                    loading
                    variant="horizontal"
                    {...trainingModelDummy}
                    thumbnailFileName=""
                    id="-"
                    createdAt={Timestamp.now()}
                    updatedAt={Timestamp.now()}
                  />
                );
              })
          : opportunityList}
        {isEmpty && (
          <TrainingEmptyState
            variants={searchVal ? "opportunityNotFound" : "opportunityEmpty"}
          >
            <Button onClick={() => navigate("/opportunities")}>
              Browse opportunities
            </Button>
          </TrainingEmptyState>
        )}
      </Stack>
    </ProtectedPage>
  );
};
