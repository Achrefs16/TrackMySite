import React from "react";

import img1 from "./img/logog.png";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
function NavBar() {
  const user = useSelector((state) => state.user.isAuthenticated);
  return (
    <nav className="flex px-28 py-2 shadow-sm w-full">
      <div className="flex items-center gap-2">
        <img
          src={img1}
          className="w-5"
          alt=""
        />
        <NavLink
          to="/"
          className="text-brand text-2xl font-bold cursor-pointer "
        >
          {" "}
          TrackMySite
        </NavLink>
      </div>
      <div className="text-lg flex gap-5 items-center mx-auto font-semibold">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-brand"
              : "text-gray-500  hover:text-brand transition duration-300"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/Features"
          className={({ isActive }) =>
            isActive
              ? "text-brand transition duration-300  "
              : "text-gray-500 hover:text-brand transition duration-300"
          }
        >
          Features
        </NavLink>
        <NavLink
          to="/Howitworks?"
          className={({ isActive }) =>
            isActive
              ? "text-brand"
              : "text-gray-500  hover:text-brand transition duration-300"
          }
        >
          How it works?
        </NavLink>
        <NavLink
          to="/Pricing"
          className={({ isActive }) =>
            isActive
              ? "text-brand"
              : "text-gray-500  hover:text-brand transition duration-300"
          }
        >
          Pricing
        </NavLink>
        <NavLink
          to="/About"
          className={({ isActive }) =>
            isActive
              ? "text-brand"
              : "text-gray-500  hover:text-brand transition duration-300"
          }
        >
          About Us
        </NavLink>
      </div>
      {!user && (
        <div>
          <Link to="/sign-up">
            <button className="text-white mr-2 bg-brand px-5 py-1.5 rounded-md text-base font-semibold  ">
              Sign Up
            </button>
          </Link>
          <Link to="/sign-in">
            <button className="text-gray-800  bg-white border border-gray-300 px-5 py-1.5 rounded-md text-base font-semibold  ">
              Sign In
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
