import React, { useState, useEffect, useRef } from "react";
import styles from "./ScrollProgress.module.css";

const ScrollProgress = () => {
  const [scrollPercent, setScrollPercent] = useState(2);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const totalScrollable = docHeight - winHeight;

      const scrolled = (scrollTop / totalScrollable) * 100;
      setScrollPercent(Math.ceil(Math.min(Math.max(scrolled, 0), 100)));
    };

    const handleMove = (clientY) => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalScrollable = docHeight - winHeight;

      const percent = (clientY / winHeight) * 100;
      const scrollTo = (totalScrollable * percent) / 100;
      window.scrollTo({ top: scrollTo, behavior: "auto" });
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      handleMove(e.clientY);
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      handleMove(e.touches[0].clientY);
    };

    const stopDragging = () => {
      isDragging.current = false;
      document.body.style.userSelect = "auto";
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", stopDragging);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDragging);
    };
  }, []);

  const startDragging = () => {
    isDragging.current = true;
    document.body.style.userSelect = "none";
  };

  return (
    <aside className={styles.scrollBar}>
      <div
        onMouseDown={startDragging}
        onTouchStart={startDragging}
        className={`${styles.thumb} ${isDragging.current ? styles.dragging : ""}`}
        style={{
          top: `${scrollPercent}%`,
          transition: isDragging.current ? "none" : "top 0.1s linear",
        }}
      >
        <span className={styles.percent}>{scrollPercent}%</span>
      </div>
    </aside>
  );
};

export default ScrollProgress;
