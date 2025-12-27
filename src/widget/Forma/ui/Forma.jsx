import React, { useState, useEffect, useRef } from "react";
import styles from "./Forma.module.css";

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

  const handelChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const selectOption = (option) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Форма отправлена:", form);
  };

  return (
    <form className={styles.forma} onSubmit={handleSubmit}>
      <input
        type="text"
        name="fullNameKid"
        value={form.fullNameKid}
        onChange={handelChange}
        placeholder="ФИО Родителя"
        required
      />
      <input
        type="text"
        name="fullNameAdult"
        value={form.fullNameAdult}
        onChange={handelChange}
        placeholder="ФИО Ребенка"
        required
      />
      <input
        type="number"
        name="age"
        value={form.age}
        onChange={handelChange}
        placeholder="Возраст ребенка"
        required
      />

      <input
        type="number"
        name="phone"
        value={form.phone}
        onChange={handelChange}
        placeholder="Номер родителя"
        required
      />

      <textarea
        name="message"
        value={form.message}
        onChange={handelChange}
        placeholder="Ваш вопрос (не обязательно)"
        className={styles.textarea}
      />

      <div
        ref={dropdownRef}
        className={`${styles.dropdownWrapper} ${
          dropdownOpen ? styles.open : ""
        }`}
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
