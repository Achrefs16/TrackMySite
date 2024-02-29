import React from "react";
import { motion } from "framer-motion";
import img1 from "./code.png";
import img2 from "./data-collecting.png";
import img3 from "./predictive-chart.png";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
const Step = () => {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle =
        absoluteElementTop - window.innerHeight / 2 + elementRect.height / 2;
      window.scrollTo({
        top: middle,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="scroll-smooth">
      {" "}
      <motion.div className="  w-full  bg-gray-50">
        <motion.div className="flex gap-16 ml-40  items-center  mt-28 ">
          <motion.img
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            src={img1}
            alt=""
            className="w-48"
          />
          <h1 className="font-extrabold text-9xl text-brand  text-center">1</h1>
          <div className="">
            <p className="text-slate-800 font-bold  text-3xl">
              Effortless <span className="text-brand">Integration</span>
            </p>
            <p className="text-slate-500 text-xl pt-2 mb-4 ">
              A simple, swift solution, Quickly enhance your website with our
              easy-to-integrate, lightweight tracking code. No slowdown, just
              insights.
            </p>
            <a
              href="#step2"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("step2");
              }}
              className=" text-brand font-normal mt-4 inline "
            >
              Next Step <IoIosArrowForward className="inline text-lg" />
            </a>
            <Link
              to="/sign-up"
              className="ml-8 text-brand font-normal mt-4 inline "
            >
              Get Started <IoIosArrowForward className="inline text-lg" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          id="step2"
          className="flex gap-16  p-4 my-64 text-left bg-gray-50 items-center "
        >
          <div className="w-2/5">
            <p className="text-slate-800 font-bold text-3xl">
              Collect <span className="text-sunny">Real-Time</span> Data
            </p>
            <p className="text-slate-500 pl-2 text-xl pt-2 mb-4  ">
              Start collecting valuable data immediately. Track user
              interactions, engagement, and more with zero lag.
            </p>
            <a
              href="#step3"
              className=" text-sunny font-medium mt-4 inline "
              onClick={(e) => {
                e.preventDefault();
                scrollTo("step3");
              }}
            >
              Next Step <IoIosArrowForward className="inline text-lg" />
            </a>
            <Link
              to="/sign-up"
              className="ml-8 text-sunny font-medium mt-4 inline "
            >
              Get Started <IoIosArrowForward className="inline text-lg" />
            </Link>
          </div>
          <h1 className="font-extrabold text-9xl text-sunny">2</h1>
          <motion.img
            src={img2}
            alt=""
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="w-48"
          />
        </motion.div>

        <motion.div
          id="step3"
          className="flex  gap-16 ml-40  items-center my-32  "
        >
          {" "}
          <motion.img
            src={img3}
            alt=""
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="w-48"
          />
          <h1 className="font-bold text-9xl text-alert">3</h1>
          <div className="w-2/4">
            <p className="text-slate-800 font-bold text-3xl   ">
              Analyze and <span className="text-alert">Act</span>
            </p>{" "}
            <p className="text-slate-500 pt-2  text-xl mb-4 ">
              Use our intuitive dashboard to analyze your data and make informed
              decisions to boost your site’s performance.
            </p>
            <Link
              to="/sign-up"
              className=" text-alert  mt-4 inline "
            >
              Get Started <IoIosArrowForward className="inline text-lg" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Step;
