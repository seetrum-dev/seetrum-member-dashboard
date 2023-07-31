import { pretyDate } from "@/lib/utils";
import { useTrainings } from "@/modules/trainings/store/useTrainings";
import { Training } from "@/types/models/training";
import { IconEdit } from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import {
  Stack,
  Skeleton,
  Loader,
  TypographyStylesProvider,
  Box,
  Flex,
  useMantineTheme,
  Button,
  SimpleGrid,
  Divider,
} from "@mantine/core";
import { useState, ReactElement, useEffect } from "react";
import { useParams } from "react-router-dom";

export const TrainingInfoViewer = ({
  onChangeMode,
}: {
  onChangeMode: () => void;
}) => {
  const thm = useMantineTheme();
  const { getTrainingsById } = useTrainings();
  const { id } = useParams();
  const [training, setTraining] = useState<Training>();

  const Sections = ({
    label,
    loading,
    children,
  }: {
    label: string;
    loading?: ReactElement | boolean;
    children?: ReactElement;
  }) => {
    return (
      <Stack spacing={8}>
        <Typography textVariant="title-md">{label}</Typography>
        {loading || children === undefined ? (
          typeof loading !== "object" ? (
            <Flex align="center" h={14 * 1.55 /* lineHeight */}>
              <Skeleton width="35%" height={14} />
            </Flex>
          ) : (
            loading
          )
        ) : (
          children
        )}
      </Stack>
    );
  };

  useEffect(() => {
    id && getTrainingsById(id).then((t) => t && setTraining(t));
  }, [getTrainingsById, id]);

  return (
    <Stack
      mt={8}
      spacing={16}
      p={16}
      pb={20}
      sx={{
        borderRadius: 16,
        border: "1px solid",
        borderColor: thm.fn.rgba(thm.colors.night[5], 0.12),
      }}
    >
      <Flex gap={16} align="center">
        <Typography textVariant="title-lg" sx={{ flex: 1 }}>
          General Info
        </Typography>
        <Button
          variant="subtle"
          radius={8}
          leftIcon={<IconEdit />}
          onClick={() => onChangeMode()}
        >
          <Typography textVariant="label-lg">Edit</Typography>
        </Button>
      </Flex>
      <Stack spacing={16}>
        <Sections label="Training Title">
          {training && <Typography>{training.title}</Typography>}
        </Sections>
        <Divider />
        <SimpleGrid cols={2}>
          <Sections label="Trainer">
            {training && training.trainerName ? (
              <Typography>{training.trainerName}</Typography>
            ) : undefined}
          </Sections>
          <Sections label="Application Deadline">
            {training && training.dueDate && (
              <Typography>{pretyDate(training?.dueDate.toDate())}</Typography>
            )}
          </Sections>
        </SimpleGrid>
        <Divider />
        <Sections
          label="Description"
          loading={
            !Boolean(training?.description) ? (
              <Loader py={32} w="100%" px="auto" />
            ) : (
              false
            )
          }
        >
          <TypographyStylesProvider>
            <Box
              dangerouslySetInnerHTML={{ __html: training?.description ?? "" }}
            />
          </TypographyStylesProvider>
        </Sections>
      </Stack>
    </Stack>
  );
};
