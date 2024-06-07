import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Avatar from "../../components/home/Avatar";
import { useSelector } from "react-redux";
import { TbDotsVertical, TbSend2 } from "react-icons/tb";
import { IoMdArrowBack } from "react-icons/io";
import { BsEmojiSunglasses, BsLink45Deg } from "react-icons/bs";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import toast from "react-hot-toast";
import uploadFile from "../../components/Layout/uploadingImage";
import moment from "moment"

const Chat = () => {
  const navigate = useNavigate()
  const onlineUser = useSelector((state) => state?.user?.onlineUser);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState();
  const [allMessage, setAllMessage] = useState([])
  const currentMessage = useRef(null)
  const [allUser, setAllUser] = useState([])

  const param = useParams();
  const socketRef = useRef(null);

  const currentUser = useSelector((state) => state.user);
  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);
    setMessage(message + emoji);
  };

  const handleFileChange = async (event) => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_BACKEND_API, {
        auth: { token: localStorage.getItem("token-chat-forge") },
        withCredentials: true,
      });
    }

    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      const payload = {
        sender: currentUser._id,
        receiver: param.userId,
        text: "",
        imageUrl: "",
        videoUrl: "",
        seen: false,
      };
      try {
        if (fileType.startsWith("image/")) {
          const image = await uploadFile(file);
          payload.imageUrl = image?.data?.url;
          socketRef.current.emit("new-message", payload);
        } else if (fileType.startsWith("video/")) {
          const video = await uploadFile(file);
          payload.videoUrl = video?.data?.url;
          socketRef.current.emit("new-message", payload);
        } else {
          toast.error("You can only upload image and video files.");
        }
      } catch (error) {
        console.error(
          "File upload failed:",
          error.response?.data || error.message
        );
        toast.error("File upload failed.");
      }
    }
  };

  const handleSubmitText = (e) => {
    e.preventDefault()
    if (!socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_BACKEND_API, {
        auth: { token: localStorage.getItem("token-chat-forge") },
        withCredentials: true,
      });
    }

    if(message === "" ||message === undefined || message === null){
return
    }
    const payload = {
      sender: currentUser._id,
      receiver: param.userId,
      text: message,
      imageUrl: "",
      videoUrl: "",
      seen: false,
    };

    socketRef.current.emit("new-message", payload);
    setMessage("");
  };

  useEffect(() => {

    if (!socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_BACKEND_API, {
        auth: { token: localStorage.getItem("token-chat-forge") },
        withCredentials: true,
      });
    }
    if(currentMessage?.current){
      currentMessage.current.scrollIntoView({behavior:"smooth" , block:"end"})
    }

 
    socketRef.current.on("conversation-sidBar" , (data)=>{
      const conversationUserDate = data.map(conv=>{
       if(conv?.sender?._id === currentUser._id){
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
    console.log({allUser})
    if(param.userId){

      const chooseConversation = allUser.filter(e=> e?.receiver?._id === param.userId )
      console.log({chooseConversation})
      if(chooseConversation.length > 0){

        socketRef.current.emit("seen" , param.userId)
      }
     
    }  
  }, [allMessage])
  
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
    }

    socketRef.current.emit("message-page", param.userId);

    socketRef.current.on("message" , data=>{
      setAllMessage(data)
    })

    socketRef.current.on("message-user", (data) => {
      setUserData({
        ...data,
        online: onlineUser.includes(data?._id),
      });
    });

    socketRef.current.emit("seen" , param.userId)

    socketRef.current.on("conversation" , (data)=>{
      setAllMessage(data)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.off("message-user");
      }
    };
  }, [param.userId, onlineUser]);


  useEffect(() => {
    if (userData) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        online: onlineUser.includes(userData._id),
      }));
    }
  }, [onlineUser]);

  return (
    <div className=" h-[100vh] relative ">
      <header className="fixed top-0 right-0 w-full bg-[white] z-10 h-16 shadow-md px-4 gap-3 flex justify-between items-center">
        <div className="flex justify-start items-center gap-3">
          <div className="flex justify-center items-center gap-1">
            <Link to="/" className="lg:hidden block cursor-pointer">
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
          <div className="flex flex-col justify-center items-start h-full leading-3">
            <div className="text-lg font-semibold">{userData?.name}</div>
            <div
              className={`${
                userData?.online ? "text-[green]" : "text-[gray]"
              } text-md`}
            >
              {userData?.online ? "online" : "offline"}
            </div>
          </div>
        </div>
        <div className="cursor-pointer hover:text-primary">
          <TbDotsVertical size={"1.3rem"} />
        </div>
      </header>
      <section className={` pt-[4.5rem] ${openEmoji ? "md:h-[calc(100vh-8rem)] h-[calc(100vh-24.5rem)]" : "h-[calc(100vh-4rem)]"}  overflow-x-hidden overflow-y-auto slideBar p-4 relative`}>
       <div className=" flex flex-col gap-2">
        {
          allMessage.length >0 && allMessage.map(msg=>(
            <div ref={currentMessage} key={msg._id} className={`${msg?.sender === currentUser?._id? " bg-primary ml-auto text-[white] rounded-bl-xl shadow-md" : " shadow-md mr-auto rounded-br-xl"}  md:text-lg p-2 max-w-[80%]  flex flex-col justify-center items-end  rounded-t-xl`} >
                 {msg.imageUrl ? (
        <img src={msg.imageUrl} alt="User uploaded content" className="max-w-full max-h-72 mb-1 rounded" />
      ) : msg.videoUrl ? (
        <video src={msg.videoUrl} controls className="max-w-full max-h-60 mb-1 rounded" />
      ) : (
        <p>{msg.text}</p>
      )}

      <p className="text-[11px] opacity-80">{moment(msg?.createdAt).format('hh:mm')}</p>
                 
            </div>
          ))
        }
        </div>
        <div
          className={` lg:block hidden fixed bottom-[4rem] left-[315px]  transform transition-transform duration-500 ${
            openEmoji
              ? "opacity-100 scale-100 z-10"
              : "opacity-0 scale-90 -z-10"
          }`}
          style={{ transformOrigin: "bottom left", transition: "all .5s" }}
        >
          <Picker
          theme={"light"}
            data={data}
            onEmojiSelect={(e) => addEmoji(e)}
            previewPosition={"none"}
          />
        </div>
      </section>
      <section className="  absolute w-full bottom-0 bg-[white] ">
        <form onSubmit={handleSubmitText} className="h-16 lg:gap-4 gap-2 px-4 lg:py-2 py-3 flex justify-center items-center">
          <div
            className="w-full flex justify-between items-center lg:rounded-3xl p-2 gap-2 rounded-full h-full"
            style={{
              boxShadow: " 0px 0px 10px rgba(0,0,0,0.2)",
            }}
          >
            <div
              className="text-primary lg:text-[1.6rem] text-[1.3rem] cursor-pointer"
              onClick={() => setOpenEmoji(!openEmoji)}
            >
              <BsEmojiSunglasses />
            </div>
            <input
              type="text"
              placeholder="message..."
              className="w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="text-[1.3rem] lg:text-[1.6rem] cursor-pointer">
              <label htmlFor="file">
                <BsLink45Deg />
              </label>
              <input
                type="file"
                onChange={(e) => {
                  handleFileChange(e);
                }}
                name="file"
                id="file"
                className=" hidden"
              />
            </div>
          </div>
          <button
            className="text-primary lg:text-[2.5rem] text-[2rem] cursor-pointer"
          type="submit"
          >
            <TbSend2 />
          </button>
        </form>

        <div
          className={` block md:hidden bottom-1 emoji gap-2 px-3  py-3 w-full left-4  transform transition-transform duration-500 ${
            openEmoji
              ? "opacity-100 scale-100 block"
              : "opacity-0 scale-90 hidden"
          }`}
          style={{ transformOrigin: "bottom top", transition: "all .5s" }}
        >
          <Picker
          theme={"light"}
            data={data}
            onEmojiSelect={(e) => addEmoji(e)}
            previewPosition={"none"}
            dynamicWidth={true}
            perLine={9}
          />
        </div>
      </section>
    </div>
  );
};

export default Chat;
