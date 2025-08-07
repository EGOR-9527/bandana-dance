import React from "react";
import { ParticleCanvas } from "../shared/ui/Canvas/ParticleCanvas";
import Header from "../widget/Header/ui/Header.jsx";
import FilteredPhotos from "../features/ExpandableText/ui/FilteredPhotos.jsx";
const Gallery = () => {
  return (
    <div>
      <ParticleCanvas className="background" />
      <Header text="Главная строница" link="/" />
      <FilteredPhotos />
    </div>
  );
};

export default Gallery;
