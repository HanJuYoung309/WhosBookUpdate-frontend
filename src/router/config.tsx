
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Login from "../pages/auth/login/page";
import SignUp from "../pages/auth/signup/page";
import CreateCuration from "../pages/curation/create/page";
import CurationDetail from "../pages/curation/detail/page";
import EditCuration from "../pages/curation/edit/page";
import CurationList from "../pages/curation/list/page";
import CuratorProfile from "../pages/curator/profile/page";
import CuratorList from "../pages/curator/list/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/curation/create",
    element: <CreateCuration />,
  },
  {
    path: "/curation/:id",
    element: <CurationDetail />,
  },
  {
    path: "/curation/edit/:id",
    element: <EditCuration />,
  },
  {
    path: "/curations",
    element: <CurationList />,
  },
  {
    path: "/curator/:id",
    element: <CuratorProfile />,
  },
  {
    path: "/curators",
    element: <CuratorList />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
