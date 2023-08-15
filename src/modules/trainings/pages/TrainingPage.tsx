import { ProtectedPage } from "@/modules/auth/components/ProtectedPage";
import { Typography } from "@/ui/Typography";
import { Button, Flex } from "@mantine/core";
import React, { useState } from "react";
import { MyTrainingFilter } from "../components/MyTrainingFilter";
import {
  ApplicationStatusUpdate,
  TrainingCard,
} from "../components/TrainingCard";
import { TrainingToolbar } from "../components/TrainingToolbar";
import { useTrainings } from "../store/useTrainings";
import { trainingModelDummy } from "@/types/models/training";
import { Timestamp } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import { useTrainingMember } from "../store/useTrainingMember";
import { TrainingMemberStatus } from "@/types/models/trainingMember";
import { TrainingEmptyState } from "../components/EmptyState";

export const TrainingsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const myTrainings = Boolean(location.pathname.includes("mytrainings"));
  const loading = useTrainings((state) => state.loading);
  const trainings = useTrainings((state) => state.trainings);
  const getTrainings = useTrainings((state) => state.getTrainings);
  const setTrainingSort = useTrainings((state) => state.setSortings);
  const member = useAuthStore((s) => s.user);
  const trainingMembers = useTrainingMember((s) => s.trainingMember);
  const getTMByTID = useTrainingMember((s) => s.getTrainingMemberByMemberId);

  const [filter, setFilter] = useState<TrainingMemberStatus | undefined>(
    undefined
  );
  const [searchVal, setSearchV] = useState("");

  React.useEffect(() => {
    getTrainings();
    if (member) getTMByTID(member.id);
  }, [getTrainings, getTMByTID, member]);

  const trainingList = !myTrainings
    ? trainings
        ?.filter((t) =>
          searchVal
            ? t.title.toLowerCase().includes(searchVal.toLowerCase())
            : true
        )
        .map((trainingData, idx) => {
          const isClosed =
            trainingData.dueDate.seconds < Timestamp.now().seconds;
          return (
            <TrainingCard
              key={trainingData.id}
              variant="horizontal"
              {...trainingData}
            >
              {isClosed && (
                <Typography textVariant="body-md" color="dimmed">
                  No longer accepting applications
                </Typography>
              )}
            </TrainingCard>
          );
        })
    : trainingMembers
        ?.filter((tm) => (filter ? tm.status === filter : true))
        .map((tm) => {
          const t = trainings?.find(
            (t) =>
              t.id === tm.trainingId &&
              (searchVal
                ? t.title.toLowerCase().includes(searchVal.toLowerCase())
                : true)
          );
          if (t) {
            return (
              <TrainingCard key={tm.id} variant="horizontal" {...t}>
                <ApplicationStatusUpdate trainingId={t.id} />
              </TrainingCard>
            );
          }
          return undefined;
        })
        .filter((t) => t);
  return (
    <ProtectedPage>
      <Flex direction="column">
        <Typography textVariant="headline-lg">
          {(myTrainings ? "My" : "All") + " Trainings"}
        </Typography>
        {/* Toolbar */}
        <TrainingToolbar
          myTrainings={myTrainings}
          // TODO: Update this function handle
          onSearchChanged={(val) => setSearchV(val)}
          onSortChanged={(val) => setTrainingSort(val[0], val[1])}
        >
          {myTrainings && (
            <MyTrainingFilter
              value=""
              onChange={(val) => setFilter(val as TrainingMemberStatus)}
            />
          )}
        </TrainingToolbar>
        <Flex gap={24} direction="column" pt={16} pb={80}>
          {loading || !trainings || !trainingList ? (
            Array(4)
              .fill("-")
              .map((e, i) => {
                return (
                  <TrainingCard
                    key={i}
                    loading={loading}
                    variant="horizontal"
                    id="-"
                    createdAt={Timestamp.now()}
                    updatedAt={Timestamp.now()}
                    {...trainingModelDummy}
                    thumbnailFileName=""
                  />
                );
              })
          ) : trainingList.length > 0 ? (
            trainingList
          ) : (
            <TrainingEmptyState
              variants={
                myTrainings
                  ? filter || searchVal
                    ? "myTrainingNotFound"
                    : "myTrainingEmpty"
                  : searchVal
                  ? "trainingNotFound"
                  : "trainingEmpty"
              }
            >
              {myTrainings && !(filter || searchVal) && (
                <Button onClick={() => navigate("/trainings")}>
                  Browse trainings
                </Button>
              )}
            </TrainingEmptyState>
          )}
        </Flex>
      </Flex>
    </ProtectedPage>
  );
};
