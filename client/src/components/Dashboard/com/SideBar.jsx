import React from "react";
import { FaHouse } from "react-icons/fa6";
import { Link } from "react-router-dom";
const SideBar = () => {
  return (
    <div className="h-dvh bg-white w-16 border-r border-gray-300">
      <Link>
        <FaHouse className="w-full h-14 text-lg text-gray-500 border-b border-gray-300  p-4" />
      </Link>
    </div>
  );
};

export default SideBar;
