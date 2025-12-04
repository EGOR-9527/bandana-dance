import React, { useState, useEffect, useRef } from "react";
import next from "../../svg/next.svg";
import back from "../../svg/back.svg";
import play from "../../svg/play.svg";
import style from "./Slider.module.css";
import Title from "../../../shared/ui/Title/Title";
import ApiService from "../../../shared/api/api";

const VideoSlider = ({ title }) => {
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
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

  const goTo = (i) => setIndex(((i % length) + length) % length);
  const nextSlide = () => goTo(index + 1);
  const prevSlide = () => goTo(index - 1);

  // Автопрокрутка слайдера
  useEffect(() => {
    if (isPaused || length === 0) return;
    intervalRef.current = setInterval(nextSlide, 8000);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, index, length]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !current) return;

  }, [index, current]);

  const enterFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = false;
      video.loop = false;
      video.controls = true;

      await video.play();

      if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        await video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        await video.msRequestFullscreen();
      }
    } catch (err) {
      console.warn("Не удалось развернуть видео:", err);
      video.muted = false;
      video.controls = true;
      video.play();
    }
  };

  const handleFullscreenChange = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      video.muted = true;
      video.loop = true;
      video.controls = false;
      video.play().catch(() => {});
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  if (loading) {
    return (
      <div className={style.slider}>
        <Title text={title} />
        <div className={style.loading}>
          <div className={style.skeletonVideo} />
        </div>
      </div>
    );
  }

  if (error || length === 0) {
    return (
      <div className={style.slider}>
        <Title text={title} />
        <p className={style.empty}>Видео пока нет</p>
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
          aria-label="Предыдущее"
        >
          <img src={back} alt="" />
        </button>

        <div
          className={style.videoContainer}
          onClick={enterFullscreen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && enterFullscreen()
          }
          aria-label="Нажмите — видео на весь экран со звуком"
        >
          <video
            ref={videoRef}
            src={current?.fileUrl}
            className={style.video}
            playsInline
            preload="auto"
          />

          {!document.fullscreenElement && (
            <div className={style.playOverlay}>
              <img src={play} alt="На весь экран со звуком" />
            </div>
          )}
        </div>

        <button
          onClick={nextSlide}
          className={`${style.circle} ${style.right}`}
          aria-label="Следующее"
        >
          <img src={next} alt="" />
        </button>
      </div>

      {current?.name && <h3 className={style.videoTitle}>{current.name}</h3>}

      <div className={style.indicators}>
        {videos.map((_, i) => (
          <button
            key={i}
            className={`${style.dot} ${i === index ? style.activeDot : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Видео ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoSlider;
