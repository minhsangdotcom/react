import { RouteObject } from "react-router-dom";
import Profile from "@/features/profile/Profile";
import PrivateRoute from "@/routes/RequiredAuth";
import Home from "@/pages/home/home";
import RolePage from "@/features/role/Role";
import UserPage from "@/pages/user/User";

import "@/styles/table.css";
import AdminLayout from "@/layouts/AdminLayout";

const PrivateRoutes: RouteObject = {
  element: <PrivateRoute />,
  children: [
    {
      element: <AdminLayout />,
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
