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
          <img src={event.img} alt={event.name} className={style.image} />
        </div>
        {event.name === "New Solo" ? null : (
          <h3 className={style.name}>{event.name}</h3>
        )}
        <p className={style.xplanation}>нажмите чтобы перевернуть</p>
      </div>
      <div className={style.back}>
        <p className={style.description}>{event.description}</p>

        <div className={style.other}>
          <div className={style.date}>
            <div
              className={style.icon}
              style={{ backgroundColor: "#396ee0ff" }}
            >
              📅
            </div>
            <div className={style.text}>{event.date}</div>
          </div>

          {event.time ? (
            <div className={style.time}>
              <div
                className={style.icon}
                style={{ backgroundColor: "#49e763ff" }}
              >
                ⏰
              </div>
              <div className={style.text}>{event.time}</div>
            </div>
          ) : null}

          <div className={style.place}>
            <div className={style.icon} style={{ backgroundColor: "#e7499c" }}>
              📍
            </div>
            <div className={style.text}>{event.place}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
