import {
  SupportingFileField,
  ThumbnailPicker,
} from "@/modules/trainingManagement/components/info";
import {
  TrainingInfoEditor,
  TrainingInfoViewer,
} from "@/modules/trainingManagement/pages/info";
import { updateTraining } from "@/modules/trainings/services/trainingService";
import { showErrorNotif } from "@/ui/notifications";
import { Grid, Stack } from "@mantine/core";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export const TrainingInfoManagement = () => {
  const [searchParams] = useSearchParams();
  const { id: trainingId } = useParams();
  const [mode, setMode] = useState<"edit" | "view">(
    searchParams.getAll("edit")[0] ? "edit" : "view"
  );
  return (
    <Grid>
      <Grid.Col md={8} mb={80}>
        <Stack spacing={24}>
          {mode === "view" && (
            <TrainingInfoViewer onChangeMode={() => setMode("edit")} />
          )}
          {mode === "edit" && (
            <TrainingInfoEditor
              onSubmit={async (trainingData) => {
                try {
                  if (trainingId) {
                    await updateTraining(trainingId, trainingData);
                  }
                } catch (e) {
                  showErrorNotif({ title: "Update training error" });
                } finally {
                  setMode("view");
                }
              }}
            />
          )}
          <ThumbnailPicker />
          <SupportingFileField />
        </Stack>
      </Grid.Col>
    </Grid>
  );
};
