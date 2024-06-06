import React from "react";
import profileLogo from "../../images/logo-profile.png";
import { Link } from "react-router-dom";
import Avatar from "../home/Avatar";
const CardUser = ({ user, setIsSearchModalOpen }) => {
  return (
    <Link
      to={`/${user._id}`}
      onClick={() => {
        setIsSearchModalOpen(false);
      }}
      className=" h-16 w-full flex justify-start items-center gap-3 rounded-md shadow-md py-3 px-2 cursor-pointer"
    >
      <div className=" w-12 h-12">
        <Avatar
          name={user.name}
          userId={user._id}
          imageUrl={user.pic}
          showOnline={true}
        />
      </div>
      <div>
        <div className=" font-semibold text-primary">{user.name}</div>
        <div className=" opacity-80 text-[black]">{user.email}</div>
      </div>
    </Link>
  );
};

export default CardUser;
