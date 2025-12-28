import React, { useEffect, useState } from "react";
import styles from "./TeamsCarts.module.css";
import ApiService from "../../../shared/api/api";
import { useNavigate } from "react-router-dom";

const TeamsCarts = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

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

  const shouldShowMoreButton = (achievements) => {
    if (!achievements || achievements.length === 0) return false;

    const totalLength = achievements.join(" ").length;

    return achievements.length > 3 || totalLength > 150;
  };

  const openAchievementsModal = (team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  const closeAchievementsModal = () => {
    setShowModal(false);
    setSelectedTeam(null);
  };

  if (loading) {
    return <p className={styles.loading}>Загрузка команд...</p>;
  }

  if (!teams.length) {
    return <p className={styles.loading}>Команды пока отсутствуют</p>;
  }

  return (
    <>
      <div className={styles.container}>
        {teams.map((team) => (
          <div key={team.id} className={styles.card}>
            <div className={styles.left}>
              <div className={styles.imageContainer}>
                <div className={styles.nameOverlay}>
                  <h3 className={styles.teamName}>{team.name}</h3>
                </div>
                {team.fileUrl && (
                  <img
                    src={team.fileUrl}
                    alt={team.name}
                    className={styles.image}
                    loading="lazy"
                  />
                )}
              </div>
            </div>

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
                        <div className={styles.detailValue}>
                          {team.ageRange}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.detailsGrid}>
                  {team.instructors && (
                    <div className={styles.instructorsSection}>
                      <h4 className={styles.sectionTitle}>Преподаватели</h4>
                      <p className={styles.instructors}>{team.instructors}</p>
                    </div>
                  )}

                  <div className={styles.recruitingSection}>
                    <h4 className={styles.sectionTitle}>Набор: </h4>
                    <p
                      className={
                        team.isRecruiting
                          ? styles.statusOpen
                          : styles.statusClosed
                      }
                    >
                      {team.isRecruiting ? "открыт" : "закрыт"}
                    </p>
                  </div>
                </div>

                {team.achievements?.length > 0 && (
                  <div className={styles.achievementsSection}>
                    <h4 className={styles.sectionTitle}>Достижения</h4>
                    <ul className={styles.achievements}>
                      {team.achievements.slice(0, 3).map((a, i) => (
                        <li key={i} className={styles.achievementItem}>
                          <span className={styles.trophyIcon}>🏆</span>
                          <span className={styles.achievementText}>{a}</span>
                        </li>
                      ))}

                      {shouldShowMoreButton(team.achievements) && (
                        <li className={styles.detailsGrid}>
                          <button
                            className={styles.showMoreButton}
                            onClick={() => openAchievementsModal(team)}
                          >
                            <span className={styles.moreIcon}>🔽</span>
                            <span>
                              Посмотреть все ({team.achievements.length})
                            </span>
                          </button>

                          {team.isRecruiting ? (
                            <button
                              onClick={() => {
                                navigate("/");
                                setTimeout(() => {
                                  const element =
                                    document.getElementById("forma");
                                  if (element) {
                                    element.scrollIntoView({
                                      behavior: "smooth",
                                    });
                                  }
                                }, 500);
                              }}
                              className={styles.buttonRecord}
                            >
                              🎯 Записаться
                            </button>
                          ) : (
                            <div className={styles.closedMessage}>
                              Набор временно закрыт
                            </div>
                          )}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedTeam && (
        <div className={styles.modalOverlay} onClick={closeAchievementsModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                🏆 Достижения команды "{selectedTeam.name}"
              </h3>
              <button
                className={styles.modalClose}
                onClick={closeAchievementsModal}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <ul className={styles.modalAchievements}>
                {selectedTeam.achievements.map((achievement, index) => (
                  <li key={index} className={styles.modalAchievementItem}>
                    <div className={styles.achievementNumber}>{index + 1}</div>
                    <div className={styles.achievementText}>{achievement}</div>
                  </li>
                ))}
              </ul>

              <div className={styles.modalStats}>
                <span>
                  Всего достижений: {selectedTeam.achievements.length}
                </span>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalButton}
                onClick={closeAchievementsModal}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamsCarts;
