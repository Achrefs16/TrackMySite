import React from "react";

import { Outlet } from "react-router-dom";
import Bar from "../Bar";
const Behaivor = () => {
  const Links = [
    { name: "Pages", path: "/dashboard/behaivor/pages" },
    { name: "Session", path: "/dashboard/behaivor/session" },
    { name: "Interactions", path: "/dashboard/behaivor/interactions" },
    { name: "Parcours ", path: "/dashboard/behaivor/journeys" },
    { name: "Acquisition", path: "/dashboard/behaivor/acquisition" },
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

export default Behaivor;
