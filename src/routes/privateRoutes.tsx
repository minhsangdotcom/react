import { RouteObject } from "react-router-dom";
import Profile from "../pages/profile/profile";
import PrivateRoute from "./privateRoute";
import Home from "../pages/home/home";
import RolePage from "../pages/role/role";
import UserPage from "../pages/user/user";

const privateRoutes: RouteObject = {
  element: <PrivateRoute />,
  children: [
    { path: "/profile", element: <Profile /> },
    { path: "/role", element: <RolePage /> },
    { path: "/user", element: <UserPage /> },
    { path: "/", element: <Home /> },
  ],
};

export default privateRoutes;
