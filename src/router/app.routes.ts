import { RouteObject } from "react-router-dom";
import { gymRoutineRoutes } from "../pages/gymRoutine/gymRoutine.routes";

export const appRoutes: RouteObject[] = [
  ...gymRoutineRoutes,
];