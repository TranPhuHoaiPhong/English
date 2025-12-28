import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

export const routes = [
  { path: "/", element: HomePage },
  { path: "*", element: NotFoundPage },
];
