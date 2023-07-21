import { comingSoonUrl } from "@/lib/assets";
import { Typography } from "@/ui/Typography";
import { Stack } from "@mantine/core";
import { ReactNode } from "react";

export const EmptyData: React.FC<{ desc?: string; children?: ReactNode }> = ({
  desc,
  children,
}) => {
  return (
    <Stack spacing={32} w="100%" justify="center" align="center" py={40}>
      <img height={220} src={comingSoonUrl} alt={"coming soon"} />
      <Stack spacing={8} maw={"min(100%, 640px)"}>
        <Typography textVariant="title-md" align="center">
          No Joined Events Yet
        </Typography>
        <Typography textVariant="body-md" color="dimmed" align="center">
          {desc ||
            "Stay tuned for upcoming events on energy efficiency. Our team is working diligently to conduct insightful events. Check back soon for updates."}
        </Typography>
      </Stack>
      {children}
    </Stack>
  );
};
