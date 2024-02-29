import React from "react";
import Start from "./com/Start";
import SideBar from "./com/SideBar";
import NavBar from "../landing/NavBar";
const Dashboard = () => {
  return (
    <>
      <div className="flex">
        <SideBar />
        <Start />
      </div>
    </>
  );
};

export default Dashboard;
