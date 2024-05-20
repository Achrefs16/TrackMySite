import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Bar from "../Bar";

const Visitors = () => {
  const Websitedata = useSelector((state) => state.website.Websitedata);
  const Links = [
    { name: "Engagement", path: "/dashboard/visitors/engagement" },
    { name: "Démographie", path: "/dashboard/visitors/demographic" },
    { name: "Appareils", path: "/dashboard/visitors/devices" },
    { name: "Langues", path: "/dashboard/visitors/language" },
  ];

  return (
    <>
      <Bar Links={Links} />
      {Websitedata === 0 ? (
        <div className="bg-gray-100   h-5/6 flex justify-center pt-40">
          <p className="w-3/4 text-4xl font-bold text-gray-600">
            Intégrez le code de suivi pour visualiser les données d'analyse de
            votre site web.
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 w-full h-5/6 overflow-y-scroll">
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Visitors;
