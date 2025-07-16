import React, { useState, useEffect } from "react";
import { ParticleCanvas } from "./shared/ui/Canvas/ParticleCanvas";
import HeroSerction from "./widget/HeroSection/ui/HeroSerction";
import Biography from "./widget/Biography/ui/Biography";
import Slider from "./shared/ui/Slider/Slider";
import Contact from "./widget/Contact/ui/Contact";
import "./App.css";

import { fetchImg } from "./shared/api/fetchYandexDiskResources ";
import { fetchVideo } from "./shared/api/fetchYandexDiskResources ";

function App() {
  const [imgPath, setImgPath] = useState([]);
  const [videoPath, setVideoPath] = useState([]);

  useEffect(() => {
    // Загружаем изображения
    fetchImg().then((images) => {
      if (images) {
        setImgPath(images);
      }
    });
    // Загружаем видео
    fetchVideo().then((videos) => {
      if (videos) {
        setVideoPath(videos);
      }
    });
  }, []);

  console.log("ImgPath: ", imgPath);
  console.log("VideoPath: ", videoPath);

  return (
    <div className="app">
      <ParticleCanvas className="background" />

      <HeroSerction />

      <Biography />

      {imgPath.length > 0 && (
        <Slider media={imgPath} type="img" title="PERFORMANCES" />
      )}
      {videoPath.length > 0 && (
        <Slider media={videoPath} type="video" title="GALLERY" />
      )}

      <Contact />
    </div>
  );
}

export default App;
