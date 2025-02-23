import { RouteObject } from "react-router-dom";
import { ProgressPage } from "./ProgressPage";

export const progressRoutes: RouteObject[] = [
  {
    path: "/progress",
    Component: () => {
      return <ProgressPage />;
    },
  },
];