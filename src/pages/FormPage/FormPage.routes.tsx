import { RouteObject } from "react-router-dom";
import { FormPage } from "./FormPage";

export const formRoutes: RouteObject[] = [
  {
    path: "/",
    Component: () => {
      return <FormPage />;
    },
  },
];