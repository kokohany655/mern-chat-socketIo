import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import baseUrl from "../../api/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setOnlineUser } from "../../redux/reducer/userSlice";
import SideBar from "../../components/home/SideBar";
import logo from "../../images/logo.png";
import io from "socket.io-client";


const Home = () => {
  const navigate = useNavigate()

  const location = useLocation();
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
      
        const response = await baseUrl.get("/api/v1/auth/loggedUser", { withCredentials: true });
        dispatch(setUser(response?.data?.data));
      } catch (error) {
        toast.error(error?.response?.data?.error);
      }
    };

    getUserDetails();

  }, [dispatch])
  
  useEffect(() => {
    const getToken = localStorage.getItem("token-chat-forge")
    if(!getToken){
      navigate('/login')
    }
  }, [])

  useEffect(() => {

    

    if (!socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_BACKEND_API, {
        auth: { token: localStorage.getItem("token-chat-forge") },
        withCredentials: true,
      });

      socketRef.current.on("onlineUser", (data) => {
        dispatch(setOnlineUser(data));
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
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
        <SideBar />
      </section>
      <section className={`${isRootPath ? "hidden" : "block"} `}>
        <Outlet />
      </section>
      <div
        className={`justify-center items-center ${
          !isRootPath ? "hidden" : "lg:flex lg:flex-col hidden"
        } `}
      >
        <img src={logo} />
        <div>select user to send a message</div>
      </div>
    </div>
  );
};

export default Home;
