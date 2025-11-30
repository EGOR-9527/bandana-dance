import React, { useState, useEffect } from "react";
import next from "../../svg/next.svg";
import back from "../../svg/back.svg";
import play from "../../svg/play.svg";
import style from "./Slier.module.css";
import Title from "../../../shared/ui/Title/Title";
import ApiService from "../../../shared/api/api";

const VideoSlider = ({ title }) => {
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await ApiService.getVideo();

        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setVideos(res.data);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error("Ошибка загрузки видео:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const length = videos.length;
  const current = videos[index];

  const nextSlide = () => setIndex((prev) => (prev + 1) % length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + length) % length);

  useEffect(() => {
    if (isPaused || length === 0) return;

    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [isPaused, index, length]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (loading) {
    return (
      <div className={style.slider}>
        <Title text={title} />
        <div className={style.loading}>
          <div className={style.skeletonVideo} />
          <p>Загружаем видео...</p>
        </div>
      </div>
    );
  }

  if (error || length === 0) {
    return (
      <div className={style.slider}>
        <Title text={title} />
        <p className={style.empty}>
          {error ? "Не удалось загрузить видео" : "Видео пока нет"}
        </p>
      </div>
    );
  }

  return (
    <div
      className={style.slider}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Title text={title} />

      <div className={style.wrapper}>
        <button
          onClick={prevSlide}
          className={`${style.circle} ${style.left}`}
          aria-label="Предыдущее видео"
        >
          <img src={back} alt="" />
        </button>

        <div className={style.videoContainer}>
          <video
            src={current.fileUrl}
            className={style.video}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
          />
          <div className={style.playOverlay}>
            <img src={play} alt="" />
          </div>

          <label htmlFor="video-modal" className={style.videoTrigger} />
        </div>

        <button
          onClick={nextSlide}
          className={`${style.circle} ${style.right}`}
          aria-label="Следующее видео"
        >
          <img src={next} alt="" />
        </button>
      </div>

      {current.name && <h3 className={style.videoTitle}>{current.name}</h3>}

      <div className={style.indicators}>
        {videos.map((_, i) => (
          <button
            key={i}
            className={`${style.dot} ${i === index ? style.activeDot : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Перейти к видео ${i + 1}`}
          />
        ))}
      </div>

      <input type="checkbox" id="video-modal" className={style.modalToggle} />

      <label htmlFor="video-modal" className={style.modalOverlay}>
        <label htmlFor="video-modal" className={style.modalContent}>
          <label htmlFor="video-modal" className={style.modalClose}>
            ×
          </label>

          <video
            src={current.fileUrl}
            controls
            autoPlay
            className={style.modalVideo}
          >
            Ваш браузер не поддерживает видео.
          </video>

          {current.name && (
            <div className={style.modalVideoTitle}>{current.name}</div>
          )}
        </label>
      </label>
    </div>
  );
};

export default VideoSlider;
