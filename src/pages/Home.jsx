import React from "react";
import { ParticleCanvas } from "../shared/ui/Canvas/ParticleCanvas.jsx";
import ModelWindowProject from "../features/ExpandableText/ui/ModelWindowProject.jsx";
import HeroSerction from "../widget/HeroSection/ui/HeroSerction.jsx";
import EventsSection from "../widget/Events/EventsSection.jsx";
import Biography from "../widget/Biography/ui/Biography.jsx";
import Slider from "../shared/ui/Slider/Slider.jsx";
import Contact from "../widget/Contact/ui/Contact.jsx";
import ImgPath from "../entities/ImgPath.js";
import { VideoPath } from "../entities/VideoPath.js";
import Header from "../widget/Header/ui/Header.jsx";

const Home = () => {
  return (
    <div>
      <ParticleCanvas className="background" />

      <Header text="Галерея" link="/gallery" />

      <ModelWindowProject />

      <HeroSerction />

      <Biography />

      {VideoPath.length > 0 && (
        <Slider media={VideoPath} type="video" title="PERFORMANCES" />
      )}

      <Contact />
    </div>
  );
};

export default Home;
