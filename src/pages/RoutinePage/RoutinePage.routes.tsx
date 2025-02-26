import { RouteObject } from "react-router-dom";
import { RoutinePage } from "./RoutinePage";
import { AddRoutinePage } from "./AddRoutinePage";
import { EditRoutinePage } from "./EditRoutinePage";

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
            return <AddRoutinePage />;
        },
      },{
        path: ":routineIndex",
        Component: () => {
            return <EditRoutinePage />;
        }
      }
    ]
  },
];