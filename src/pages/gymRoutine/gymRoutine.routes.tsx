import { RouteObject } from "react-router-dom";
import { GymRoutine } from "./GymRoutine";

export const gymRoutineRoutes: RouteObject[] = [
  {
    path: "/gymroutine",
    Component: ()=>{
        return <GymRoutine/>;
    },
  },
];