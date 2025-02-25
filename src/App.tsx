import { RouterProvider } from "react-router/dom";
import { router } from "./router";

const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;