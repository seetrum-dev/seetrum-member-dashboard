import { Stack } from "@mantine/core";
import { Typography } from "../Typography";

export const FieldViewer = ({
  label,
  value,
}: {
  label: string;
  value?: string | Number;
}) => {
  return (
    <Stack spacing={4}>
      <Typography
        textVariant="label-lg"
        sx={(t) => ({ color: t.fn.rgba(t.colors.night[5], 0.6) })}
      >
        {label}
      </Typography>
      <Typography textVariant="body-lg">{value?.toString()}</Typography>
    </Stack>
  );
};
