import React, { useState } from "react";
import styles from "./Biography.module.css";
import Title from "../../../shared/ui/Title/Title";
import RollerogramButton from "../../../shared/ui/Button/RollerogramButton";
import ExpandableText from "../../../features/ExpandableText/ui/ExpandableText";

const Biography = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className={styles.biographySection} id="biography">
      <Title text="BIOGRAPHY" />

      <div className={styles.contentContainer}>
        <div className={styles.imageBlock}>
          <h1>BANDANA</h1>
          <p>Professional Dancer</p>
        </div>

        <div className={styles.textBlock}>
          <div
            style={{ marginLeft: !isExpanded ? "6.8vw" : "10vw" }}
            className={styles.textWrapper}
          >
            <header className={styles.header}>
              <h1>МАРК АЛЕКСЕЕВИЧ ШЕКУНОВ</h1>
              <p>aka BANDANA</p>
            </header>

            <p className={styles.shortBio}>
              Марк Алексеевич Шекунов, более известный в танцевальных кругах как{" "}
              <span className={styles.highlight}>BANDANA</span>, – яркий
              представитель современной российской танцевальной сцены.
            </p>

            <p className={styles.shortBio}>
              Его биография – это история неустанного труда, страсти к движению
              и стремления к совершенству.
            </p>

            <ExpandableText open={isExpanded} />

            <RollerogramButton
              onClick={() => setIsExpanded((prev) => !prev)}
              text={isExpanded ? "СВЕРНУТЬ" : "ЧИТАТЬ ПОЛНОСТЬЮ"}
              className={isExpanded ? "collapseButton" : "expandButton"}
            />

            <footer className={styles.footer}>
              <div className={styles.footerLine}></div>
              <p>PROFESSIONAL DANCER & CHOREOGRAPHER</p>
              <div className={styles.footerLine}></div>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Biography;
