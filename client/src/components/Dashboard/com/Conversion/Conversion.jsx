import React from "react";
import Bar from "../Bar";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
const Conversion = () => {
  const Links = [
    { name: "Achats", path: "/dashboard/conversion/purchase" },
    { name: "Interaction", path: "/dashboard/conversion/interaction" },
    { name: "Abonnements", path: "/dashboard/conversion/subscription" },
    { name: "Segmentation", path: "/dashboard/conversion/segmentation" },
  ];

  const Websitedata = useSelector((state) => state.website.Websitedata);
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

export default Conversion;
