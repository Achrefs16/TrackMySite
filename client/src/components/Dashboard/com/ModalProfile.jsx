import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/userSlice";
import { motion } from "framer-motion";
import { TbLogout } from "react-icons/tb";
import { FaRegEdit } from "react-icons/fa";
const ModalProfile = ({ isOpen, onClose }) => {
  const userDetails = useSelector((state) => state.user.details);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlelogout = () => {
    navigate("/");
    dispatch(logout());
  };
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-96 h-32 bg-gray-50 rounded-xl border border-gray-300 shadow-xl px-2 py-1.5 absolute right-8 top-14  z-50 "
    >
      <h1 className="text-slate-800 font-medium text-center mt-4">
        {userDetails.name}
      </h1>
      <div className="border-b border-gray-400 my-2"></div>
      <div className=" my-4 ">
        <button className="text-gray-700 ml-2    px-2 py-1.5 rounded-md text-base font-medium hover:bg-gray-200  ">
          <FaRegEdit className="inline text-xl -mt-1" /> Modifier le profil
        </button>
        <button
          onClick={handlelogout}
          className="text-alert ml-2   px-2 py-1.5 rounded-md text-base font-medium  hover:bg-gray-200 "
        >
          <TbLogout className="inline text-xl" />
          Se déconnecter
        </button>
      </div>
    </motion.div>
  );
};

export default ModalProfile;
