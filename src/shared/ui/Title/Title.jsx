import React from "react";
import style from "./Title.module.css";

const Title = ({ text }) => {
  return <h1 className={style.title__section}>{text}</h1> ;
};

export default Title ;
