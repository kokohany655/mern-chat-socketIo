import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import baseUrl from "../../api/baseUrl";
import toast from "react-hot-toast";
const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        withCredentials: true,
      };
      const response = await baseUrl.post("/api/v1/auth/login", data, config);
      toast.success(response?.data?.message);
      localStorage.setItem("token-chat-forge", response?.data?.token);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div className=" w-full flex justify-center items-center px-2">
      <div className=" p-4 shadow-md rounded-md md:w-[30%] w-full">
        <div className=" text-xl font-semibold w-full flex justify-center items-center mb-6">
          welcome to chat app!
        </div>
        <form className=" flex flex-col gap-3" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter Your Email"
            value={data.email}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="password">password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter Your Password"
            value={data.password}
            onChange={(e) => handleChange(e)}
          />

          <button className=" bg-primary text-[#fff] mt-4 rounded-sm py-2 ">
            Submit
          </button>

          <Link to={"/register"}>
            <div className="flex justify-center opacity-80 text-sm ">
              Don't have an account ? register
            </div>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
