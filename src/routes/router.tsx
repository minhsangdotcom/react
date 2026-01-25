import { BrowserRouter, useRoutes } from "react-router-dom";
import PublicRoutes from "@/routes/PublicRoute";
import PrivateRoutes from "@/routes/PrivateRoute";

const AppRoutes = () => {
  const routes = useRoutes([...PublicRoutes, PrivateRoutes]);
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
