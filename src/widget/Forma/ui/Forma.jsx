import React, { useState, useEffect, useRef } from "react";
import styles from "./Forma.module.css";
import ApiService from "../../../shared/api/api";

const Forma = () => {
  const [form, setForm] = useState({
    fullNameKid: "",
    fullNameAdult: "",
    age: "",
    phone: "",
    city: "",
    message: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Выберите город");
  const dropdownRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const selectOption = (option) => {
    setForm({ ...form, city: option });
    setSelectedCity(option);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiService.postContact({ ...form });
      setForm({
        fullNameKid: "",
        fullNameAdult: "",
        age: "",
        phone: "",
        city: "",
        message: "",
      });
      setSelectedCity("Выберите город");
    } catch (err) {
      console.error("Ошибка отправки формы:", err);
      alert("Ошибка. Попробуйте позже.");
    }
  };

  return (
    <form className={styles.forma} onSubmit={handleSubmit}>
      <h1>Запишитесь на занятия уже сейчас!</h1>
      <input
        type="text"
        name="fullNameKid"
        value={form.fullNameKid}
        onChange={handleChange}
        placeholder="ФИО Родителя"
        required
      />
      <input
        type="text"
        name="fullNameAdult"
        value={form.fullNameAdult}
        onChange={handleChange}
        placeholder="ФИО Ребенка"
        required
      />
      <input
        type="number"
        name="age"
        value={form.age}
        onChange={handleChange}
        placeholder="Возраст ребенка"
        required
      />
      <input
        type="number"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Номер родителя"
        required
      />
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Ваш вопрос (не обязательно)"
        className={styles.textarea}
      />
      <div
        ref={dropdownRef}
        className={`${styles.dropdownWrapper} ${dropdownOpen ? styles.open : ""}`}
      >
        <button
          type="button"
          onClick={toggleDropdown}
          className={styles.dropdownButton}
        >
          {selectedCity}
        </button>
        <ul className={styles.dropdownList}>
          {["Шахавская", "Волоколамск"].map((option) => (
            <li
              key={option}
              onClick={() => selectOption(option)}
              className={styles.dropdownItem}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
      <button type="submit">Отправить</button>
    </form>
  );
};

export default Forma;
