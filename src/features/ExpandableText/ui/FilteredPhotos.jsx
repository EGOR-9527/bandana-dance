import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadingFilters(true);

        const [galleryRes, filtersRes] = await Promise.all([
          ApiService.getGallery(),
          ApiService.getGalleryFilters(),
        ]);

        if (galleryRes.success) {
          setPhotos(galleryRes.data);
        }

        if (filtersRes.success) {
          setFilters(filtersRes.data);
        
          setFilter((prev) => (filtersRes.data.includes(prev) ? prev : "Все"));
        }
      } catch (err) {
        console.error("Ошибка загрузки данных галереи:", err);
      } finally {
        setLoading(false);
        setLoadingFilters(false);
      }
    };

    loadData();
  }, []);


  const filteredPhotos =
    filter === "Все" ? photos : photos.filter((img) => img.filter === filter);

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
        {loading ? (
          [...Array(12)].map((_, i) => (
            <div key={i} className={style.skeleton} />
          ))
        ) : filteredPhotos.length === 0 ? (
          <p className={style.noPhotos}>
            {filter === "Все"
              ? "Фотографии отсутствуют"
              : `Фотографий в категории "${filter}" не найдено`}
          </p>
        ) : (
          filteredPhotos.map((img) => (
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
          ))
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
