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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  // Подгружаем фильтры один раз
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

  // Подгружаем фото
  const loadPhotos = useCallback(
    async (reset = false) => {
      if (!hasMore && !reset) return;
      try {
        setLoading(true);
        const currentPage = reset ? 1 : page;
        const galleryRes = await ApiService.getGallery({ page: currentPage, limit: 12 });
        if (galleryRes.success) {
          setPhotos((prev) =>
            reset ? galleryRes.data : [...prev, ...galleryRes.data]
          );
          setHasMore(galleryRes.hasMore);
          if (!reset) setPage((prev) => prev + 1);
          else setPage(2);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [page, hasMore]
  );

  // Сбрасываем страницу при смене фильтра
  useEffect(() => {
    loadPhotos(true);
  }, [filter, loadPhotos]);

  // Sentinel для ленивой подгрузки
  const sentinelRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadPhotos();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadPhotos]
  );

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

        {loading && [...Array(12)].map((_, i) => <div key={i} />)}

        {!loading && filteredPhotos.length === 0 && (
          <p className={style.noPhotos}>
            {filter === "Все"
              ? "Фотографии отсутствуют"
              : `Фотографий в категории "${filter}" не найдено`}
          </p>
        )}

        {/* Sentinel для lazy load */}
        <div ref={sentinelRef}></div>
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
