import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import App from "../App";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Home from "../pages/home/Home";
import Chat from "../pages/chat/Chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace={true} />, // Redirect to login by default
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: ":userId",
            element: <Chat />,
          },
        ],
      },
      {
        path: "register",
        element: (
          <Layout>
            <Register />
          </Layout>
        ),
      },
      {
        path: "login",
        element: (
          <Layout>
            <Login />
          </Layout>
        ),
      },
    ],
  },
]);

export default router;
