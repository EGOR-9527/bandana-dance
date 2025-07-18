import React from "react";
import Title from "../../../shared/ui/Title/Title";
import style from "./Contact.module.css";
import RollerogramButton from "../../../shared/ui/Button/RollerogramButton";

import tg from "../../../shared/svg/tg.svg";
import vk from "../../../shared/svg/vk.svg";

const Contact = () => {
  return (
    <div className={style.contact}>
      <Title text="CONTACT" />

      <div className={style.buttons}>
        <RollerogramButton
          onClick={() => window.open("https://t.me/dancerinbandana", "_blank")}
          className="telegram"
          text="TELEGRAM CHANNEL"
          svg={tg}
        />
        <RollerogramButton
          onClick={() => window.open("https://vk.com/dancer_bandana", "_blank")}
          className="vk"
          text="VKONTACTE"
          svg={vk}
        />
        <RollerogramButton
          onClick={() => window.open("https://vk.com/fsdschool", "_blank")}
          className="bot"
          text="COMMUNITY VK"
          svg={vk}
        />
      </div>
    </div>
  );
};

export default Contact;
