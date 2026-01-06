import React, { useState, useEffect, useRef, useCallback } from "react";
import style from "./FilteredPhotos.module.css";
import ApiService from "../../../shared/api/api";
import CustomSelect from "./CustomSelect";

const FilteredPhotos = () => {
  const [filter, setFilter] = useState("Все");
  const [photos, setPhotos] = useState([]);
  const [filters, setFilters] = useState(["Все"]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0,
    pages: 1,
    hasMore: false
  });
  const [loadedImages, setLoadedImages] = useState(new Set());
  
  const observerRef = useRef(null);
  const galleryRef = useRef(null);

  // Инициализация Intersection Observer для ленивой загрузки
  const initLazyLoadObserver = useCallback(() => {
    if (!observerRef.current && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            const thumbnail = img.dataset.thumbnail;
            
            // Сначала показываем thumbnail если есть
            if (thumbnail && !img.src) {
              img.src = thumbnail;
            }
            
            // Затем загружаем полноразмерное изображение
            if (src && !loadedImages.has(src)) {
              const fullImage = new Image();
              fullImage.src = src;
              fullImage.onload = () => {
                img.src = src;
                img.classList.add(style.loaded);
                setLoadedImages(prev => new Set([...prev, src]));
              };
            }
            
            observerRef.current.unobserve(img);
          }
        });
      }, {
        rootMargin: '100px',
        threshold: 0.01
      });
    }
  }, [loadedImages]);

  // Инициализация Observer для бесконечного скролла
  const initInfiniteScrollObserver = useCallback(() => {
    const loadMoreTrigger = document.getElementById('load-more-trigger');
    if (loadMoreTrigger && pagination.hasMore && !loadingMore) {
      const scrollObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          loadMorePhotos();
        }
      }, { threshold: 0.1 });
      
      scrollObserver.observe(loadMoreTrigger);
      return () => scrollObserver.disconnect();
    }
  }, [pagination.hasMore, loadingMore]);

  // Загрузка фильтров
  useEffect(() => {
    const loadFilters = async () => {
      try {
        setLoadingFilters(true);
        const filtersRes = await ApiService.getGalleryFilters();
        
        if (filtersRes.success) {
          setFilters(filtersRes.data);
          setFilter(prev => filtersRes.data.includes(prev) ? prev : "Все");
        }
      } catch (err) {
        console.error("Ошибка загрузки фильтров:", err);
      } finally {
        setLoadingFilters(false);
      }
    };

    loadFilters();
  }, []);

  // Загрузка фотографий
  const loadPhotos = async (page = 1, shouldAppend = false) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      
      const galleryRes = await ApiService.getGallery(page, pagination.limit, filter);
      
      if (galleryRes.success) {
        const newPhotos = galleryRes.data;
        
        if (shouldAppend) {
          setPhotos(prev => [...prev, ...newPhotos]);
        } else {
          setPhotos(newPhotos);
          // Сбрасываем загруженные изображения при смене фильтра
          if (page === 1) {
            setLoadedImages(new Set());
          }
        }
        
        setPagination(galleryRes.pagination || {
          page,
          limit: pagination.limit,
          total: newPhotos.length,
          pages: 1,
          hasMore: false
        });
      }
    } catch (err) {
      console.error("Ошибка загрузки галереи:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Загрузка дополнительных фотографий
  const loadMorePhotos = () => {
    if (!loadingMore && pagination.hasMore) {
      loadPhotos(pagination.page + 1, true);
    }
  };

  // Эффект для загрузки фотографий при изменении фильтра или страницы
  useEffect(() => {
    if (!loadingFilters) {
      loadPhotos(1, false);
    }
  }, [filter, loadingFilters]);

  // Инициализация ленивой загрузки после обновления фотографий
  useEffect(() => {
    if (photos.length > 0) {
      initLazyLoadObserver();
      
      // Наблюдаем за изображениями
      setTimeout(() => {
        if (observerRef.current) {
          document.querySelectorAll(`.${style.lazyPhoto}`).forEach(img => {
            observerRef.current.observe(img);
          });
        }
      }, 100);
      
      // Инициализация бесконечного скролла
      initInfiniteScrollObserver();
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [photos, initLazyLoadObserver, initInfiniteScrollObserver]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    // Прокрутка к началу галереи при смене фильтра
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={style.photo_section} ref={galleryRef}>
      <div className={style.selectWrapper}>
        {loadingFilters ? (
          <div className={style.selectSkeleton}>
            <div className={style.skeletonSelect} />
          </div>
        ) : (
          <CustomSelect 
            options={filters} 
            value={filter} 
            onChange={handleFilterChange} 
          />
        )}
      </div>

      <div className={style.gallery}>
        {loading ? (
          [...Array(12)].map((_, i) => (
            <div key={i} className={style.skeleton}>
              <div className={style.skeletonImage} />
              <div className={style.skeletonTitle} />
            </div>
          ))
        ) : photos.length === 0 ? (
          <p className={style.noPhotos}>
            {filter === "Все"
              ? "Фотографии отсутствуют"
              : `Фотографий в категории "${filter}" не найдено`}
          </p>
        ) : (
          <>
            {photos.map((img) => (
              <div key={img.id} className={style.photoWrapper}>
                <img
                  data-src={img.fileUrl}
                  data-thumbnail={img.thumbnailUrl || img.fileUrl}
                  alt={img.title || img.filter || "Фото"}
                  className={`${style.photo} ${style.lazyPhoto}`}
                  loading="lazy"
                  onClick={() =>
                    setSelectedImage({
                      src: img.fileUrl,
                      thumbnail: img.thumbnailUrl,
                      footer: img.footer,
                      title: img.title
                    })
                  }
                />
                {img.title && <div className={style.photoTitle}>{img.title}</div>}
              </div>
            ))}
            
            {/* Триггер для бесконечного скролла */}
            {pagination.hasMore && (
              <div id="load-more-trigger" className={style.loadMoreTrigger}>
                {loadingMore ? (
                  <div className={style.loadingSpinner} />
                ) : (
                  <button 
                    className={style.loadMoreButton}
                    onClick={loadMorePhotos}
                  >
                    Загрузить еще
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {selectedImage && (
        <div
          className={style.modalOverlay}
          onClick={() => setSelectedImage(null)}
        >
          <div
            className={style.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.title || "Увеличенное фото"}
              className={style.modalImage}
              loading="eager" // Загружаем сразу в модалке
            />
            <button
              className={style.closeButton}
              onClick={() => setSelectedImage(null)}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>

          {(selectedImage.footer || selectedImage.title) && (
            <footer className={style.footer_window_photo}>
              {selectedImage.title && (
                <h3 className={style.modalTitle}>{selectedImage.title}</h3>
              )}
              {selectedImage.footer && (
                <p className={style.modalFooter}>{selectedImage.footer}</p>
              )}
            </footer>
          )}
        </div>
      )}
      
      {!loading && photos.length > 0 && (
        <div className={style.paginationInfo}>
          <small>
            Показано {photos.length} из {pagination.total} фото • 
            Страница {pagination.page} из {pagination.pages}
          </small>
        </div>
      )}
    </section>
  );
};

export default FilteredPhotos;