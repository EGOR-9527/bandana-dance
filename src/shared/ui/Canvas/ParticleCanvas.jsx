import React, { useRef } from "react";
import { useParticles } from "../../../features/hooks/useParticles";
import style from "./ParticleCanvas.module.css";

export const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useParticles(canvasRef);

  return <canvas ref={canvasRef} className={style.background} />;
};
