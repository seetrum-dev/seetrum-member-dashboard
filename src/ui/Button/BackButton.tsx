import { Button, ButtonProps } from "@mantine/core";
import { Link, To } from "react-router-dom";
import { IconArrowLeft } from "../Icons";

interface BackButtonProps {
  to: To;
}

export const BackButton: React.FC<BackButtonProps & ButtonProps> = ({
  to,
  ...buttonProps
}) => {
  return (
    <Link to={to}>
      <Button
        c="black"
        size="md"
        p={0}
        variant="subtle"
        leftIcon={<IconArrowLeft />}
        {...buttonProps}
      >
        Back
      </Button>
    </Link>
  );
};
