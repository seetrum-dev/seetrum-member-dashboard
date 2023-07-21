import { ProtectedPage } from "@/modules/auth/components/ProtectedPage";
import { TrainingCard } from "@/modules/trainings/components/TrainingCard";
import {
  AppShell,
  Box,
  Container,
  Flex,
  MediaQuery,
  Skeleton,
  Stepper,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { LoaderFunctionArgs, Outlet, useLoaderData } from "react-router-dom";
import { Header } from "../Header";
import { Typography } from "../Typography";
import { Training } from "@/types/models/training";
import { getTrainingById } from "@/modules/trainings/services/trainingService";

const ALL_STEPS = [
  {
    title: "Personal information",
    description:
      "Please provide your accurate personal information, including your full name, email address, phone number, age, gender, and current employment status.",
  },
  {
    title: "Additional information",
    description:
      "Please complete any additional forms or questionnaires that are required for the application process.",
  },
  {
    title: "Required documents",
    description:
      "Upload the required documents for your application, including your comprehensive CV, professional photo, valid diploma/degree certificate, government-issued ID card, and supporting documents (evidence of previous energy audit experience).",
  },
];

export const applicationTrainingSupportDataLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  try {
    // TODO: use cached data here
    const training = params.id ? await getTrainingById(params.id) : undefined;
    return training;
  } catch (error) {
    throw error;
  }
};

export const FormFillingLayout = () => {
  const [step, setStep] = useState<number>(0);
  const [steps, setSteps] = useState(ALL_STEPS);
  const theme = useMantineTheme();
  const training = useLoaderData() as Training;

  useEffect(() => {
    if (!training.formMetas) {
      setSteps([ALL_STEPS[0], ALL_STEPS[2]]);
    }
  }, [training]);

  const MAX_STEP = steps.length - 1;
  return (
    <AppShell
      header={<Header opened={false} setOpened={() => {}} withoutNavigation />}
    >
      <ProtectedPage>
        <Container>
          <Flex
            direction="column"
            gap={24}
            sx={{
              position: "relative",
            }}
          >
            <Typography textVariant="headline-lg">
              Training Application Form
            </Typography>
            <Flex gap={24} justify={"space-between"}>
              <Flex direction="column" gap={24} pb={80}>
                <Flex
                  direction="column"
                  p={20}
                  gap={8}
                  sx={{
                    flexGrow: 0,
                    backgroundColor: theme.colors.platinum[1],
                    borderRadius: theme.radius.lg,
                  }}
                >
                  <Stepper
                    active={step}
                    onStepClick={setStep}
                    allowNextStepsSelect={false}
                  >
                    {steps.map((step) => (
                      <Stepper.Step key={step.title} />
                    ))}
                  </Stepper>
                  <Typography textVariant="title-lg">
                    {steps[step].title}
                  </Typography>
                  <Typography>{steps[step].description}</Typography>
                </Flex>
                <Outlet context={[step, setStep, training, MAX_STEP]} />
              </Flex>
              <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                <Flex w={308} sx={{ flexShrink: 0 }}>
                  <Skeleton visible={!Boolean(training)}>
                    <Box sx={{ position: "sticky", top: 75 }}>
                      <TrainingCard variant="vertical" {...training} />
                    </Box>
                  </Skeleton>
                </Flex>
              </MediaQuery>
            </Flex>
          </Flex>
        </Container>
      </ProtectedPage>
    </AppShell>
  );
};
