import React from "react";
import img from "./img.png";
import img1 from "./img3.png";
import img2 from "./img4.png";
import { motion } from "framer-motion";
import HowItWorks from "../../HowItWorks/HowItWorks";

function FeaturesSection() {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
      }}
      className=" bg-brand"
    >
      <div className="p-28">
        <motion.h1 className="text-3xl text-slate-100 font-bold">
          Une installation simple,{" "}
          <span className="text-sunny border-b-2 border-sunny pb-2 ">
            des informations instantanées
          </span>
        </motion.h1>
        <div className="flex  pt-28">
          <motion.img
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
              Démarrez avec TrackMySite en quelques{" "}
              <span className="font-bold text-slate-100"> clics.</span>Notre
              processus d'intégration processus d'intégration simple signifie
              que vous n'êtes qu'à quelques minutes d'obtenir des analyses
              complètes pour votre site web.
            </p>

            <button className="text-white bg-sunny px-5 py-2 my-4 rounded-md text-lg font-semibold  shadow-2xl">
              Voir Insteraction
            </button>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="h-5/6 bg-gray-50 w-full  p-28"
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          ease: "linear",
          duration: 0.6,
        }}
      >
        <h1 className="text-3xl text-slate-800 font-bold">
          L'Analytique Rendue <span className="text-brand"> Accessible</span>
        </h1>
        <div className="flex gap-6">
          <motion.p
            className="text-xl  text-gray-500 pt-16"
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              ease: "linear",
              duration: 0.6,
            }}
          >
            Naviguez dans vos données grâce à un tableau de bord intuitif conçu
            pour la clarté. clarté. Que vous soyez un data scientist ou un chef
            d'entreprise, il n'a jamais été aussi facile de prendre des
            décisions basées sur des données. décisions basées sur les données
            n'a jamais été aussi facile.
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
          Plongez dans <span className="text-alert">vos données</span>{" "}
        </h1>
        <div className="flex justify-between">
          <div className="w-2/4 pt-12  ">
            <motion.p className=" text-gray-500  text-xl  ">
              Du comportement des visiteurs au suivi des conversions, TMS vous
              fournit les informations détaillées nécessaires à l'optimisation
              de la performance de votre site performance de votre site et
              améliorer l'expérience de l'utilisateur
            </motion.p>
            <div className="  mt-4 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="text-white font-semibold bg-alert rounded-md px-4 py-1.5 shadow-md  "
              >
                S'inscrire maintenant
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="text-gray-800 bg-gray-50 border border-gray-300  rounded-md px-4 py-1.5 shadow-md "
              >
                En savoir plus
              </motion.button>
            </div>
          </div>
          <motion.img
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
