import React from "react";
import style from "./Header.module.css";
import { useNavigate } from "react-router-dom";

const Header = ({ text }) => {
  const navigate = useNavigate();

  return (
    <div className={style.header}>
      {text.map((t, index) => (
        <p
          key={index}
          onClick={() => navigate(t.link)}
          className={style.link}
        >
          {t.page}
        </p>
      ))}
    </div>
  );
};

export default Header;
