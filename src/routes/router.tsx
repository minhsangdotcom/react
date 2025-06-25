import { BrowserRouter, useRoutes } from "react-router-dom";
import publicRoutes from "./publicRoutes";
import privateRoutes from "./privateRoutes";

const AppRoutes = () => {
  const routes = useRoutes([...publicRoutes, privateRoutes]);
  return routes;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default AppRouter;
