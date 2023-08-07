import { Button, ButtonProps } from "@mantine/core";
import { Link, To, useLocation } from "react-router-dom";
import { IconArrowLeft } from "../Icons";
import { ReactNode } from "react";

interface BackButtonProps {
  to: To;
  label?: string | ReactNode;
}

export const BackButton: React.FC<BackButtonProps & ButtonProps> = ({
  to,
  label,
  ...buttonProps
}) => {
  const { state } = useLocation();
  return (
    <Link to={to} state={state}>
      <Button
        c="black"
        size="md"
        p={0}
        variant="subtle"
        leftIcon={<IconArrowLeft />}
        sx={{
          ":hover": {
            textDecoration: "underline",
            backgroundColor: "transparent",
          },
        }}
        {...buttonProps}
      >
        {label || "Back"}
      </Button>
    </Link>
  );
};
