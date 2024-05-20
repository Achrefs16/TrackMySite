import React from "react";
import { motion } from "framer-motion";
import Step from "./Step";
const HowItWorks = () => {
  return (
    <motion.div className=" bg-gray-50 w-full p-28 ">
      <motion.h1 className="text-slate-800 font-bold text-3xl">
        Comment cela<span className="text-brand"> fonctionne-t-il ?</span>
      </motion.h1>
      <h3 className="text-slate-800 font-medium text-lg mt-4">
        En trois étapes simples :
      </h3>
      <Step />
    </motion.div>
  );
};

export default HowItWorks;
