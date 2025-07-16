import React, { useState, useEffect } from "react";
import next from "../../svg/next.svg";
import back from "../../svg/back.svg";
import style from "./Slier.module.css";
import Title from "../../../shared/ui/Title/Title";

const Slider = ({ media, type, title }) => {
  const [index, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const nextHandle = () => {
    setIndex((prev) => (prev + 1) % media.length);
  };

  const backHandle = () => {
    setIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextHandle();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className={style.slider}>
      <Title text={title} />

      <div className={style.wrapper}>
        <button
          onClick={backHandle}
          className={`${style.circle} ${style.left}`}
          aria-label="Назад"
        >
          <img src={back} alt="Назад" />
        </button>

        {media.map((item, i) => (
          <div
            className={`${style.slide} ${i === index ? style.active : ""}`}
            key={i}
          >
            {type === "img" ? (
              <img
                src={item}
                alt={`slide-${i}`}
                onClick={() => openModal(<img src={item} alt={`modal-${i}`} />)}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <video
                src={item}
                controls={false}
                onClick={() =>
                  openModal(
                    <video
                      src={item}
                      controls
                      autoPlay
                      style={{ maxWidth: "90vw", maxHeight: "90vh" }}
                    />
                  )
                }
                style={{ cursor: "pointer" }}
              />
            )}
          </div>
        ))}

        <button
          onClick={nextHandle}
          className={`${style.circle} ${style.right}`}
          aria-label="Вперёд"
        >
          <img src={next} alt="Вперёд" />
        </button>
      </div>

      <ul className={style.indicator}>
        {media.map((_, i) => (
          <li
            key={i}
            className={`${style.indicatorDot} ${
              i === index ? style.activeDot : ""
            }`}
            onClick={() => setIndex(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setIndex(i);
            }}
          />
        ))}
      </ul>

      {/* Модалка */}
      {modalOpen && (
        <div className={style.modalOverlay} onClick={closeModal}>
          <div
            className={style.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={style.modalClose} onClick={closeModal}>
              ✕
            </button>
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;
