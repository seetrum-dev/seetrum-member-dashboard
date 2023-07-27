import { Divider, SegmentedControl, Stack } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { Typography } from "../Typography";

export interface TabbarData {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const TabBar: React.FC<{ data: TabbarData[] }> = ({ data }) => {
  const { tabId } = useParams();
  const navigate = useNavigate();

  const modData: { label: React.ReactNode; value: string }[] = data.map(
    (datum) => ({
      value: datum.value,
      label: (
        <>
          {datum.icon}
          <Typography textVariant="label-lg">{datum.label}</Typography>
        </>
      ),
    })
  );

  return (
    <Stack w="100%" pt={16} sx={{ zIndex: 100 }} spacing={24}>
      <SegmentedControl
        radius={"100px"}
        fullWidth={false}
        size="md"
        value={tabId ?? data[0].value}
        onChange={(value) => navigate(value)}
        sx={(t) => ({
          width: "fit-content",
          background: "transparent",
          gap: 16,
          label: {
            width: "fit-content",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "12px 16px",
            gap: 8,
            ":hover": {
              background: t.fn.rgba(t.colors.night[5], 0.08),
            },
          },
          "& .mantine-SegmentedControl-indicator": {
            boxShadow: "none",
            background: t.colors.moonstone[0],
          },
          "& .mantine-SegmentedControl-control": {
            border: "none !important",
          },
        })}
        data={modData}
      />
      <Divider />
    </Stack>
  );
};
