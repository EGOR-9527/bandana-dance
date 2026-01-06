import React, { useState, useEffect, useRef } from "react";
import style from "./Events.module.css";
import EventCard from "../../features/ExpandableText/ui/EventCard";
import EmptyEvent from "../../features/ExpandableText/ui/EmptyEvent";
import Title from "../../shared/ui/Title/Title";
import ApiService from "../../shared/api/api";

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);

  // Функция для ленивой загрузки изображений
  const initLazyLoading = () => {
    if (!observerRef.current && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.classList.add(style.loaded);
            }
            observerRef.current.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px', // Начинаем загружать заранее
        threshold: 0.1
      });
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await ApiService.getEvents();

        if (res?.success && Array.isArray(res.data)) {
          // Если данные из устаревшего кэша, показываем но обновляем
          if (res.stale) {
            setEvents(res.data);
            
            // Фоновая загрузка свежих данных
            setTimeout(async () => {
              const freshRes = await ApiService.getEvents();
              if (freshRes.success && !freshRes.stale) {
                setEvents(freshRes.data);
              }
            }, 1000);
          } else {
            setEvents(res.data);
          }
        } else {
          setEvents([]);
          setError(res?.message || "Не удалось загрузить события");
        }
      } catch (err) {
        console.error("Ошибка загрузки событий:", err);
        setError("Ошибка соединения с сервером");
        setEvents([]);
      } finally {
        setLoading(false);
        
        // Инициализируем ленивую загрузку после получения данных
        setTimeout(() => {
          initLazyLoading();
          if (observerRef.current) {
            document.querySelectorAll(`.${style.lazyImage}`).forEach(img => {
              observerRef.current.observe(img);
            });
          }
        }, 100);
      }
    };

    fetchEvents();

    // Очистка при размонтировании
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Скелетон-заглушки
  const renderSkeletons = () => {
    return [1, 2, 3].map((i) => (
      <div key={i} className={style.skeletonCard}>
        <div className={style.skeletonImage} />
        <div className={style.skeletonTitle} />
        <div className={style.skeletonText} />
        <div className={style.skeletonTextShort} />
      </div>
    ));
  };

  if (loading) {
    return (
      <div className={style.events}>
        <Title text="СОБЫТИЯ" />
        <div className={style.container}>
          {renderSkeletons()}
        </div>
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className={style.events}>
        <Title text="СОБЫТИЯ" />
        <div className={style.errorContainer}>
          <p className={style.errorMessage}>{error}</p>
          <button 
            className={style.retryButton}
            onClick={() => window.location.reload()}
          >
            Обновить
          </button>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={style.events}>
        <Title text="СОБЫТИЯ" />
        <div className={style.container}>
          <EmptyEvent />
        </div>
      </div>
    );
  }

  return (
    <div className={style.events}>
      <Title text="СОБЫТИЯ" />
      <div className={style.container}>
        {events.map((event) => (
          <EventCard 
            key={event.id} 
            event={event}
            className={style.lazyLoadCard}
          />
        ))}
      </div>
      {events.length > 0 && (
        <div className={style.cacheInfo}>
          <small>Данные кэшированы для быстрой загрузки</small>
        </div>
      )}
    </div>
  );
};

export default EventsSection;