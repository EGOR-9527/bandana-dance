import React from "react";
import styles from "./ExpandableText.module.css";
import { observer } from "mobx-react-lite";

import { windowStore } from "../../../entities/model/windowStore";

import { project } from "../../../entities/project";

const ExpandableText = observer(({ open }) => {
  const handleWindow = (text) => {
    windowStore.setTextWindow(text);
    windowStore.setOpenWindow(!windowStore.open);
  };

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
        <span
          className={styles.highlight}
          onClick={() => handleWindow(project.Project_818)}
        >
          "Project 818"
        </span>
        ,{" "}
        <span
          className={styles.highlight}
          onClick={() => handleWindow(project.Moving_star)}
        >
          "Moving star"
        </span>
        ,{" "}
        <span
          className={styles.highlight}
          onClick={() => handleWindow(project.The_city_is_dancing_in_the_parks)}
        >
          "Город танцует в парках"
        </span>
        . Марк не ограничивается одним танцевальным направлением, он постоянно
        экспериментирует, смешивая различные стили и создавая свой неповторимый
        почерк.
      </p>
      <p>
        С <span className={styles.accent}>2023 года</span> Марк преподает танцы
        в <span className={styles.xyi}>"Funky Style Dance School"</span>.
        И его ученики уже становятся призерами чемпионатов России.
      </p>
      <p>
        С <span className={styles.accent}>2024 года</span> Марк становится
        хореографом команды{" "}
        <span
          className={styles.highlight}
          onClick={() => handleWindow(project.Thats_How_I_Can)}
        >
          "ВотТакМогу"
        </span>{" "}
        из города Волоколамска. Коллектив регулярно выходит на сцену в своем
        городском округе, а также принимает участие в муниципальных конкурсах.
      </p>
    </div>
  );
});

export default ExpandableText;
