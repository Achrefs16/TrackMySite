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
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            src={img1}
            alt=""
            className="w-48"
          />
          <h1 className="font-extrabold text-9xl text-brand  text-center">1</h1>
          <div className="">
            <p className="text-slate-800 font-bold  text-3xl">
              Une intégration <span className="text-brand">sans effort</span>
            </p>
            <p className="text-slate-500 text-xl pt-2 mb-4 ">
              Une solution simple et rapide, pour améliorer rapidement votre
              site web grâce à notre code de suivi léger et facile à intégrer.
              Code de suivi léger et facile à intégrer. Pas de ralentissement.
            </p>
            <a
              href="#step2"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("step2");
              }}
              className=" text-brand font-normal mt-4 inline "
            >
              Étape Suivante <IoIosArrowForward className="inline text-lg" />
            </a>
            <Link
              to="/sign-up"
              className="ml-8 text-brand font-normal mt-4 inline "
            >
              Commencer <IoIosArrowForward className="inline text-lg" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          id="step2"
          className="flex gap-16  p-4 my-64 text-left bg-gray-50 items-center "
        >
          <div className="w-2/5">
            <p className="text-slate-800 font-bold text-3xl">
              Collecter <span className="text-sunny">des données </span> en
              temps réel
            </p>
            <p className="text-slate-500 pl-2 text-xl pt-2 mb-4  ">
              Commencez immédiatement à collecter des données précieuses. Suivez
              les interactions de l'utilisateur, de l'engagement et plus encore,
              sans aucun décalage.
            </p>
            <a
              href="#step3"
              className=" text-sunny font-medium mt-4 inline "
              onClick={(e) => {
                e.preventDefault();
                scrollTo("step3");
              }}
            >
              Étape suivante <IoIosArrowForward className="inline text-lg" />
            </a>
            <Link
              to="/sign-up"
              className="ml-8 text-sunny font-medium mt-4 inline "
            >
              Commencer <IoIosArrowForward className="inline text-lg" />
            </Link>
          </div>
          <h1 className="font-extrabold text-9xl text-sunny">2</h1>
          <motion.img
            src={img2}
            alt=""
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
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="w-48"
          />
          <h1 className="font-bold text-9xl text-alert">3</h1>
          <div className="w-2/4">
            <p className="text-slate-800 font-bold text-3xl   ">
              Analyser et <span className="text-alert">agir</span>
            </p>{" "}
            <p className="text-slate-500 pt-2  text-xl mb-4 ">
              Utilisez notre tableau de bord intuitif pour analyser vos données
              et prendre des décisions éclairées pour améliorer la performance
              de votre site. pour améliorer les performances de votre site.
            </p>
            <Link
              to="/sign-up"
              className=" text-alert  mt-4 inline "
            >
              Commencer <IoIosArrowForward className="inline text-lg" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Step;
