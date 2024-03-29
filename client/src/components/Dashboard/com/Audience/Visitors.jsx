import React from "react";

import { Outlet } from "react-router-dom";
import Bar from "../Bar";

const Visitors = () => {
  const Links = [
    { name: "Engagement", path: "/dashboard/visitors/engagement" },
    { name: "Demographic", path: "/dashboard/visitors/demographic" },
    { name: "Devices", path: "/dashboard/visitors/devices" },
    { name: "Language", path: "/dashboard/visitors/language" },
  ];
  return (
    <>
      <Bar Links={Links} />
      <div className="bg-gray-50 w-full h-5/6 overflow-y-scroll">
        <Outlet />
      </div>
    </>
  );
};

export default Visitors;
