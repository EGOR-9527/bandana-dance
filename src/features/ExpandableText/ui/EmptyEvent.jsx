import React, { useState, useEffect } from "react";
import style from "./EmptyEvent.module.css";

const EmptyEvent = () => {
  const [shaking, setShaking] = useState(false);
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    if (highlighted) {
      const timer = setTimeout(() => {
        setHighlighted(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [highlighted]);

  const handleClick = () => {
    if (shaking || highlighted) return;

    setShaking(true);
    setHighlighted(false);
  };

  const handleAnimationEnd = () => {
    if (shaking) {
      setShaking(false);
      setHighlighted(true);
    }
  };

  return (
    <div
      className={`${style.card} ${shaking ? style.shake : ""}`}
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={style.front}>
        <p
          className={`${style.nullInfo} ${highlighted ? style.highlighted : ""}`}
        >
          Скоро информация дойдет и до сюда
        </p>
      </div>
    </div>
  );
};

export default EmptyEvent;
