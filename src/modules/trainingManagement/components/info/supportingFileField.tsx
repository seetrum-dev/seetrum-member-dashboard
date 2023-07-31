import { kFileMaxSize } from "@/lib/constants";
import { updateTraining } from "@/modules/trainings/services/trainingService";
import { useTrainings } from "@/modules/trainings/store/useTrainings";
import { uploadFile } from "@/services/firebase/storage";
import { Training } from "@/types/models/training";
import { FileScreeningCard } from "@/ui/Card/FileScreeningCard";
import { IconPlus } from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import { showErrorNotif } from "@/ui/notifications";
import {
  Button,
  FileButton,
  Loader,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export const SupportingFileField = () => {
  const { id: trainingId } = useParams();
  const thm = useMantineTheme();
  const { getTrainingsById, updateTraining: updateActiveTraining } =
    useTrainings();
  const [training, setTraining] = useState<Training>();
  const [loading, setLoading] = useState<boolean>();
  const resetRef = useRef<() => void>(null);

  useEffect(() => {
    trainingId && getTrainingsById(trainingId).then((t) => t && setTraining(t));
  }, [getTrainingsById, trainingId]);

  const submitFile = async (file: File[]) => {
    try {
      setLoading(true);

      if (file.some((f) => f.size > kFileMaxSize)) {
        throw Error("File size limit exceeded");
      }

      const promises = file.map((f) => uploadFile(f, "certificate"));
      const newFileInfo = await Promise.all(promises);

      if (trainingId && training) {
        await updateTraining(trainingId, {
          attachments: [training.attachments, newFileInfo].flat(),
        });
        await updateActiveTraining({
          ...training,
          attachments: [training.attachments, newFileInfo].flat(),
        });

        getTrainingsById(trainingId).then((t) => t && setTraining(t));
      }
    } catch (e) {
      showErrorNotif({ title: "Uploading file(s) error" });
      console.error(e);
    } finally {
      setLoading(false);
      resetRef.current?.();
    }
  };

  return (
    <Stack
      spacing={16}
      px={16}
      pt={24}
      pb={20}
      sx={{
        borderRadius: 16,
        border: "1px solid",
        borderColor: thm.fn.rgba(thm.colors.night[5], 0.12),
      }}
    >
      <Typography textVariant="title-lg">Attachments</Typography>
      {!training ? (
        <Loader py={32} px="auto" w="100%" />
      ) : training.attachments.length === 0 ? (
        <Typography w="100%" align="center" color="dimmed" py={16}>
          <i>No attachments uploaded.</i>
        </Typography>
      ) : (
        training.attachments.map((file) => {
          return (
            <FileScreeningCard
              key={file.filename}
              {...file}
              onDelete={async () => {
                if (trainingId && training) {
                  const attachments = training.attachments.filter(
                    (c) => c.filename !== file.filename
                  );
                  await updateTraining(trainingId, {
                    attachments,
                  });
                  await updateActiveTraining({
                    ...training,
                    attachments,
                  });

                  getTrainingsById(trainingId).then((t) => t && setTraining(t));
                }
              }}
            />
          );
        })
      )}
      <FileButton
        onChange={(e) => submitFile(e)}
        accept="image/*,application/pdf"
        multiple
        resetRef={resetRef}
      >
        {(props) => (
          <Button
            {...props}
            variant="outline"
            w="fit-content"
            radius={8}
            loading={loading}
            leftIcon={<IconPlus size={18} />}
          >
            Add a new supporting file
          </Button>
        )}
      </FileButton>
    </Stack>
  );
};
