import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { toast } from "react-hot-toast";
import baseUrl from "../../api/baseUrl";
import uploadFile from "../Layout/uploadingImage";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/reducer/userSlice";
import Avatar from "../home/Avatar";

const EditUser = ({ setIsModalOpen, isModalOpen, user }) => {
  const dispatch = useDispatch();
  const [img, setImg] = useState("");
  const [data, setData] = useState({
    pic: "",
    name: "",
  });

  useEffect(() => {
    setImg(user.pic);
    setData({
      pic: user.pic,
      name: user.name,
    });
  }, [isModalOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.files && e.target.files[0]) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let dataImage;
      let updatedData = {
        ...data,
      };
      if (!data.pic.startsWith("http")) {
        dataImage = await uploadFile(data.pic);
        updatedData = {
          ...data,
          pic: dataImage?.data?.url,
        };
      }

      const response = await baseUrl.put(
        `/api/v1/user/${user._id}`,
        updatedData,
        {
          withCredentials: true,
        }
      );
      toast.success(response?.data?.message);

      dispatch(setUser(response?.data?.data));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Modal
      title={"Profile"}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer=""
      width="400px"
    >
      <form
        className=" w-full flex flex-col justify-start items-center gap-3"
        onSubmit={handleSubmit}
      >
        <div className=" flex flex-col justify-start items-center ">
          <label htmlFor="pic" className="cursor-pointer w-24 h-24">
            <Avatar
              userId={user._id}
              imageUrl={user.pic}
              name={user.name}
              showOnline={false}
            />
          </label>
          <input
            type="file"
            name="pic"
            id="pic"
            className=" hidden"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className=" flex justify-center items-center opacity-80 ">
          {user.email}
        </div>
        <div className=" w-full flex gap-3 justify-start items-center">
          <label htmlFor="name">Name : </label>
          <input
            className=" border-b-[1px] rounded-sm "
            type="text"
            id="name"
            name="name"
            value={data.name}
            placeholder="Enter Your New Name"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <button className=" w-full bg-primary text-[#fff] mt-2 rounded-sm py-2 ">
          Save Changes
        </button>
      </form>
    </Modal>
  );
};

export default EditUser;
