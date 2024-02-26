import React from "react";
import { NavLink } from "react-router-dom";
function NavBar() {
  return (
    <nav className="flex mx-28 my-2">
      <h1 className="text-brand text-2xl font-bold ">
        <span className="text-alert">Track</span>MySite
      </h1>
      <div className="text-lg flex gap-5 items-center ml-32 font-semibold">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "text-sunny" : "text-brand")}
        >
          Home
        </NavLink>
        <NavLink
          to="/Features"
          className={({ isActive }) => (isActive ? "text-sunny" : "text-brand")}
        >
          Features
        </NavLink>
        <NavLink
          to="/Howitworks?"
          className={({ isActive }) => (isActive ? "text-sunny" : "text-brand")}
        >
          How it works?
        </NavLink>
        <NavLink
          to="/Pricing"
          className={({ isActive }) => (isActive ? "text-sunny" : "text-brand")}
        >
          Pricing
        </NavLink>
        <NavLink
          to="/About"
          className={({ isActive }) => (isActive ? "text-sunny" : "text-brand")}
        >
          About Us
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
