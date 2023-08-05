import {
  IconArrowRight,
  IconAward,
  IconBriefcase,
  IconCalendar,
} from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import {
  Badge,
  Button,
  Flex,
  MediaQuery,
  Stack,
  ThemeIcon,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <IconAward />,
    title: "Explore Trainings",
    label: "traninings",
    description:
      "Enhance your expertise in energy efficiency through our diverse training programs and unlock new career opportunities.",
    link: "/trainings",
  },
  {
    icon: <IconCalendar />,
    label: "events",
    title: "Discover Events",
    description:
      "Explore upcoming events and connect with the energy efficiency community for insightful discussions, workshops, and networking.",
    link: "/events",
  },
  {
    icon: <IconBriefcase />,
    title: "Pursue Opportunities",
    label: "opportunities",
    description:
      "Make a real impact by discovering project opportunities that align with your skills and interests, driving sustainable change.",
    link: "/opportunities",
  },
];

export const FeatureCollectionCard = () => {
  return (
    <MediaQuery smallerThan={"sm"} styles={{ flexDirection: "column" }}>
      <Flex className="features-wrapper" gap={16}>
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </Flex>
    </MediaQuery>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  label: string;
  description: string;
  link?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = (featureData) => {
  const navigate = useNavigate();
  return (
    <Stack
      spacing={16}
      py={20}
      px={16}
      sx={(t) => ({
        flex: 1,
        borderRadius: 16,
        border: "1px solid",
        borderColor: t.fn.rgba(t.colors.night[6], 0.12),
      })}
    >
      <Flex gap={8} align={"center"}>
        <ThemeIcon variant="outline" sx={{ border: "none" }}>
          {featureData.icon}
        </ThemeIcon>
        <Typography textVariant="title-md">{featureData.title}</Typography>
      </Flex>
      <Typography c="dimmed" textVariant="body-md" sx={{ flex: 1 }}>
        {featureData.description}
      </Typography>
      <Flex
        justify={"flex-end"}
        sx={{
          "& a.mantine-Button-root:hover": {
            background: "unset",
            textDecoration: "underline",
          },
        }}
      >
        {featureData.link ? (
          <Button
            component="a"
            variant="subtle"
            rightIcon={<IconArrowRight />}
            p={0}
            onClick={(e) => {
              navigate(featureData.link!);
            }}
          >
            View all {featureData.label}
          </Button>
        ) : (
          <Badge sx={(t) => ({ textTransform: "unset" })}>Coming soon</Badge>
        )}
      </Flex>
    </Stack>
  );
};
