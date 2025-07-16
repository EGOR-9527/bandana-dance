import React from "react";
import Title from "../../../shared/ui/Title/Title";
import style from "./Contact.module.css";
import RollerogramButton from "../../../shared/ui/Button/RollerogramButton";

import tg from "../../../shared/svg/tg.svg";
import vk from "../../../shared/svg/vk.svg";
import bot from "../../../shared/svg/bot.svg";

const Contact = () => {
  return (
    <div className={style.contact}>
      <Title text="CONTACT" />

      <div className={style.buttons}>
        <RollerogramButton className="telegram" text="TELEGRAM" svg={tg} />
        <RollerogramButton className="vk" text="VKONTACTE" svg={vk} />
        <RollerogramButton className="bot" text="TELEGRAM BOT" svg={bot} />
      </div>
    </div>
  );
};

export default Contact;
