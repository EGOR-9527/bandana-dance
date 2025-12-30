import React, { useState, useEffect, useRef, useCallback } from "react";
import style from "./FilteredPhotos.module.css";
import ApiService from "../../../shared/api/api";
import CustomSelect from "./CustomSelect";

const FilteredPhotos = () => {
  const [filter, setFilter] = useState("Все");
  const [photos, setPhotos] = useState([]);
  const [filters, setFilters] = useState(["Все"]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const observer = useRef();
  const sentinelRef = useRef();

  useEffect(() => {
    const loadFilters = async () => {
      try {
        setLoadingFilters(true);
        const filtersRes = await ApiService.getGalleryFilters();
        if (filtersRes.success) {
          setFilters(filtersRes.data);
          setFilter((prev) => (filtersRes.data.includes(prev) ? prev : "Все"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFilters(false);
      }
    };
    loadFilters();
  }, []);

  const loadPhotos = useCallback(
    async (pageToLoad = 1, shouldReset = false) => {
      if ((!hasMore && !shouldReset) || loading) return;
      
      try {
        setLoading(true);
        
        const params = {
          page: pageToLoad,
          limit: 12
        };
        
        if (filter !== "Все") {
          params.filter = filter;
        }
        
        const galleryRes = await ApiService.getGallery(params);
        
        if (galleryRes.success) {
          if (shouldReset) {
            setPhotos(galleryRes.data);
          } else {
            setPhotos(prev => [...prev, ...galleryRes.data]);
          }
          
          setHasMore(galleryRes.hasMore);
          setPage(pageToLoad + 1);
          
          if (shouldReset) {
            setInitialLoadDone(true);
          }
        }
      } catch (err) {
        console.error("Ошибка загрузки фото:", err);
      } finally {
        setLoading(false);
      }
    },
    [filter, hasMore, loading]
  );

  useEffect(() => {
    if (initialLoadDone) {
      loadPhotos(1, true);
    }
  }, [filter, loadPhotos, initialLoadDone]);

  useEffect(() => {
    if (!initialLoadDone) {
      loadPhotos(1, true);
    }
  }, [initialLoadDone, loadPhotos]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading) return;

    const options = {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    };

    const handleIntersection = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        loadPhotos(page);
      }
    };

    observer.current = new IntersectionObserver(handleIntersection, options);
    observer.current.observe(sentinelRef.current);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, loading, page, loadPhotos]);

  const filteredPhotos =
    filter === "Все"
      ? photos
      : photos.filter((img) => img.filter === filter);

  return (
    <section className={style.photo_section}>
      <div className={style.selectWrapper}>
        {loadingFilters ? (
          <div className={style.selectSkeleton}>Загрузка фильтров...</div>
        ) : (
          <CustomSelect options={filters} value={filter} onChange={setFilter} />
        )}
      </div>

      <div className={style.gallery}>
        {filteredPhotos.map((img) => (
          <img
            key={img.id}
            src={img.fileUrl}
            alt={img.footer || img.filter || "Фото"}
            className={style.photo}
            loading="lazy"
            onClick={() =>
              setSelectedImage({ src: img.fileUrl, footer: img.footer })
            }
          />
        ))}

        {loading && (
          <div className={style.loadingIndicator}>
            Загрузка...
          </div>
        )}

        {!loading && filteredPhotos.length === 0 && (
          <p className={style.noPhotos}>
            {filter === "Все"
              ? "Фотографии отсутствуют"
              : `Фотографий в категории "${filter}" не найдено`}
          </p>
        )}

        <div ref={sentinelRef} style={{ height: "10px" }} />
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
              alt="Увеличенное фото"
              className={style.modalImage}
            />
            <button
              className={style.closeButton}
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>

          {selectedImage.footer && (
            <footer className={style.footer_window_photo}>
              {selectedImage.footer}
            </footer>
          )}
        </div>
      )}
    </section>
  );
};

export default FilteredPhotos;