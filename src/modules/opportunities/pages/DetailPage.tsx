import {
  TrainingDetailAttachments,
  TrainingDetailDescription,
  TrainingDetailHeader,
} from "@/modules/trainings/pages/TrainingDetailPage";
import { useFileURLStore } from "@/services/firebase/storage";
import { IconArrowLeft } from "@/ui/Icons";
import { Button, Flex, Image, Loader, Stack } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { useOpportunities } from "../store/useOpportunities";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import { Typography } from "@/ui/Typography";
import { ApplicationTrackingCard } from "@/modules/trainings/components/ApplicationTrackingCard";
import { useAuthStore } from "@/modules/auth/stores/authStore";

export const OpportunityDetailPage = () => {
  const { id: opportunityId } = useParams();
  const navigate = useNavigate();
  const getFileURL = useFileURLStore((s) => s.getFileURL);
  const { opportunities, loading } = useOpportunities(
    (s) => ({ opportunities: s.opportunities, loading: s.loading }),
    shallow
  );
  const getOpportunities = useOpportunities((s) => s.getOpportunities);
  const applicant = useAuthStore((s) => s.user);

  const [imageUrl, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    getOpportunities();
  }, [getOpportunities]);

  const opportunityData = opportunities?.find((op) => op.id === opportunityId);

  useEffect(() => {
    if (!imageUrl && opportunityData)
      getFileURL(opportunityData.thumbnailFileName).then((ur) => setImage(ur));
  }, [
    getFileURL,
    opportunityData,
    opportunityData?.thumbnailFileName,
    imageUrl,
  ]);

  if (!opportunityId || loading)
    return (
      <Stack w="100%" h="min(400px, 50dvh)" justify="center" align="center">
        <Loader />
      </Stack>
    );

  if (opportunityData === undefined)
    return <Typography>Opportunity not found</Typography>;

  return (
    <Stack
      spacing={24}
      align={"flex-start"}
      sx={{
        "& a.mantine-Button-root:hover": {
          backgroundColor: "unset",
          textDecoration: "underline",
        },
      }}
    >
      <Button
        component="a"
        variant="subtle"
        radius="md"
        p={0}
        sx={{
          color: "black",
        }}
        leftIcon={<IconArrowLeft />}
        onClick={() => navigate("..")}
      >
        Back to all opportunities
      </Button>

      <Flex
        gap={24}
        pb={80}
        justify={"space-between"}
        w={"100%"}
        sx={(t) => ({
          flexDirection: "row",
          [t.fn.smallerThan("sm")]: { flexDirection: "column" },
        })}
      >
        <Flex direction="column" gap={24} sx={{ maxWidth: 640, flexGrow: 1 }}>
          <TrainingDetailHeader {...opportunityData} />
          <TrainingDetailDescription {...opportunityData} />
          <TrainingDetailAttachments
            attachments={opportunityData.attachments}
          />
        </Flex>
        <Flex
          sx={(t) => ({
            width: 315,
            [t.fn.smallerThan("sm")]: {
              width: "100%",
              "& img": { display: "none" },
            },
            flexShrink: 0,
          })}
          gap={16}
          direction="column"
        >
          <Image
            withPlaceholder
            height={210}
            radius={"lg"}
            src={imageUrl}
            sx={(t) => ({
              overflow: "hidden",
              borderRadius: "16px",
              border: "1px solid",
              borderColor: t.fn.rgba(t.colors.night[6], 0.08),
            })}
          />
          {/* <ApplicationTrackingCar{d {...tmData} />
          {tmData?.issuedCertificate && (
            <Stack
              spacing={8}
              p={16}
              pt={20}
              sx={(t) => ({
                borderRadius: 16,
                border: "1px solid",
                borderColor: t.fn.rgba(t.colors.night[5], 0.12),
              })}
            >
              <Typography textVariant="title-md" pb={8}>
                Issued Certificate
              </Typography>
              {tmData.issuedCertificate.map((certif) => (
                <FileScreeningCard {...certif} />
              ))}
            </Stack>
          )}} */}
        </Flex>
      </Flex>
    </Stack>
  );
};
