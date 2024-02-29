import React from "react";
import img from "./img1.png";
import { motion } from "framer-motion";
function HeroSection() {
  return (
    <div className="h-dvh flex items-center pt-10  ">
      <div className="pl-28">
        <h1 className="text-slate-800 font-bold text-4xl">
          Empower Your Online Presence <br /> with{" "}
          <span className="text-brand">Effortless Analytics</span>
        </h1>
        <h3 className="text-gray-500 font-medium text-2xl mt-6">
          Integrate in minutes, uncover deep insights, and elevate your
          website's performance with{" "}
          <span className="font-bold text-brand"> TrackMySite</span>.
        </h3>
        <div className="flex mt-8 gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="text-white bg-brand px-5 py-2 rounded-md text-lg font-semibold  shadow-xl"
          >
            Start Free Trial
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="text-gray-800 bg-gray-50 border border-gray-300  px-5 py-2 rounded-md text-lg font-semibold shadow-lg "
          >
            Learn More
          </motion.button>
        </div>
      </div>
      <motion.img
        src={img}
        alt=""
        className="w-5/12 pr-28 -mt-9"
      />
    </div>
  );
}

export default HeroSection;
