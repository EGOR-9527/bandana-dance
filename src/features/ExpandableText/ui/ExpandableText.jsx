import React from "react";
import styles from "./ExpandableText.module.css";

const ExpandableText = ({ open }) => {
  return (
    <div
      className={`${styles.expandableText} ${
        !open ? styles.hidden : styles.visible
      }`}
    >
      <p>
        Начав свой путь в танце в возрасте восьми лет, Марк быстро проявил
        трудолюбие. Первые шаги в хореографии были очень трудные, но упорные
        тренировки и постоянное самосовершенствование позволили ему выйти на
        новый уровень.
      </p>
      <p>
        BANDANA стал участником крупных чемпионатов России, таких как{" "}
        <span className={styles.highlight}>"Project 818"</span>,{" "}
        <span className={styles.highlight}>"Moving star"</span>,{" "}
        <span className={styles.highlight}>"Город танцует в парках"</span>. Марк
        не ограничивается одним танцевальным направлением, он постоянно
        экспериментирует, смешивая различные стили и создавая свой неповторимый
        почерк.
      </p>
      <p>
        С <span className={styles.accent}>2023 года</span> Марк преподает танцы
        в <span className={styles.highlight}>"Funky Style Dance School"</span>.
        И его ученики уже становятся призерами чемпионатов России.
      </p>
      <p>
        С <span className={styles.accent}>2024 года</span> Марк становится
        хореографом команды
        <span className={styles.highlight}>"ВотТакМогу"</span> из города
        Волоколамска. Коллектив регулярно выходит на сцену в своем городском
        округе, а также принимает участие в муниципальных конкурсах.
      </p>
    </div>
  );
};

export default ExpandableText;
