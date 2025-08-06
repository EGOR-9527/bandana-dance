import React, { useState, useEffect } from "react";
import { ParticleCanvas } from "./shared/ui/Canvas/ParticleCanvas";
import HeroSerction from "./widget/HeroSection/ui/HeroSerction";
import Biography from "./widget/Biography/ui/Biography";
import Slider from "./shared/ui/Slider/Slider";
import EventsSection from "./widget/Events/EventsSection.jsx";
import Contact from "./widget/Contact/ui/Contact";
import "./App.css";
import ModelWindowProject from "./features/ExpandableText/ui/ModelWindowProject.jsx";

import { ImgPath } from "./entities/ImgPath";
import { VideoPath } from "./entities/VideoPath";

function App() {
  return (
    <div className="app">
      <ParticleCanvas className="background" />

      <ModelWindowProject />

      <HeroSerction />

      <EventsSection />

      <Biography />

      {ImgPath.length > 0 && (
        <Slider media={ImgPath} type="img" title="GALLERY" />
      )}

      {VideoPath.length > 0 && (
        <Slider media={VideoPath} type="video" title="PERFORMANCES" />
      )}

      <Contact />
    </div>
  );
}

export default App;
