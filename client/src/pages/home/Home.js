import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Outlet } from "react-router-dom";
import baseUrl from "../../api/baseUrl";

const Home = () => {
  const getUserDetails = async () => {
    try {
      const config = {
        withCredentials: true,
      };
      const response = await baseUrl.get("/api/v1/auth/loggedUser", config);
      console.log({ response });
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div>
      Home
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
