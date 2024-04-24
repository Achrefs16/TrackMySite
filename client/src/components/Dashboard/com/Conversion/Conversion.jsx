import React from "react";
import Bar from "../Bar";

import { Outlet } from "react-router-dom";
const Conversion = () => {
  const Links = [
    { name: "Achats", path: "/dashboard/conversion/purchase" },
    { name: "Interaction", path: "/dashboard/conversion/interaction" },
    { name: "Abonnements", path: "/dashboard/conversion/subscription" },
    { name: "Segmentation", path: "/dashboard/conversion/segmentation" },
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

export default Conversion;
