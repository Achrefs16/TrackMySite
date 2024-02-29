import React from "react";
import NavBar from "../NavBar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import FooterSection from "./FooterSection";

function Home() {
  return (
    <>
      {" "}
      <NavBar></NavBar>
      <div className="scroll-smooth  focus:scroll-auto  bg-gray-50">
        <HeroSection />
        <FeaturesSection />
        <FooterSection />
      </div>
    </>
  );
}

export default Home;
