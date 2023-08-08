import { comingSoonUrl, notFoundUrl } from "@/lib/assets";
import { Typography } from "@/ui/Typography";
import { Stack } from "@mantine/core";

interface TrainingEmptyStateProps {
  variants: variants;
  children?: React.ReactNode;
}

const contents = {
  myTrainingNotFound: {
    image: notFoundUrl,
    title: "Not Found",
    description:
      "There are no training applications matching your search criteria. Make sure your search or filters are accurate or explore more trainings to expand your options.",
  },
  myTrainingEmpty: {
    image: comingSoonUrl,
    title: "No Training Applications Yet",
    description:
      "Track and access your training applications and certifications in one place. Start your energy efficiency journey by browsing available trainings in the All Trainings page.",
  },
  trainingNotFound: {
    image: notFoundUrl,
    title: "Not Found",
    description:
      "We couldn't find any trainings that match your search criteria. Expand your search or check back later for new training opportunities.",
  },
  trainingEmpty: {
    image: comingSoonUrl,
    title: "No Trainings Available",
    description:
      "Stay tuned for upcoming trainings on energy efficiency. Our team is working diligently to curate valuable training opportunities. Check back soon for updates.",
  },
  opportunityNotFound: {
    image: notFoundUrl,
    title: "Not Found",
    description:
      "We couldn't find any opportunities that match your search criteria. Expand your search or check back later for new opportunities.",
  },
  opportunityEmpty: {
    image: comingSoonUrl,
    title: "No Opportunities Available",
    description:
      "Stay tuned for upcoming opportunities on energy efficiency. Our team is working diligently to curate valuable opportunities. Check back soon for updates.",
  },
};

type variants = keyof typeof contents;

export const TrainingEmptyState: React.FC<TrainingEmptyStateProps> = ({
  variants,
  children,
}) => {
  return (
    <Stack
      align={"center"}
      justify={"center"}
      p={"lg"}
      spacing={32}
      maw={530}
      m={"auto"}
    >
      <img
        height={220}
        src={contents[variants].image ?? comingSoonUrl}
        alt={"coming soon"}
      />
      <Stack spacing={8}>
        <Typography textVariant="title-md" align="center">
          {contents[variants].title}
        </Typography>
        <Typography c="dimmed" textVariant="body-md" align="center">
          {contents[variants].description}
        </Typography>
      </Stack>
      {children}
    </Stack>
  );
};
