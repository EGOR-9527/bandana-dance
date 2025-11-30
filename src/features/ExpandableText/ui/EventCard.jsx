import React, { useState } from "react";
import style from "./EventCard.module.css";

const EventCard = ({ event }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`${style.card} ${flipped ? style.flipped : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className={style.front}>
        <div className={style.imageWrapper}>
          <img
            src={event.fileUrl}
            alt={event.description || "Событие"}
            className={style.image}
            loading="lazy"
          />
        </div>

        <p className={style.xplanation}>
          нажмите, чтобы перевернуть
        </p>
      </div>

      <div className={style.back}>
        <p className={style.description}>
          {event.description || "Без описания"}
        </p>

        <div className={style.other}>
          <div className={style.date}>
            <div className={style.icon} style={{ backgroundColor: "#396ee0ff" }}>
              Дата
            </div>
            <div className={style.text}>{event.date}</div>
          </div>

          {event.place ? (
            <div className={style.place}>
              <div className={style.icon} style={{ backgroundColor: "#e7499c" }}>
                Место
              </div>
              <div className={style.text}>{event.place}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EventCard;