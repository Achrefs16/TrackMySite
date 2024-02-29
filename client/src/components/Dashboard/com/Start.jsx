import React from "react";
import { motion } from "framer-motion";
const Start = () => {
  return (
    <div className="bg-gray-50 w-4/5 ">
      <div className="p-8 w-2/4 border border-gray-200 rounded-lg shadow-sm mt-24 ml-20">
        <h1 className="text-2xl text-gray-800 font-medium mb-4">
          Add your website and start collecting
        </h1>
        <p className="text-xl text-gray-500 mb-6 ">
          Enter your website information to receive integration instructions.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className="text-white bg-brand px-5 py-2 rounded-md text-lg font-semibold  shadow-xl"
        >
          Add Website
        </motion.button>
      </div>
    </div>
  );
};

export default Start;
