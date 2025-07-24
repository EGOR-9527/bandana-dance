import React from "react";
import style from "./Events.module.css";
import EventCard from "../../features/ExpandableText/ui/EventCard";
import Title from "../../shared/ui/Title/Title";
import { Events } from "../../entities/Events";
import EmptyEvent from "../../features/ExpandableText/ui/EmptyEvent";

const EventsSection = () => {
  return (
    <div
      style={{ display: Events != null ? "block" : "none" }}
      className={style.events}
    >
      <Title text="EVENTS" />
      <div className={style.container}>
        {Events.map((event, idx) => (
          <EventCard key={idx} event={event} />
        ))}

        <EmptyEvent />
      </div>
    </div>
  );
};

export default EventsSection;
