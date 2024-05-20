import React from "react";
import { FaHouse } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { RiMenuSearchFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { TbSocial } from "react-icons/tb";
import { PiCursorClickFill } from "react-icons/pi";
import { IoIosDocument } from "react-icons/io";
import { FaUserCog } from "react-icons/fa";
import { IoBagCheckSharp } from "react-icons/io5";

import { Tooltip } from "react-tooltip";

const SideBar = () => {
  return (
    <div className="h-dvh bg-white w-14 border-r border-gray-300">
      <NavLink
        data-tooltip-id="Home"
        data-tooltip-content="Home"
        to="/dashboard/home"
        className={({ isActive }) =>
          isActive
            ? "bg-brand text-white mx-auto  rounded transition mt-2 duration-300 w-8 h-8 mb-20 flex justify-center items-center"
            : "text-gray-500 hover:bg-gray-300 hover:text-gray-600 mt-2 transition duration-300 w-8 h-8 mb-20 mx-auto rounded flex justify-center items-center"
        }
      >
        <Tooltip id="Home" />
        <FaHouse className="mb-2 px-1.5 pt-1.5 w-full h-full" />
      </NavLink>
      <NavLink
        to="/dashboard/overview"
        data-tooltip-id="Overview"
        data-tooltip-content="Aperçu général"
        className={({ isActive }) =>
          isActive
            ? "bg-brand text-white mx-auto rounded transition duration-300 w-8 h-8 mb-4 flex justify-center items-center"
            : "text-gray-500 hover:bg-gray-300 hover:text-gray-600 transition duration-300 w-8 h-8 mb-4 mx-auto rounded flex justify-center items-center"
        }
      >
        <Tooltip id="Overview" />
        <RiMenuSearchFill className="mb-2 px-1.5 pt-1.5 w-full h-full" />
      </NavLink>

      <NavLink
        data-tooltip-id="Visitors"
        data-tooltip-content="Utilisateurs"
        to="/dashboard/visitors/engagement"
        className={({ isActive }) =>
          isActive
            ? "bg-brand text-white mx-auto rounded transition duration-300 w-8 h-8 mb-4 flex justify-center items-center"
            : "text-gray-500 hover:bg-gray-300 hover:text-gray-600 transition duration-300 w-8 h-8 mb-4 mx-auto rounded flex justify-center items-center"
        }
      >
        <Tooltip id="Visitors" />
        <FaUsers className="mb-2 px-1.5 pt-1.5 w-full h-full" />
      </NavLink>

      <NavLink
        data-tooltip-id="Events"
        data-tooltip-content="Comportement"
        to="/dashboard/behaivor/pages"
        className={({ isActive }) =>
          isActive
            ? "bg-brand text-white mx-auto rounded transition duration-300 w-8 h-8 mb-4 flex justify-center items-center"
            : "text-gray-500 hover:bg-gray-300 hover:text-gray-600 transition duration-300 w-8 h-8 mb-4 mx-auto rounded flex justify-center items-center"
        }
      >
        <Tooltip id="Events" />
        <PiCursorClickFill className="mb-2 px-1.5 pt-1.5 w-full h-full" />
      </NavLink>
      <NavLink
        data-tooltip-id="Conversion"
        data-tooltip-content="Revenu"
        to="/dashboard/conversion/purchase"
        className={({ isActive }) =>
          isActive
            ? "bg-brand text-white mx-auto rounded transition duration-300 w-8 h-8 mb-4 flex justify-center items-center"
            : "text-gray-500 hover:bg-gray-300 hover:text-gray-600 transition duration-300 w-8 h-8 mb-4 mx-auto rounded flex justify-center items-center"
        }
      >
        <Tooltip id="Coversion" />
        <IoBagCheckSharp className="mb-2 px-1.5 pt-1.5 w-full h-full" />
      </NavLink>
      <div className="border-t w-8 mx-auto my-8 border-gray-300"></div>
      <NavLink
        data-tooltip-id="Documentation"
        data-tooltip-content="Documentation"
        to="/dashboard/documentation/installation"
        className={({ isActive }) =>
          isActive
            ? "bg-brand text-white mx-auto rounded transition duration-300 w-8 h-8 mb-4 flex justify-center items-center"
            : "text-gray-500 hover:bg-gray-300 hover:text-gray-600 transition duration-300 w-8 h-8 mb-4 mx-auto rounded flex justify-center items-center"
        }
      >
        <Tooltip id="Documentation" />
        <IoIosDocument className="mb-2 px-1.5 pt-1.5 w-full h-full" />
      </NavLink>
      <NavLink
        data-tooltip-id="Settings"
        data-tooltip-content="Paramètres"
        to="/dashboard/settings"
        className={({ isActive }) =>
          isActive
            ? "bg-brand text-white mx-auto rounded transition duration-300 w-8 h-8 mb-4 flex justify-center items-center"
            : "text-gray-500 hover:bg-gray-300 hover:text-gray-600 transition duration-300 w-8 h-8 mb-4 mx-auto rounded flex justify-center items-center"
        }
      >
        <Tooltip id="Settings" />
        <FaUserCog className="mb-2 px-1.5 pt-1.5 w-full h-full" />
      </NavLink>
    </div>
  );
};

export default SideBar;
