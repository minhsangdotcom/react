import { RouteObject } from "react-router-dom";
import Profile from "@/features/profile/Profile";
import PrivateRoute from "@/routes/RequiredAuth";
import Home from "@/features/home/Home";
import RolePage from "@/features/role/Role";
import UserPage from "@/features/user/User";

import "@/styles/table.css";
import Layout from "@/layouts/Layout";

const PrivateRoutes: RouteObject = {
  element: <PrivateRoute />,
  children: [
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/profile", element: <Profile /> },
        { path: "/identity/roles", element: <RolePage /> },
        { path: "/identity/users", element: <UserPage /> },
      ],
    },
  ],
};

export default PrivateRoutes;
