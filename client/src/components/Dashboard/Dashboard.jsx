import React from "react";
import Start from "./com/Start";
import SideBar from "./com/SideBar";
import NavBar from "../landing/NavBar";
import { useSelector } from "react-redux";
import TopBar from "./com/TopBar";

const Dashboard = () => {
  const userDetails = useSelector((state) => state.user.details);
  return (
    <>
      <div className="flex">
        <SideBar />
        <div className="w-[calc(100%-3.5rem)]">
          <TopBar />
          <Start />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
