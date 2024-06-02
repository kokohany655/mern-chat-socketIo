import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Avatar from "../../components/home/Avatar";
import { useSelector } from "react-redux";
import { TbDotsVertical, TbSend2 } from "react-icons/tb";
import { IoMdArrowBack } from "react-icons/io";
import { BsEmojiSunglasses, BsLink45Deg } from "react-icons/bs";

const Chat = () => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);
  const param = useParams();
  const [userData, setUserData] = useState();

  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_API, {
      auth: {
        token: localStorage.getItem("token-chat-forge"),
      },
      withCredentials: true,
    });

    socket.emit("message-page", param.userId);

    socket.on("message-user", (data) => {
      setUserData({
        ...data,
        online: onlineUser.includes(data?._id),
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [param.userId]);

  useEffect(() => {
    if (userData) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        online: onlineUser.includes(userData._id),
      }));
    }
  }, [onlineUser]);

  return (
    <div>
      <header className=" sticky  h-16  shadow-md px-4 gap-3 flex justify-between items-center">
        <div className="flex justify-start  items-center gap-3">
          <div className="flex justify-center items-center gap-1">
            <Link to="/" className=" lg:hidden block cursor-pointer">
              <IoMdArrowBack size={"1.1rem"} />
            </Link>
            <div className="w-12 h-12 ">
              <Avatar
                name={userData?.name}
                showOnline={true}
                userId={userData?._id}
                imageUrl={userData?.pic}
              />
            </div>
          </div>
          <div className=" flex flex-col justify-center items-start h-full leading-3">
            <div className=" text-lg font-semibold">{userData?.name}</div>

            <div
              className={`${
                userData?.online ? "text-[green]" : "text-[gray]"
              } text-md`}
            >
              {userData?.online ? "online" : "offline"}
            </div>
          </div>
        </div>
        <div className=" cursor-pointer hover:text-primary">
          <TbDotsVertical size={"1.3rem"} />
        </div>
      </header>
      <section className=" h-[calc(100vh-8rem)] overflow-x-hidden overflow-y-auto sideBar px-4">
        message
      </section>
      <section className=" h-16 flex justify-center items-center lg:gap-4 gap-2 px-4 lg:py-2 py-3">
        <div
          className=" w-full flex justify-between items-center lg:rounded-3xl p-2 gap-2 rounded-full h-full"
          style={{ boxShadow: " 0px 0px 10px rgba(0,0,0,0.2)" }}
        >
          <div className=" text-primary lg:text-[1.6rem] text-[1.3rem]">
            <BsEmojiSunglasses />
          </div>
          <input type="text" placeholder="message..." className=" w-full" />
          <div className=" text-[1.3rem] lg:text-[1.6rem]">
            <BsLink45Deg />
          </div>
        </div>
        <div className=" text-primary lg:text-[2.5rem] text-[2rem]">
          <TbSend2 />
        </div>
      </section>
    </div>
  );
};

export default Chat;
