import React, { useState, useEffect, useRef } from "react";
import styles from "./ScrollProgress.module.css";

const ScrollProgress = () => {
  const [scrollPercent, setScrollPercent] = useState(2);
  const isDragging = useRef(false);
  const targetScroll = useRef(0);
  const currentScroll = useRef(window.scrollY);
  const animationFrame = useRef(null);

  useEffect(() => {
    const updateScrollPercent = () => {
      if (isDragging.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const totalScrollable = docHeight - winHeight;

      const scrolled = (scrollTop / totalScrollable) * 100;
      setScrollPercent(Math.ceil(Math.min(Math.max(scrolled, 0), 100)));
    };

    const animateScroll = () => {
      if (!isDragging.current) return;
      currentScroll.current += (targetScroll.current - currentScroll.current) * 0.2;
      window.scrollTo(0, currentScroll.current);
      animationFrame.current = requestAnimationFrame(animateScroll);
    };

    const handleMove = (clientY) => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalScrollable = docHeight - winHeight;
      const percent = (clientY / winHeight) * 100;
      const scrollTo = (totalScrollable * percent) / 100;
      targetScroll.current = scrollTo;
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
      cancelAnimationFrame(animationFrame.current);
    };

    window.addEventListener("scroll", updateScrollPercent);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchend", stopDragging);

    return () => {
      window.removeEventListener("scroll", updateScrollPercent);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchend", stopDragging);
    };
  }, []);

  const startDragging = (e) => {
    isDragging.current = true;
    document.body.style.userSelect = "none";
    currentScroll.current = window.scrollY;

    // Инициализируем target сразу
    if (e.touches) targetScroll.current = e.touches[0].clientY;
    else targetScroll.current = e.clientY;

    cancelAnimationFrame(animationFrame.current);
    animationFrame.current = requestAnimationFrame(() => {
      requestAnimationFrame(animateScroll);
    });

    function animateScroll() {
      if (!isDragging.current) return;
      currentScroll.current += (targetScroll.current - currentScroll.current) * 0.15;
      window.scrollTo(0, currentScroll.current);
      animationFrame.current = requestAnimationFrame(animateScroll);
    }
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
        <span className={styles.percent}>{scrollPercent}%</span>
      </div>
    </aside>
  );
};

export default ScrollProgress;
