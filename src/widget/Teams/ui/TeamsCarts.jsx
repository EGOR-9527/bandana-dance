import React, { useEffect, useState } from "react";
import styles from "./TeamsCarts.module.css";
import ApiService from "../../../shared/api/api";

const TeamsCarts = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await ApiService.getTeams();
        if (res?.success) setTeams(res.data);
      } catch (e) {
        console.error("Ошибка загрузки команд", e);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Загрузка команд...</p>;
  }

  if (!teams.length) {
    return <p className={styles.loading}>Команды пока отсутствуют</p>;
  }

  return (
    <div className={styles.container}>
      {teams.map((team) => (
        <div key={team.id} className={styles.card}>
          {/* ───── ЛЕВЫЙ БЛОК: ТОЛЬКО ФОТО И НАЗВАНИЕ ───── */}
          <div className={styles.left}>
            <div className={styles.imageContainer}>
              {team.fileUrl && (
                <img
                  src={team.fileUrl}
                  alt={team.name}
                  className={styles.image}
                  loading="lazy"
                />
              )}
              <div className={styles.nameOverlay}>
                <h3 className={styles.teamName}>{team.name}</h3>
              </div>
            </div>
          </div>

          {/* ───── ПРАВЫЙ БЛОК: ТОЛЬКО ИНФОРМАЦИЯ ───── */}
          <div className={styles.right}>
            <div className={styles.infoContainer}>
              {team.description && (
                <div className={styles.descriptionSection}>
                  <h4 className={styles.sectionTitle}>Описание</h4>
                  <p className={styles.description}>{team.description}</p>
                </div>
              )}

              <div className={styles.detailsGrid}>
                {team.city && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>🏙</span>
                    <div>
                      <div className={styles.detailLabel}>Город</div>
                      <div className={styles.detailValue}>{team.city}</div>
                    </div>
                  </div>
                )}

                {team.ageRange && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>🎂</span>
                    <div>
                      <div className={styles.detailLabel}>Возраст</div>
                      <div className={styles.detailValue}>{team.ageRange}</div>
                    </div>
                  </div>
                )}
              </div>

              {team.instructors && (
                <div className={styles.instructorsSection}>
                  <h4 className={styles.sectionTitle}>Преподаватели</h4>
                  <p className={styles.instructors}>{team.instructors}</p>
                </div>
              )}

              {team.achievements?.length > 0 && (
                <div className={styles.achievementsSection}>
                  <h4 className={styles.sectionTitle}>Достижения</h4>
                  <ul className={styles.achievements}>
                    {team.achievements.map((a, i) => (
                      <li key={i} className={styles.achievementItem}>
                        <span className={styles.trophyIcon}>🏆</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamsCarts;