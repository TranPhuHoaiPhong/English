import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

export const routes = [
  { path: "/", element: LoginPage },
  { path: "/home", element: HomePage },
  { path: "*", element: NotFoundPage },
];
