import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./TeamsCarts.module.css";
import ApiService from "../../../shared/api/api";
import { useNavigate } from "react-router-dom";

const TeamsCarts = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const navigate = useNavigate();
  const observerRef = useRef(null);

  // Инициализация ленивой загрузки изображений
  const initLazyLoading = useCallback(() => {
    if (!observerRef.current && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            const thumbnail = img.dataset.thumbnail;
            
            // Показываем thumbnail сразу
            if (thumbnail && !img.src) {
              img.src = thumbnail;
              img.classList.add(styles.thumbnailLoaded);
            }
            
            // Загружаем полноразмерное изображение в фоне
            if (src && !loadedImages.has(src)) {
              const fullImage = new Image();
              fullImage.src = src;
              fullImage.onload = () => {
                img.src = src;
                img.classList.add(styles.fullLoaded);
                setLoadedImages(prev => new Set([...prev, src]));
              };
            }
            
            observerRef.current.unobserve(img);
          }
        });
      }, {
        rootMargin: '100px',
        threshold: 0.1
      });
    }
  }, [loadedImages]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await ApiService.getTeams();
        
        if (res?.success) {
          if (res.stale) {
            setTeams(res.data);
            
            // Фоновая загрузка свежих данных
            setTimeout(async () => {
              const freshRes = await ApiService.getTeams();
              if (freshRes.success && !freshRes.stale) {
                setTeams(freshRes.data);
              }
            }, 1000);
          } else {
            setTeams(res.data);
          }
        } else {
          setTeams([]);
          setError("Не удалось загрузить команды");
        }
      } catch (e) {
        console.error("Ошибка загрузки команд", e);
        setError("Ошибка соединения с сервером");
        setTeams([]);
      } finally {
        setLoading(false);
        
        // Инициализируем ленивую загрузку
        setTimeout(() => {
          initLazyLoading();
          if (observerRef.current) {
            document.querySelectorAll(`.${styles.lazyImage}`).forEach(img => {
              observerRef.current.observe(img);
            });
          }
        }, 100);
      }
    };

    fetchTeams();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [initLazyLoading]);

  const shouldShowMoreButton = (achievements) => {
    if (!achievements || achievements.length === 0) return false;
    return achievements.length > 3 || JSON.stringify(achievements).length > 200;
  };

  const openAchievementsModal = (team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  const closeAchievementsModal = useCallback(() => {
    setShowModal(false);
    setTimeout(() => setSelectedTeam(null), 300);
  }, []);

  // Скелетон-заглушки
  const renderSkeletons = () => {
    return [1, 2].map((i) => (
      <div key={i} className={styles.skeletonCard}>
        <div className={styles.skeletonImageContainer}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonName} />
        </div>
        <div className={styles.skeletonContent}>
          <div className={styles.skeletonText} />
          <div className={styles.skeletonTextShort} />
          <div className={styles.skeletonTextMedium} />
          <div className={styles.skeletonButton} />
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        {renderSkeletons()}
      </div>
    );
  }

  if (error && teams.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!teams.length) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyMessage}>Команды пока отсутствуют</p>
        <p className={styles.emptySubtitle}>Скоро здесь появятся новые команды</p>
      </div>
    );
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
                    data-src={team.fileUrl}
                    data-thumbnail={team.thumbnailUrl || team.fileUrl}
                    alt={team.name}
                    className={`${styles.image} ${styles.lazyImage}`}
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
                        <li className={styles.achievementActions}>
                          <button
                            className={styles.showMoreButton}
                            onClick={() => openAchievementsModal(team)}
                            aria-label={`Показать все достижения команды ${team.name}`}
                          >
                            <span className={styles.moreIcon}>🔽</span>
                            <span>
                              Посмотреть все ({team.achievements.length})
                            </span>
                          </button>

                          {team.isRecruiting && (
                            <button
                              onClick={() => {
                                navigate("/");
                                setTimeout(() => {
                                  const element = document.getElementById("forma");
                                  if (element) {
                                    element.scrollIntoView({
                                      behavior: "smooth",
                                      block: "start"
                                    });
                                  }
                                }, 100);
                              }}
                              className={styles.buttonRecord}
                            >
                              Записаться
                            </button>
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
        <div 
          className={`${styles.modalOverlay} ${showModal ? styles.modalShow : ''}`}
          onClick={closeAchievementsModal}
        >
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
                aria-label="Закрыть"
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
                <span className={styles.statsItem}>
                  Всего достижений: <strong>{selectedTeam.achievements.length}</strong>
                </span>
                {selectedTeam.city && (
                  <span className={styles.statsItem}>
                    Город: <strong>{selectedTeam.city}</strong>
                  </span>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalButton}
                onClick={closeAchievementsModal}
              >
                Закрыть
              </button>
              {selectedTeam.isRecruiting && (
                <button
                  className={styles.modalButtonPrimary}
                  onClick={() => {
                    closeAchievementsModal();
                    navigate("/");
                    setTimeout(() => {
                      const element = document.getElementById("forma");
                      if (element) {
                        element.scrollIntoView({
                          behavior: "smooth",
                          block: "start"
                        });
                      }
                    }, 300);
                  }}
                >
                  Записаться в команду
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {teams.length > 0 && (
        <div className={styles.cacheInfo}>
          <small>Данные кэшированы • Обновляются каждые 10 минут</small>
        </div>
      )}
    </>
  );
};

export default TeamsCarts;