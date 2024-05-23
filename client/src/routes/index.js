import Layout from "../components/Layout/Layout";
import Chat from "../pages/chat/Chat";

const { createBrowserRouter } = require("react-router-dom");
const { default: App } = require("../App");
const { default: Register } = require("../pages/auth/Register");
const { default: Login } = require("../pages/auth/Login");
const { default: Home } = require("../pages/home/Home");

const router = createBrowserRouter([
  {
    path: "/",
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
