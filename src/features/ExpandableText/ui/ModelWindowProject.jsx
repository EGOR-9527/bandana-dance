import React, { useEffect, useState } from "react";
import style from "./ModelWindowProject.module.css";
import { observer } from "mobx-react-lite";

import { windowStore } from "../../../entities/model/windowStore";

const ModelWindowProject = observer(() => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (windowStore.open) {
      setTimeout(() => {
        setOpacity(1);
      }, 500);
    } else {
      setOpacity(0);
    }
  }, [windowStore.open]);

  if (windowStore.open) {
    return (
      <div className={style.background}>
        <div
          style={{ opacity: opacity, transition: "all 1s" }}
          className={style.window}
        >
          <header className={style.header_window}>
            <button
              className={style.crest}
              onClick={() => windowStore.setOpenWindow(false)}
            >
              ✕
            </button>
          </header>
          <p>{windowStore.text}</p>
        </div>
      </div>
    );
  } else {
    return null;
  }
});

export default ModelWindowProject;
