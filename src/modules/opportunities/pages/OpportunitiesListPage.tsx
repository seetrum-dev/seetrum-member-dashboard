import { ProtectedPage } from "@/modules/auth/components/ProtectedPage";
import { TrainingEmptyState } from "@/modules/trainings/components/EmptyState";
import { TrainingCard } from "@/modules/trainings/components/TrainingCard";
import { TrainingToolbar } from "@/modules/trainings/components/TrainingToolbar";
import { trainingModelDummy } from "@/types/models/training";
import { Typography } from "@/ui/Typography";
import { Stack } from "@mantine/core";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import { useOpportunities } from "../store/useOpportunities";

export const OpportunitiesListPage = () => {
  const { opportunities, loading } = useOpportunities(
    (s) => ({ opportunities: s.opportunities, loading: s.loading }),
    shallow
  );
  const getOpportunities = useOpportunities((s) => s.getOpportunities);
  const setOpportunitiesSort = useOpportunities((s) => s.setOpportunitiesSort);

  const [searchVal, setSearchV] = useState("");

  useEffect(() => {
    getOpportunities();
  }, []);

  const opportunityList = opportunities
    ?.filter((oppt) =>
      searchVal
        ? oppt.title.toLowerCase().includes(searchVal.toLowerCase())
        : true
    )
    .map((oppt) => {
      const isClosed = oppt.dueDate.seconds < Timestamp.now().seconds;
      return (
        <TrainingCard key={oppt.id} variant="horizontal" {...oppt}>
          {isClosed && (
            <Typography textVariant="body-md" color="dimmed">
              No longer accepting applications
            </Typography>
          )}
        </TrainingCard>
      );
    });

  const isEmpty = opportunityList === undefined || opportunityList.length === 0;
  return (
    <ProtectedPage>
      <Stack>
        <Typography textVariant="headline-lg">All Opportunities</Typography>
      </Stack>
      <TrainingToolbar
        myTrainings={false}
        onSearchChanged={(val) => setSearchV(val)}
        onSortChanged={([sortBy, orderBy]) =>
          setOpportunitiesSort(sortBy, orderBy)
        }
      />
      <Stack spacing={24} pt={16} pb={80}>
        {loading || opportunities === undefined
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
          />
        )}
      </Stack>
    </ProtectedPage>
  );
};
