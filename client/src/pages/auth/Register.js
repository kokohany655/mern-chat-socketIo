import React, { useEffect, useState } from "react";
import logoProfile from "../../images/logo-profile.png";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../../components/Layout/uploadingImage";
import { toast } from "react-hot-toast";
import baseUrl from "../../api/baseUrl";
const Register = () => {
  const navigate = useNavigate();
  const [img, setImg] = useState(logoProfile);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    pic: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataImage = await uploadFile(data.pic);
      if (dataImage.url) {
        const updatedData = {
          ...data,
          pic: dataImage?.data?.url,
        };
        const response = await baseUrl.post("/api/v1/auth/signup", updatedData);
        toast.success(response?.data?.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.files && e.target.files[0] && name === "pic") {
      setImg(URL.createObjectURL(e.target.files[0]));
      setData((prev) => {
        return {
          ...prev,
          [name]: e.target.files[0],
        };
      });
    } else {
      setData((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  return (
    <div className=" w-full flex justify-center items-center px-2">
      <div className=" p-4 shadow-md rounded-md md:w-[30%] w-full">
        <div className=" text-xl font-semibold w-full flex justify-center items-center mb-6">
          welcome to chat app!
        </div>
        <form className=" flex flex-col gap-3" onSubmit={handleSubmit}>
          <label htmlFor="pic" className="flex flex-col gap-3">
            Photo
            <img
              src={img}
              className=" rounded-full w-20 h-20"
              alt="profile-photo"
            />
          </label>
          <input
            required
            type="file"
            id="pic"
            name="pic"
            placeholder="Enter Your Photo"
            className=" hidden"
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="name">Name</label>
          <input
            required
            type="text"
            id="name"
            name="name"
            placeholder="Enter Your Name"
            value={data.name}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="email">Email</label>
          <input
            required
            type="email"
            id="email"
            name="email"
            placeholder="Enter Your Email"
            value={data.email}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="password">password</label>
          <input
            required
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

          <Link to={"/login"}>
            <div className="flex justify-center opacity-80 text-sm ">
              Already have an account ? login
            </div>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
