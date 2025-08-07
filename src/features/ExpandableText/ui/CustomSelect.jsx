import React, { useState, useEffect, useRef } from "react";
import styles from "./CustomSelect.module.css";

const CustomSelect = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.select} onClick={() => setOpen(!open)}>
        {value}
        <span className={styles.arrow}>▼</span>
      </div>
      {open && (
        <ul className={styles.dropdown}>
          {options.map((opt) => (
            <li
              key={opt}
              className={`${styles.option} ${opt === value ? styles.active : ""}`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
