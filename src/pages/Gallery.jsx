import React from "react";
import { ParticleCanvas } from "../shared/ui/Canvas/ParticleCanvas";
import Header from "../widget/Header/ui/Header.jsx";
import FilteredPhotos from "../features/ExpandableText/ui/FilteredPhotos.jsx";
import ScrollProgress from "../widget/ScrollProgress/ui/ScrollProgress.jsx";
import Contact from "../widget/Contact/ui/Contact.jsx";

const Gallery = () => {
  return (
    <div>
      <ParticleCanvas className="background" />
      <Header
        text={[
          { page: "Главная страница", link: "/" },
          { page: "Команды", link: "/teams" },
        ]}
      />
      <FilteredPhotos />
      <ScrollProgress />
      <Contact />
    </div>
  );
};

export default Gallery;
