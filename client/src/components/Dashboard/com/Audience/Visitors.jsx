import React from "react";

import { Outlet } from "react-router-dom";
import Bar from "../Bar";

const Visitors = () => {
  const Links = [
    { name: "Engagement", path: "/dashboard/visitors/engagement" },
    { name: "Démographie", path: "/dashboard/visitors/demographic" },
    { name: "Appareils", path: "/dashboard/visitors/devices" },
    { name: "Langues", path: "/dashboard/visitors/language" },
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
