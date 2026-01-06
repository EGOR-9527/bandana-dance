import React, { useState, useEffect, useRef, useCallback } from "react";
import next from "../../svg/next.svg";
import back from "../../svg/back.svg";
import play from "../../svg/play.svg";
import style from "./Slider.module.css";
import Title from "../../../shared/ui/Title/Title";
import ApiService from "../../../shared/api/api";

const VideoSlider = ({ title = "ВИДЕО" }) => {
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [preloadedVideos, setPreloadedVideos] = useState(new Set());
  const [videoLoaded, setVideoLoaded] = useState(false);

  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const preloadTimerRef = useRef(null);

  // Предзагрузка соседних видео
  const preloadAdjacentVideos = useCallback((currentIndex) => {
    if (videos.length === 0) return;
    
    const indicesToPreload = [
      (currentIndex + 1) % videos.length,
      (currentIndex + 2) % videos.length,
      (currentIndex - 1 + videos.length) % videos.length,
    ];

    indicesToPreload.forEach(i => {
      const video = videos[i];
      if (video?.fileUrl && !preloadedVideos.has(video.fileUrl)) {
        const videoElement = document.createElement('video');
        videoElement.src = video.fileUrl;
        videoElement.preload = 'metadata';
        videoElement.onloadeddata = () => {
          setPreloadedVideos(prev => new Set([...prev, video.fileUrl]));
        };
      }
    });
  }, [videos, preloadedVideos]);

  // Загрузка видео
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const res = await ApiService.getVideo();
        
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          if (res.stale) {
            setVideos(res.data);
            
            // Фоновая загрузка свежих данных
            setTimeout(async () => {
              const freshRes = await ApiService.getVideo();
              if (freshRes.success && !freshRes.stale) {
                setVideos(freshRes.data);
              }
            }, 1000);
          } else {
            setVideos(res.data);
          }
        } else {
          setVideos([]);
          setError(true);
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

  const goTo = useCallback((i) => {
    setIndex(((i % length) + length) % length);
    setVideoLoaded(false);
  }, [length]);

  const nextSlide = useCallback(() => goTo(index + 1), [goTo, index]);
  const prevSlide = useCallback(() => goTo(index - 1), [goTo, index]);

  // Автопрокрутка слайдера
  useEffect(() => {
    if (isPaused || length === 0 || loading) return;
    
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 10000); // 10 секунд
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, index, length, loading, nextSlide]);

  // Предзагрузка видео при смене слайда
  useEffect(() => {
    if (length > 0) {
      preloadAdjacentVideos(index);
    }
  }, [index, length, preloadAdjacentVideos]);

  // Обработчик загрузки видео
  const handleVideoLoad = () => {
    setVideoLoaded(true);
    
    // Предзагрузка следующего видео после загрузки текущего
    if (preloadTimerRef.current) {
      clearTimeout(preloadTimerRef.current);
    }
    
    preloadTimerRef.current = setTimeout(() => {
      preloadAdjacentVideos(index);
    }, 1000);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const enterFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      // Сохраняем текущее состояние
      const wasMuted = video.muted;
      const wasLoop = video.loop;
      const hadControls = video.controls;
      
      // Настраиваем для полноэкранного режима
      video.muted = false;
      video.loop = false;
      video.controls = true;
      
      // Пытаемся воспроизвести
      await video.play();
      
      // Входим в полноэкранный режим
      if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        await video.webkitRequestFullscreen();
      } else if (video.mozRequestFullScreen) {
        await video.mozRequestFullScreen();
      } else if (video.msRequestFullscreen) {
        await video.msRequestFullscreen();
      }
      
      // Восстанавливаем состояние при выходе
      const restoreState = () => {
        video.muted = wasMuted;
        video.loop = wasLoop;
        video.controls = hadControls;
        
        if (!wasMuted) {
          video.muted = true;
          video.play().catch(() => {});
        }
        
        document.removeEventListener('fullscreenchange', restoreState);
        document.removeEventListener('webkitfullscreenchange', restoreState);
        document.removeEventListener('mozfullscreenchange', restoreState);
        document.removeEventListener('MSFullscreenChange', restoreState);
      };
      
      document.addEventListener('fullscreenchange', restoreState);
      document.addEventListener('webkitfullscreenchange', restoreState);
      document.addEventListener('mozfullscreenchange', restoreState);
      document.addEventListener('MSFullscreenChange', restoreState);
      
    } catch (err) {
      console.warn("Не удалось развернуть видео:", err);
      // Пытаемся воспроизвести без полноэкранного режима
      video.muted = false;
      video.controls = true;
      video.play().catch(() => {});
    }
  };

  // Скелетон для загрузки
  if (loading) {
    return (
      <div className={style.slider}>
        <Title text={title} />
        <div className={style.loadingContainer}>
          <div className={style.skeletonVideo}>
            <div className={style.skeletonPlayButton} />
          </div>
          <div className={style.skeletonIndicators}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={style.skeletonDot} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || length === 0) {
    return (
      <div className={style.slider}>
        <Title text={title} />
        <div className={style.emptyContainer}>
          <p className={style.emptyMessage}>Видео пока нет</p>
          <p className={style.emptySubtitle}>Скоро здесь появятся новые видео</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={style.slider}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
    >
      <Title text={title} />

      <div className={style.wrapper}>
        <button
          onClick={prevSlide}
          className={`${style.circle} ${style.left}`}
          aria-label="Предыдущее видео"
          disabled={loading}
        >
          <img src={back} alt="Назад" />
        </button>

        <div
          className={style.videoContainer}
          onClick={enterFullscreen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              enterFullscreen();
            }
          }}
          aria-label={`Нажмите для просмотра видео "${current?.title || 'без названия'}" на весь экран`}
        >
          {!videoLoaded && preloadedVideos.has(current?.fileUrl) && (
            <div className={style.loadingOverlay}>
              <div className={style.loadingSpinner} />
            </div>
          )}
          
          <video
            ref={videoRef}
            src={current?.fileUrl}
            className={`${style.video} ${videoLoaded ? style.videoLoaded : ''}`}
            playsInline
            preload="auto"
            muted
            loop
            onLoadedData={handleVideoLoad}
            onError={() => {
              console.error('Ошибка загрузки видео:', current?.fileUrl);
              setVideoLoaded(true);
            }}
            poster={current?.thumbnailUrl}
          />

          {!document.fullscreenElement && (
            <div className={style.playOverlay}>
              <img 
                src={play} 
                alt="На весь экран со звуком" 
                className={style.playIcon}
              />
              <span className={style.playText}>Нажмите для полноэкранного просмотра</span>
            </div>
          )}
        </div>

        <button
          onClick={nextSlide}
          className={`${style.circle} ${style.right}`}
          aria-label="Следующее видео"
          disabled={loading}
        >
          <img src={next} alt="Вперед" />
        </button>
      </div>

      {current?.title && (
        <h3 className={style.videoTitle}>
          {current.title}
          {current.description && (
            <span className={style.videoDescription}> • {current.description}</span>
          )}
        </h3>
      )}

      <div className={style.indicators}>
        {videos.map((video, i) => (
          <button
            key={video.id || i}
            className={`${style.dot} ${i === index ? style.activeDot : ''} ${
              preloadedVideos.has(video.fileUrl) ? style.preloadedDot : ''
            }`}
            onClick={() => goTo(i)}
            aria-label={`Видео ${i + 1}: ${video.title || 'без названия'}`}
            aria-current={i === index}
          >
            {preloadedVideos.has(video.fileUrl) && (
              <span className={style.preloadBadge}>✓</span>
            )}
          </button>
        ))}
      </div>
      
      {videos.length > 0 && (
        <div className={style.cacheInfo}>
          <small>Видео кэшированы • Автопрокрутка каждые 10 секунд</small>
        </div>
      )}
    </div>
  );
};

export default VideoSlider;