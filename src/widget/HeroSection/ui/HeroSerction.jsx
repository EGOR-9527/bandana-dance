import React from "react";
import styles from "./HeroSerction.module.css";
import { PrintedText } from "../../../entities/PrintedText";
import { useTypingEffect } from "../../../features/hooks/useTypingEffect";
import RollerogramButton from "../../../shared/ui/Button/RollerogramButton";

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const HeroSerction = () => {
  const text = useTypingEffect(PrintedText);

  return (
    <section className={styles.hero}>
      <h1 className={styles.title__hero}>BANDANA</h1>

      <p className={styles.text__hero}>{text}</p>

      <RollerogramButton
        className="aboutMe"
        text="about me"
        onClick={() => scrollToSection("biography")}
      />
    </section>
  );
};

export default HeroSerction;
