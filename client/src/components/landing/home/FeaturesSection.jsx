import React from "react";
import img from "./img.png";
import img1 from "./img3.png";
import img2 from "./img4.png";
import { motion } from "framer-motion";
import HowItWorks from "../../HowItWorks/HowItWorks";

function FeaturesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
      }}
      className=" bg-brand"
    >
      <div className="p-28">
        <motion.h1 className="text-3xl text-slate-100 font-bold">
          Seamless Setup,{" "}
          <span className="text-sunny border-b-2 border-sunny pb-2 ">
            Instant Insights
          </span>
        </motion.h1>
        <div className="flex  pt-28">
          <motion.img
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            src={img}
            alt=""
            className="w-64"
          />
          <motion.div className=" pl-28 ">
            <p className="text-xl  text-gray-100 ">
              Get started with TMS in just a few{" "}
              <span className="font-bold text-slate-100"> clicks</span>. Our
              straightforward integration process means you’re only minutes away
              from unlocking comprehensive analytics for your website.
            </p>

            <button className="text-white bg-sunny px-5 py-2 my-4 rounded-md text-lg font-semibold  shadow-2xl">
              View Insteraction
            </button>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="h-5/6 bg-gray-50 w-full  p-28"
        initial={{ opacity: 1, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          ease: "linear",
          duration: 0.6,
        }}
      >
        <h1 className="text-3xl text-slate-800 font-bold">
          Analytics Made <span className="text-brand"> Accessible</span>
        </h1>
        <div className="flex gap-6">
          <motion.p
            className="text-xl  text-gray-500 pt-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              ease: "linear",
              duration: 0.6,
            }}
          >
            Navigate through your data with an intuitive dashboard designed for
            clarity. Whether you’re a data scientist or a business owner, making
            data-driven decisions has never been easier.
          </motion.p>
          <img
            src={img2}
            alt=""
            className="w-96"
          />
        </div>
      </motion.div>

      <div className=" bg-gray-50 w-full  p-28">
        <h1 className="text-3xl text-slate-800 font-bold pt-28">
          Deep Dive into <span className="text-alert">Your Data</span>{" "}
        </h1>
        <div className="flex justify-between">
          <div className="w-2/4 pt-12  ">
            <motion.p className=" text-gray-500  text-xl  ">
              From visitor behavior to conversion tracking, TMS provides you
              with the detailed insights needed to optimize your site's
              performance and enhance user experience
            </motion.p>
            <div className="  mt-4 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="text-white font-semibold bg-alert rounded-md px-4 py-1.5 shadow-md  "
              >
                Sign Up Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="text-gray-800 bg-gray-50 border border-gray-300  rounded-md px-4 py-1.5 shadow-md "
              >
                Learn More
              </motion.button>
            </div>
          </div>
          <motion.img
            initial={{ opacity: 0.5, x: 70 }}
            whileInView={{ opacity: 1, x: -10 }}
            transition={{
              duration: 0.6,
            }}
            src={img1}
            alt=""
            className="w-80"
          />
        </div>
      </div>
      <HowItWorks />
    </motion.div>
  );
}

export default FeaturesSection;
