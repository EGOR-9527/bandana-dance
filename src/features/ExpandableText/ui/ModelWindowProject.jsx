import React from "react";
import style from "./ModelWindowProject.module.css";
import { observer } from "mobx-react-lite";

import { windowStore } from "../../../entities/model/windowStore";

const ModelWindowProject = observer(() => {
  console.log(windowStore.text);
  console.log(windowStore.open);

  if (windowStore.open) {
    return (
      <div className={style.background}>
        <div className={style.window}>
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
