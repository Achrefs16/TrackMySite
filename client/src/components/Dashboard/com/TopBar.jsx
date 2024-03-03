import React, { useEffect, useState } from "react";
import img from "../../landing/img/logog.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import SelectModal from "./SelectModal";
import { IoIosArrowDown } from "react-icons/io";
const TopBar = () => {
  const handleCloseModal = () => setIsOpen(false);
  const [isOpen, setIsOpen] = useState(false);

  const userDetails = useSelector((state) => state.user.details);
  const token = useSelector((state) => state.user.token);
  const [websites, setWebsites] = useState();

  const getWebsites = async () => {
    if (token) {
      try {
        const response = await axios.get("/websites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWebsites(response.data.websites);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("No token found, please login.");
    }
  };
  useEffect(() => {
    getWebsites();
  }, []);

  const letter = userDetails.name.charAt(0);
  return (
    <div className="h-14 bg-white border-b border-gray-300 flex items-center justify-between px-5">
      <div className="flex">
        <div className="flex items-center gap-1  pr-7 h-4/6 border-r border-gray-300">
          <img
            src={img}
            className="w-4"
            alt=""
          />
          <Link
            to="/"
            className="text-brand text-xl font-bold cursor-pointer "
          >
            {" "}
            TrackMySite
          </Link>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="  ml-4 text-slate-800 h-4/6 text-lg font-semibold px-4 hover:text-slate-600"
        >
          Select Website <IoIosArrowDown className="inline text-lg font-bold" />
        </button>
        <SelectModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          websites={websites}
          getWebsites={getWebsites}
        />
      </div>
      <h1 className="text-lg rounded-full border border-gray-300 bg-gray-500  text-white px-2 ">
        {letter}
      </h1>
    </div>
  );
};

export default TopBar;
