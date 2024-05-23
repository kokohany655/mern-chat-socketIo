import React from "react";
import logo from "../../images/logo.png";

const Layout = ({ children }) => {
  return (
    <>
      <header className="flex justify-center items-center p-3 shadow-md gap-3 mb-8 text-2xl font-bold">
        <img src={logo} alt="logo" className=" h-20 " />
        ForgeTechChat
      </header>
      {children}
    </>
  );
};

export default Layout;
