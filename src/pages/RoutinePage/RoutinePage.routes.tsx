import { RouteObject } from "react-router-dom";
import { RoutinePage } from "./RoutinePage";
import { RoutineFormPage } from "./RoutineFormPage";

export const routineRoutes: RouteObject[] = [
  {
    path: "/routine",
    children:[
      {
        index:true,
        Component: () => {
          return <RoutinePage />;
        }
      },{
        path: "add-routine",
        Component: () => {
            return <RoutineFormPage />;
        },
      },{
        path: "edit-routine/:routineIndex",
        Component: () => {
            return <RoutineFormPage />;
        }
      }
    ]
  },
];