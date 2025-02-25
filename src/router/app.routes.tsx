import { Outlet, RouteObject } from "react-router-dom";
import { formRoutes } from "../pages/FormPage/FormPage.routes";
import { progressRoutes } from "../pages/ProgressPage/ProgressPage.routes";
import { routineRoutes } from "../pages/RoutinePage/RoutinePage.routes";
import Navbar from "../components/Navbar";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
export const appRoutes: RouteObject[] = [
  {
    element: <Layout />,
    children:[
      ...routineRoutes,
      ...progressRoutes,
      ...formRoutes,
      {
        path: "*",
        Component: () => {
          return <div className="p-6 text-center">404 - Página no encontrada</div>;
        },
      }
    ],
  }
];