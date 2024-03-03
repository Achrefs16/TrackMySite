import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/userSlice";
import AddwsModal from "./AddwsModal";

const Start = () => {
  const userDetails = useSelector((state) => state.user.details);
  const selectedWebsite = useSelector((state) => state.website.selectedWebsite);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlelogout = () => {
    navigate("/");
    dispatch(logout());
  };
  const handleCloseModal = () => setIsOpen(false);
  return (
    <div className="bg-gray-100  h-[calc(100%-3.5rem)]">
      <motion.button
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className="text-white bg-alert px-5 py-2 rounded-md text-lg font-semibold  shadow-xl"
        onClick={handlelogout}
      >
        logout
      </motion.button>
      <div className="flex">
        <h1 className=" text-xl text-slate-800 font-bold">Overview </h1>
        <div class="relative">
          <select class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
            <option>24 hours</option>
            <option>3 days</option>
            <option selected>1 week</option>
            <option>1 month</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 01.414 1.414L5.707 9l4 4 4-4 .293-.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-8 w-2/4 bg-white border border-gray-200 rounded-lg shadow-sm mt-24 ml-20">
        <h1 className="text-2xl text-gray-800 font-medium mb-4">
          Add your website and start collecting
        </h1>
        <p className="text-xl text-gray-500 mb-6 ">
          Enter your website information to receive integration instructions.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className="text-white bg-brand px-5 py-2 rounded-md text-lg font-semibold  shadow-xl"
          onClick={() => setIsOpen(true)}
        >
          Add Website
        </motion.button>
        <AddwsModal
          isOpen={isOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Start;
