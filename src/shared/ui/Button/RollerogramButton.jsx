import React from "react";
import clsx from "clsx";
import styles from "./RollerogramButton.module.css";

const RollerogramButton = ({ onClick, className = "", text, svg }) => {
  const mappedClasses = className
    .split(" ")
    .map((cls) => styles[cls])
    .filter(Boolean);

  return (
    <button
      onClick={onClick}
      className={clsx(styles.rollerogram__button__base, ...mappedClasses)}
    >
      {svg ? <img src={svg} alt="" className={styles.icon}/> : null}
      <p>{text}</p>
    </button>
  );
};

export default RollerogramButton;
