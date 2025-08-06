import { makeAutoObservable } from "mobx";

class WindowStore {
  open = false;
  text = null;

  constructor() {
    makeAutoObservable(this);
  }

  setOpenWindow(statusOpen) {
    this.open = statusOpen;
  }

  setTextWindow(newText) {
    this.text = newText;
  }
}

export const windowStore = new WindowStore();
