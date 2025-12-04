import React, { useState, useEffect } from "react";
import style from "./Events.module.css";
import EventCard from "../../features/ExpandableText/ui/EventCard";
import EmptyEvent from "../../features/ExpandableText/ui/EmptyEvent";
import Title from "../../shared/ui/Title/Title";
import ApiService from "../../shared/api/api"; // ← твой api сервис

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await ApiService.getEvents();

        if (res?.success && Array.isArray(res.data)) {
          setEvents(res.data);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Ошибка загрузки событий:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className={style.events}>
        <Title text="EVENTS" />
        <div className={style.container}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={style.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={style.events}>
        <Title text="EVENTS" />
        <div className={style.container}>
          <EmptyEvent />
        </div>
      </div>
    );
  }

  return (
    <div className={style.events}>
      <Title text="EVENTS" />
      <div className={style.container}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsSection;
