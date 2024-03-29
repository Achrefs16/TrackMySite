import React from "react";
import Bar from "../Bar";

import { Outlet } from "react-router-dom";
const Docs = () => {
  const Links = [
    { name: "Installation", path: "/dashboard/documentation/installation" },
    { name: "Advance Tracking", path: "/dashboard/documentation/tracking" },
    {
      name: "Interaction and Events",
      path: "/dashboard/documentation/events",
    },
  ];
  return (
    <>
      <Bar Links={Links} />
      <div className="bg-gray-50 w-full h-5/6 overflow-y-scroll pt-10 px-10">
        <Outlet />
      </div>
    </>
  );
};

export default Docs;
