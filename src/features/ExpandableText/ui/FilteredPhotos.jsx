import React, { useState } from "react";
import style from "./FilteredPhotos.module.css";
import { imgGallery } from "../../../entities/imgGallery";
import CustomSelect from "./CustomSelect";

const categories = ["Все", "Чемпионаты", "Концерты", "Сбороы"];

const FilteredPhotos = () => {
  const [filter, setFilter] = useState("Все");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredPhotos =
    filter === "Все"
      ? imgGallery
      : imgGallery.filter((img) => img.filter === filter);

  return (
    <section className={style.photo_section}>
      <div className={style.selectWrapper}>
        <CustomSelect options={categories} value={filter} onChange={setFilter} />
      </div>

      <div className={style.gallery}>
        {filteredPhotos.map((img, index) => (
          <img
            key={index}
            src={img.photo}
            alt={img.filter}
            className={style.photo}
            onClick={() => setSelectedImage(img.photo)}
          />
        ))}
      </div>

      {selectedImage && (
        <div className={style.modalOverlay} onClick={() => setSelectedImage(null)}>
          <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Modal" className={style.modalImage} />
            <button className={style.closeButton} onClick={() => setSelectedImage(null)}>×</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default FilteredPhotos;
