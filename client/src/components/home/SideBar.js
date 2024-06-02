import React, { useState } from "react";
import { BsChatLeftText } from "react-icons/bs";
import { AiOutlineUserAdd } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";
import Avatar from "./Avatar";

import EditUser from "../user/EditUser";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/reducer/userSlice";
import baseUrl from "../../api/baseUrl";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import logo from "../../images/logo.png";
import SearchUser from "../user/SearchUser";
import { io } from "socket.io-client";

const SideBar = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const handleLogout = async () => {
    try {
      const response = await baseUrl.get("/api/v1/auth/logout", {
        withCredentials: true,
      });

      toast.success(response?.data?.message);
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.success(error?.response?.data?.message);
    }
  };
  return (
    <div className=" w-full h-full grid grid-cols-[48px,1fr]">
      <div className=" w-12 h-full  shadow-lg  rounded-tr-lg rounded-br-lg py-8 bg-primary text-[white] flex flex-col justify-between items-center ">
        <div className=" flex flex-col items-center gap-4">
          <div className=" text-2xl cursor-pointer">
            <BsChatLeftText />
          </div>
          <div
            className=" text-2xl cursor-pointer"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <AiOutlineUserAdd />
          </div>
        </div>
        <div className=" flex flex-col items-center gap-4">
          <div
            className=" text-2xl cursor-pointer w-8 h-8"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            <Avatar name={user.name} imageUrl={user.pic} userId={user._id} />
          </div>
          <div
            className=" text-2xl cursor-pointer mr-1"
            onClick={() => handleLogout()}
          >
            <CiLogout />
          </div>
        </div>
      </div>
      <div className="w-full p-3 slideBar overflow-y-auto overflow-x-hidden h-[100vh] flex flex-col gap-4">
        {allUser.length < 1 && (
          <div className=" w-full h-full flex flex-col justify-center items-center gap-3">
            <img src={logo} className=" h-20 w-22" />
            <p className=" text-sm opacity-70">Explore user to start chat</p>
          </div>
        )}
      </div>
      <EditUser
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        user={user}
      />
      <SearchUser
        setIsSearchModalOpen={setIsSearchModalOpen}
        isSearchModalOpen={isSearchModalOpen}
      />
    </div>
  );
};

export default SideBar;
