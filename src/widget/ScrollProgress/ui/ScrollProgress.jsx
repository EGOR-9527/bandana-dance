import React, { useState, useEffect, useRef } from "react";
import styles from "./ScrollProgress.module.css";

const ScrollProgress = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const isDragging = useRef(false);
  const dragOffset = useRef(2);
  const docHeight = useRef(document.documentElement.scrollHeight);
  const winHeight = useRef(window.innerHeight);

  useEffect(() => {
    const updateScrollPercent = () => {
      if (isDragging.current) return;
      const scrollTop = window.scrollY;
      const totalScrollable = docHeight.current - winHeight.current;
      const percent = (scrollTop / totalScrollable) * 100;
      setScrollPercent(Math.min(Math.max(percent, 0), 100));
    };

    window.addEventListener("scroll", updateScrollPercent);
    window.addEventListener("resize", () => {
      docHeight.current = document.documentElement.scrollHeight;
      winHeight.current = window.innerHeight;
    });

    return () => {
      window.removeEventListener("scroll", updateScrollPercent);
    };
  }, []);

  const handleDrag = (clientY) => {
    const totalScrollable = docHeight.current - winHeight.current;
    const newPercent = ((clientY - dragOffset.current) / winHeight.current) * 100;
    const scrollTo = (totalScrollable * Math.min(Math.max(newPercent, 0), 100)) / 100;
    window.scrollTo({ top: scrollTo, behavior: "auto" });
    setScrollPercent((scrollTo / totalScrollable) * 100);
  };

  const startDragging = (e) => {
    isDragging.current = true;
    document.body.style.userSelect = "none";

    const thumb = e.target.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragOffset.current = clientY - (thumb.top + thumb.height / 2);

    const moveHandler = (ev) => {
      const moveY = ev.touches ? ev.touches[0].clientY : ev.clientY;
      handleDrag(moveY);
    };

    const stopHandler = () => {
      isDragging.current = false;
      document.body.style.userSelect = "auto";
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", stopHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("touchend", stopHandler);
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", stopHandler);
    window.addEventListener("touchmove", moveHandler, { passive: false });
    window.addEventListener("touchend", stopHandler);
  };

  return (
    <aside className={styles.scrollBar}>
      <div
        onMouseDown={startDragging}
        onTouchStart={startDragging}
        className={styles.thumb}
        style={{
          top: `${scrollPercent}%`,
          transition: isDragging.current ? "none" : "top 0.1s linear",
        }}
      >
        <span className={styles.percent}>{Math.round(scrollPercent)}%</span>
      </div>
    </aside>
  );
};

export default ScrollProgress;
