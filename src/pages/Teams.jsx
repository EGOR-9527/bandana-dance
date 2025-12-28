import React from "react";
import { ParticleCanvas } from "../shared/ui/Canvas/ParticleCanvas";
import Header from "../widget/Header/ui/Header.jsx";
import TeamsCarts from "../widget/Teams/ui/TeamsCarts.jsx";
import Contact from "../widget/Contact/ui/Contact.jsx";
const Teams = () => {
  return (
    <div>
      <ParticleCanvas className="background" />
      <Header
        text={[
          { page: "Главная страница", link: "/" },
          { page: "Галерея", link: "/gallery" },
        ]}
      />
      <TeamsCarts />
      <Contact/>
    </div>
  );
};

export default Teams;
