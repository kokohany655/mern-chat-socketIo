import React from "react";
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

const Avatar = ({ userId, name, imageUrl, showOnline }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  const isOnline = onlineUser.includes(userId);
  return (
    <div className="text-3xl cursor-pointer relative w-full h-full ">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="overflow-hidden w-full h-full rounded-full"
        />
      ) : name ? (
        <div className=" text-lg font-bold bg-[white] shadow-md  rounded-full text-primary w-full h-full flex justify-center items-center">
          {name.toUpperCase().slice(0, 2)}
        </div>
      ) : (
        <PiUserCircle />
      )}

      {showOnline && isOnline && (
        <div className="bg-[green] p-1 absolute bottom-1 right-1 z-10 rounded-full"></div>
      )}
    </div>
  );
};

export default Avatar;
