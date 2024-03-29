import React, { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";

const Bar = ({ Links }) => {
  return (
    <div className="h-12 bg-white border-b border-gray-300 flex items-center justify-between px-5">
      <div className="text-base flex gap-5 items-center  font-semibold">
        {Links &&
          Links.map(({ path, name }, index) => (
            <NavLink
              key={index}
              to={`${path}`}
              className={({ isActive }) =>
                isActive
                  ? "text-brand  h-12 border-b-2 border-brand  pt-3 "
                  : "text-gray-500  hover:text-brand transition duration-300  h-12 pt-3 "
              }
            >
              {name}
            </NavLink>
          ))}
      </div>
    </div>
  );
};

export default Bar;
