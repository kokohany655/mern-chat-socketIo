import React, { useEffect, useRef, useState } from "react";
import { BsChatLeftText } from "react-icons/bs";
import { AiOutlineUserAdd } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";
import Avatar from "./Avatar";

import EditUser from "../user/EditUser";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../images/logo.png";
import SearchUser from "../user/SearchUser";
import { io } from "socket.io-client";
import CardUserSideBar from "../user/CardUserSideBar";

const SideBar = () => {
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
const socketRef = useRef(null)

  
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_BACKEND_API, {
        auth: { token: localStorage.getItem("token-chat-forge") },
        withCredentials: true,
      });
    
      if (user?._id) {
        socketRef.current.emit("sideBar", user._id);
      }

      
      

      socketRef.current.on("conversation-sidBar" , (data)=>{
       const conversationUserDate = data.map(conv=>{
        if(conv?.sender?._id === user._id){
          return {
            ...conv,
            userDetails : conv?.receiver
          }
        }else{
          return {
            ...conv,
            userDetails : conv?.sender
          }
        }
       })

       setAllUser(conversationUserDate)



      })
    
    }


      

      return ()=>{
        socketRef.current.disconnect()
        socketRef.current = null
      }
  }, [user._id])

  
  
  const handleLogout = async () => {
    try {
      
      localStorage.removeItem("token-chat-forge")
      toast.success("logout successfully");
     
      navigate("/login");
    } catch (error) {
      toast.success(error?.response?.data?.message);
    }
  };
  return (
    <div className=" w-full h-full grid md:grid-cols-[48px,1fr]">
      <div className=" w-12 h-full  shadow-lg md:relative fixed top-0 left-0  rounded-tr-lg rounded-br-lg py-8 bg-primary text-[white] flex flex-col justify-between items-center ">
        <div className=" flex flex-col items-center gap-4">
          <Link to={"/"} className=" text-2xl cursor-pointer">
            <BsChatLeftText />
          </Link>
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
      <div className="w-full p-3 slideBar overflow-y-auto md:pl-0 pl-14 overflow-x-hidden md:h-[100vh] flex flex-col gap-4">
       <p className=" font-semibold">Messages</p>
        
        {allUser.length < 1 ? (
          <div className=" w-full h-full flex flex-col justify-center items-center gap-3">
            <img src={logo} className=" h-20 w-22" />
            <p className=" text-sm opacity-70">Explore user to start chat</p>
          </div>
        ):(
          allUser.map(e=>(
           

              <CardUserSideBar data={e} key={e._id}/>
      
          ))
        )
      }


       
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
