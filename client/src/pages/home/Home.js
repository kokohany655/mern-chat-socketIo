import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Outlet, useLocation } from "react-router-dom";
import baseUrl from "../../api/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  setOnlineUser,
  setSocketConnection,
} from "../../redux/reducer/userSlice";
import SideBar from "../../components/home/SideBar";
import logo from "../../images/logo.png";
import io from "socket.io-client";

const Home = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const getUserDetails = async () => {
    try {
      const config = {
        withCredentials: true,
      };
      const response = await baseUrl.get("/api/v1/auth/loggedUser", config);

      dispatch(setUser(response?.data?.data));
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_API, {
      auth: {
        token: localStorage.getItem("token-chat-forge"),
      },
      withCredentials: true,
    });

    socket.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const isRootPath = location.pathname === "/";

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-">
      <section
        className={`rounded-tr-xl rounded-br-xl shadow-xl ${
          !isRootPath ? "hidden" : ""
        } lg:block `}
      >
        <SideBar user={user} />
      </section>
      <section className={`${isRootPath ? "hidden" : "block"} `}>
        <Outlet />
      </section>
      <div
        className={`justify-center items-center ${
          !isRootPath ? "hidden" : "lg:flex lg:flex-col"
        } `}
      >
        <img src={logo} />
        <div>select user to send a message</div>
      </div>
    </div>
  );
};

export default Home;
