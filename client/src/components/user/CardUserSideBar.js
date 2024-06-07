
import React from 'react'
import { Link } from 'react-router-dom';
import Avatar from '../home/Avatar';
import { FaImage } from "react-icons/fa6";
import { IoVideocam } from "react-icons/io5";
import moment from "moment"
const CardUserSideBar = ({data}) => {
    const user = data.userDetails
  return (
    <Link
      to={`/${user._id}`}
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
      <div className=' w-[calc(100%-3.75rem)]'>
        <div className=" font-semibold flex w-full justify-between items-center ">
          <p className='text-lg w-[80%]  overflow-ellipsis text-nowrap overflow-hidden'>  {user?.name}</p >
          <p className=' text-[gray] text-[12px]'>{moment(data?.lastMsg?.createdAt).format('hh:mm')}</p>
        </div>
        <div className=' w-full flex justify-between  items-center'>
           <div className='flex items-center gap-1 w-[80%]  overflow-ellipsis text-nowrap overflow-hidden'>
            <p className=' text-sm text-[gray]'>{data?.lastMsg?.sender !== user._id ? "you: ": ""}</p>
           {
            data?.lastMsg?.imageUrl !== ""? (
                <div className={` flex justify-center gap-1 items-center text-sm ${data?.unseenMsg !== 0 ? "text-primary font-semibold" : "text-[gray] "}`}>

                    <FaImage size={18}/> Image
                </div>
            ):data?.lastMsg?.videoUrl !== "" ? (
                <div className={` flex justify-center gap-1 items-center text-sm ${data?.unseenMsg !== 0 ? "text-primary font-semibold" : "text-[gray] "}`}>

                <IoVideocam size={18}/> Video
            </div>
            ):(

                <div className={` opacity-80 text-[14px] ${(data?.unseenMsg !== 0 && data?.lastMsg?.sender === user._id) ? "text-primary font-semibold" : "text-[gray] "} w-full overflow-ellipsis text-nowrap overflow-hidden`}> {data?.lastMsg?.text}</div>
            )
        }
            </div> 
            {
                (data?.unseenMsg !== 0 && data?.lastMsg?.sender === user._id) ? (<div className=' bg-primary text-[white] text-[12px] font-bold rounded-full w-6 h-6 flex justify-center items-center p-1'>
                {data?.unseenMsg}
        </div>):""
            }
            
        </div>
        
      </div>
    </Link>
  )
}

export default CardUserSideBar