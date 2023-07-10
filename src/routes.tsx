import { useEffect } from "react";
import { RouteObject, useLocation, useNavigate } from "react-router-dom";
import { LoginPage } from "./modules/auth/pages/LoginPage";
import { RegisterOptionAltPage } from "./modules/auth/pages/RegisterOptionAltPage";
import { RegisterOptionPage } from "./modules/auth/pages/RegisterOptionPage";
import { RegisterPage } from "./modules/auth/pages/RegisterPage";
import { DashboardPage } from "./modules/dashboard/pages/DashboardPage";
import { EventListPages } from "./modules/event/pages/eventListPages";
import { PlaygroundPage } from "./modules/playground/PlaygroundPage";
import { TrainingApplicationPage } from "./modules/trainings/pages/TrainingApplicationPage";
import { TrainingDetailPage } from "./modules/trainings/pages/TrainingDetailPage";
import { TrainingsPage } from "./modules/trainings/pages/TrainingPage";
import { ManageTrainingDetail } from "./modules/trainings/pages/manageTrainings/ManageTrainingDetail";
import { ManageDetailTrainingLayout } from "./modules/trainings/pages/manageTrainings/ManageTrainingDetailLayout";
import { ManageTrainingsPage } from "./modules/trainings/pages/manageTrainings/ManageTrainings";
import { ApplicantDetails } from "./modules/trainings/pages/manageTrainings/applicantDetailDrawer";
import { MainLayout } from "./ui/Layout";
import {
  FormFillingLayout,
  applicationTrainingSupportDataLoader,
} from "./ui/Layout/FormFillingLayout";
import { EventDetailPage } from "./modules/event/pages/eventDetailPage";
import { MyEventListPage } from "./modules/event/pages/myEventListPage";
import { EventManagementList } from "./modules/eventManagement/pages/eventList";

const Redirector = ({ path }: { path: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(`Redirecting to ${path} from ${location.pathname}`);
  useEffect(() => {
    if (location.pathname !== path) navigate(path, { replace: true });
  }, [location.pathname, navigate, path]);
  return <></>;
};

const ROUTES = {
  SIGNIN: {
    path: "/signin",
    element: <LoginPage />,
  },
  REGISTER_OPTION: {
    path: "/register-option",
    element: <RegisterOptionPage />,
  },
  REGISTER_OPTION_ALT: {
    path: "/register-option-alt",
    element: <RegisterOptionAltPage />,
  },
  REGISTER: {
    path: "/register",
    element: <RegisterPage />,
  },
  DASHBOARD: {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "events",
        children: [
          {
            index: true,
            element: <EventListPages />,
          },
          {
            path: ":id",
            element: <EventDetailPage />,
          },
        ],
      },
      {
        path: "myevents",
        children: [
          {
            index: true,
            element: <MyEventListPage />,
          },
          {
            path: ":id",
            element: <EventDetailPage />,
          },
        ],
      },
      {
        path: "trainings",
        children: [
          {
            index: true,
            element: <TrainingsPage />,
          },
          {
            path: ":id",
            element: <TrainingDetailPage />,
          },
        ],
      },
      {
        path: "mytrainings",
        children: [
          {
            index: true,
            element: <TrainingsPage />,
          },
          {
            path: ":id",
            element: <TrainingDetailPage />,
          },
        ],
      },
      {
        path: "admin/*",
        children: [
          {
            path: "events",
            children: [
              {
                index: true,
                element: <EventManagementList />,
              },
              {
                path: ":id",
                element: <EventDetailPage />,
              },
            ],
          },
          {
            path: "trainings",
            children: [
              {
                index: true,
                element: <ManageTrainingsPage />,
              },
              {
                path: ":id",
                element: <ManageDetailTrainingLayout />,
                children: [
                  {
                    path: ":tabId?",
                    element: <ManageTrainingDetail />,
                    children: [
                      {
                        path: ":applicantId",
                        element: <ApplicantDetails />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: "*",
            element: <Redirector path="/admin" />,
          },
        ],
      },
    ],
  },
  TRAINING_APPLICATION: {
    path: "trainings/:id/apply",
    loader: applicationTrainingSupportDataLoader,
    element: <FormFillingLayout />,
    children: [
      {
        path: "",
        element: <TrainingApplicationPage />,
      },
    ],
  },
  PLAYGROUND: {
    path: "/admin/playground",
    element: <PlaygroundPage />,
  },
} as const;

type RouteKey = keyof typeof ROUTES;
type RoutePath = (typeof ROUTES)[RouteKey]["path"];

export const routePaths: Record<RouteKey, RoutePath> = Object.keys(
  ROUTES
).reduce((acc, key) => {
  return { ...acc, [key]: ROUTES[key as RouteKey].path };
}, {}) as Record<RouteKey, RoutePath>;

export const routes = Object.values(ROUTES) as RouteObject[];
