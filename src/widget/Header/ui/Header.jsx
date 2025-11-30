import React from "react";
import style from "./Header.module.css";
import { useNavigate } from "react-router-dom";

const Header = ({text, link}) => {
  const navigate = useNavigate();

  return (
    <div className={style.header}>
      <p onClick={() => navigate(link)} className={style.link}>
        {text}
      </p>
    </div>
  );
};

export default Header;
