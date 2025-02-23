import { RouteObject } from "react-router-dom";
import { RoutinePage } from "./RoutinePage";

export const routineRoutes: RouteObject[] = [
  {
    path: "/routine",
    Component: () => {
      return <RoutinePage />;
    },
  },
];