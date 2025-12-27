import { RouteObject } from "react-router-dom";
import Profile from "../pages/profile/profile";
import PrivateRoute from "./privateRoute";
import Home from "../pages/home/home";
import RolePage from "../pages/role/role";
import UserPage from "../pages/user/user";

import "@/src/styles/tableStyle.css";
import AdminLayout from "../layouts/AdminLayout";

const privateRoutes: RouteObject = {
  element: <PrivateRoute />,
  children: [
    {
      element: <AdminLayout />, // 🧱 layout
      children: [
        { path: "/", element: <Home /> },
        { path: "/profile", element: <Profile /> },
        { path: "/identity/roles", element: <RolePage /> },
        { path: "/identity/users", element: <UserPage /> },
      ],
    },
  ],
};

export default privateRoutes;
