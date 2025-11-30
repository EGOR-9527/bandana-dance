import React, { useState, useEffect, useRef } from "react";
import styles from "./ScrollProgress.module.css";

const ScrollProgress = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const isDragging = useRef(false);
  const targetScroll = useRef(0);
  const isAnimating = useRef(false);
  const animationFrame = useRef(null);
  const barRef = useRef(null);

  const getScrollPercent = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const totalScrollable = docHeight - winHeight;
    return Math.min(Math.max((scrollTop / totalScrollable) * 100, 0), 100);
  };

  const animateScroll = () => {
    const diff = targetScroll.current - window.scrollY;
    if (Math.abs(diff) < 0.5) {
      window.scrollTo(0, targetScroll.current);
      isAnimating.current = false;
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
      return;
    }
    window.scrollTo(0, window.scrollY + diff * 0.15);
    animationFrame.current = requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!isDragging.current) setScrollPercent(getScrollPercent());
    };

    const handlePointerMove = (clientY) => {
      if (!isDragging.current) return;
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalScrollable = docHeight - winHeight;

      const percent = Math.min(Math.max((clientY / winHeight) * 100, 0), 100);
      targetScroll.current = (totalScrollable * percent) / 100;
      setScrollPercent(percent);

      if (!isAnimating.current) {
        isAnimating.current = true;
        animationFrame.current = requestAnimationFrame(animateScroll);
      }
    };

    const handleMouseMove = (e) => handlePointerMove(e.clientY);

    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      handlePointerMove(e.touches[0].clientY);
    };

    const stopDragging = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      isAnimating.current = false;
      document.body.style.userSelect = "auto";

      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }

      setScrollPercent(getScrollPercent());
    };

    const handleWheel = () => {
      if (isAnimating.current) {
        isAnimating.current = false;
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
          animationFrame.current = null;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("wheel", handleWheel, { passive: true });

    const bar = barRef.current;
    if (bar) {
      bar.addEventListener("touchmove", handleTouchMove, { passive: false });
      bar.addEventListener("touchend", stopDragging);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("wheel", handleWheel);
      if (bar) {
        bar.removeEventListener("touchmove", handleTouchMove);
        bar.removeEventListener("touchend", stopDragging);
      }
    };
  }, []);

  const startDragging = (e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.userSelect = "none";
  };

  return (
    <aside ref={barRef} className={styles.scrollBar}>
      <div
        onMouseDown={startDragging}
        onTouchStart={startDragging}
        className={styles.thumb}
        style={{
          top: `calc(${scrollPercent}% - 10px)`,
          transition: isDragging.current ? "none" : "top 0.15s ease-out",
        }}
      >
        <span className={styles.percent}>{Math.round(scrollPercent)}%</span>
      </div>
    </aside>
  );
};

export default ScrollProgress;
