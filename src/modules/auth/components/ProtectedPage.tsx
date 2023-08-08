import { routePaths } from "@/routes";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Loader, Stack } from "@mantine/core";

export const withAuth = <P extends object>(
  OriginalComponent: React.ComponentType<P>
): React.FC<P> => {
  const NewComponent: React.FC<P> = (props) => {
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const navigate = useNavigate();

    React.useEffect(() => {
      if (!user && !loading) {
        navigate(routePaths.SIGNIN);
      }
    }, [user, loading, navigate]);
    return <OriginalComponent {...props} />;
  };

  return NewComponent;
};

interface Props {
  children: React.ReactNode;
}

export const ProtectedPage: React.FC<Props> = ({ children }) => {
  const [user, isAdmin] = useAuthStore((state) => [state.user, state.isAdmin]);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const pathname = location.pathname;
    if (!user && !loading) {
      navigate(routePaths.SIGNIN, {
        state: {
          redirectTo: location,
        },
      });
    }
    if (user && !isAdmin && pathname.includes("/admin")) navigate("/");
  }, [user, loading, location, isAdmin, navigate]);

  if (loading)
    return (
      <Stack h="100dvh" w="100%" justify="center" align="center">
        <Loader />
      </Stack>
    );

  return <>{children}</>;
};
