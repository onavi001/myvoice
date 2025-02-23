import { RouteObject } from "react-router-dom";
import { formRoutes } from "../pages/FormPage/FormPage.routes";
import { progressRoutes } from "../pages/ProgressPage/ProgressPage.routes";
import { routineRoutes } from "../pages/RoutinePage/RoutinePage.routes";


export const appRoutes: RouteObject[] = [
  ...routineRoutes,
  ...progressRoutes,
  ...formRoutes,
  {
    path: "*",
    Component: () => {
      return <div className="p-6 text-center">404 - Página no encontrada</div>;
    },
  },
];