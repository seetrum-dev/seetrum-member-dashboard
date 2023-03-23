import { RouteObject } from "react-router-dom";
import { LoginPage } from "./modules/auth/pages/LoginPage";
import { RegisterPage } from "./modules/auth/pages/RegisterPage";
import { ProfilePage } from "./modules/user/pages/ProfilePage";
import { RegisterOptionPage } from "./modules/auth/pages/RegisterOptionPage";

const ROUTES = {
  LOGIN: {
    path: "/login",
    element: <LoginPage />,
  },
  REGISTER_OPTION: {
    path: "/register-option",
    element: <RegisterOptionPage />,
  },
  REGISTER: {
    path: "/register",
    element: <RegisterPage />,
  },
  PROFILE: {
    path: "/",
    element: <ProfilePage />,
  },
} as const;

type RouteKey = keyof typeof ROUTES;
type RoutePath = typeof ROUTES[RouteKey]["path"];

export const routePaths: Record<RouteKey, RoutePath> = Object.keys(
  ROUTES
).reduce((acc, key) => {
  return { ...acc, [key]: ROUTES[key as RouteKey].path };
}, {}) as Record<RouteKey, RoutePath>;

export const routes = Object.values(ROUTES) as RouteObject[];
