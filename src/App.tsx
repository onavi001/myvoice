import { RouterProvider } from "react-router/dom";
import { router } from "./router";
import { Navbar } from "./components/Navbar";

const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar/>
     <RouterProvider router={router} />
    </div>
  );
};

export default App;