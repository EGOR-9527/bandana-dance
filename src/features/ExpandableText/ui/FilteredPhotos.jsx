import React, { useState, useEffect, useRef } from "react";
import style from "./FilteredPhotos.module.css";
import ApiService from "../../../shared/api/api";
import CustomSelect from "./CustomSelect";

const FilteredPhotos = () => {
  const [filter, setFilter] = useState("Все");
  const [filters, setFilters] = useState(["Все"]);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const loaderRef = useRef(null);

  /* ---------- загрузка фильтров ---------- */
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const res = await ApiService.getGalleryFilters();
        if (res.success) {
          setFilters(["Все", ...res.data]);
        }
      } catch (e) {
        console.error("Ошибка загрузки фильтров", e);
      } finally {
        setLoadingFilters(false);
      }
    };

    loadFilters();
  }, []);

  /* ---------- загрузка фото ---------- */
  const loadPhotos = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    try {
      const res = await ApiService.getGallery({
        page: reset ? 1 : page,
        filter: filter === "Все" ? null : filter,
      });

      if (res.success) {
        setPhotos(reset ? res.data : [...res.data]);
        setPage(reset ? 2 : page + 1);
        setHasMore(res.hasMore);
      }
    } catch (e) {
      console.error("Ошибка загрузки фото", e);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- первая загрузка ---------- */
  useEffect(() => {
    loadPhotos(true);
    // eslint-disable-next-line
  }, []);

  /* ---------- смена фильтра ---------- */
  useEffect(() => {
    setPhotos([]);
    setPage(1);
    setHasMore(true);
    loadPhotos(true);
    // eslint-disable-next-line
  }, [filter]);

  /* ---------- infinite scroll ---------- */
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasMore) {
          loadPhotos();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
    // eslint-disable-next-line
  }, [hasMore]);

  const filteredPhotos =
    filter === "Все" ? photos : photos.filter((img) => img.filter === filter);

  return (
    <section className={style.photo_section}>
      {/* ---------- селект ---------- */}
      <div className={style.selectWrapper}>
        {loadingFilters ? (
          <div className={style.selectSkeleton}>Загрузка фильтров...</div>
        ) : (
          <CustomSelect options={filters} value={filter} onChange={setFilter} />
        )}
      </div>

      {/* ---------- галерея ---------- */}
      <div className={style.gallery}>
        {filteredPhotos.map((img) => (
          <img
            key={img.id}
            src={img.fileUrl}
            alt={img.footer || img.filter || "Фото"}
            className={style.photo}
            loading="lazy"
            onClick={() =>
              setSelectedImage({
                src: img.fileUrl,
                footer: img.footer,
              })
            }
          />
        ))}

        {loading &&
          [...Array(12)].map((_, i) => (
            <div key={i} className={style.skeleton} />
          ))}

        {!loading && filteredPhotos.length === 0 && (
          <p className={style.noPhotos}>
            {filter === "Все"
              ? "Фотографии отсутствуют"
              : `Фотографий в категории "${filter}" не найдено`}
          </p>
        )}
      </div>

      {/* ---------- observer ---------- */}
      {hasMore && <div ref={loaderRef} className={style.loader} />}

      {/* ---------- модалка ---------- */}
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
