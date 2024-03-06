import React from "react";
import Start from "./com/Overview/Start";
import SideBar from "./com/SideBar";
import NavBar from "../landing/NavBar";
import { useSelector } from "react-redux";
import TopBar from "./com/TopBar";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";
import Bar from "./com/Bar";

const Dashboard = () => {
  const userDetails = useSelector((state) => state.user.details);
  return (
    <>
      {" "}
      <div className="flex h-full">
        <SideBar />
        <div className="w-full">
          <TopBar />
          <Bar />

          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
