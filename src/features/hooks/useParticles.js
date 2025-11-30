import { useEffect, useRef, useState } from "react";

export function useParticles(canvasRef) {
  const [particles, setParticles] = useState([]);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const mouseRef = useRef({ x: 0, y: 0 });

  const padding = 0;
  const baseDensity = 0.00025;

  const createParticle = () => ({
    id: Date.now() + Math.random(),
    x: padding + Math.random() * (canvasSize.width - padding * 2),
    y: padding + Math.random() * (canvasSize.height - padding * 2),
    size: Math.random() * 10 + 2,
    color: "#8b5cf6",
    rotation: Math.random() * Math.PI * 2,
    alpha: 1,
    life: Math.random() * 5000,
    vx: Math.random() * 2 - 1,
    vy: Math.random() * 2 - 1,
  });

  // resize handler
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // инициализация частиц
  useEffect(() => {
    const maxParticles = Math.floor(
      canvasSize.width * canvasSize.height * baseDensity
    );

    const initialParticles = Array.from(
      { length: maxParticles },
      createParticle
    );
    setParticles(initialParticles);
  }, [canvasSize]);

  // мышь
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // логика частиц
  useEffect(() => {
    const interval = setInterval(() => {
      const { x: mouseX, y: mouseY } = mouseRef.current;

      const maxParticles = Math.floor(
        canvasSize.width * canvasSize.height * baseDensity
      );

      setParticles((prev) => {
        const updated = prev
          .map((p) => {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const influenceRadius = 150;
            if (dist < influenceRadius && dist > 0) {
              const force = (1 - dist / influenceRadius) * 0.8;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              p.vx += fx;
              p.vy += fy;
            }

            return {
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              life: p.life - 16,
              vx: p.vx * 0.98,
              vy: p.vy * 0.98,
            };
          })
          .filter(
            (p) =>
              p.life > 0 &&
              p.x + p.size > 0 &&
              p.x < canvasSize.width &&
              p.y + p.size > 0 &&
              p.y < canvasSize.height
          );

        const newParticles = [];
        while (updated.length + newParticles.length < maxParticles) {
          newParticles.push(createParticle());
        }

        return [...updated, ...newParticles];
      });
    }, 16);

    return () => clearInterval(interval);
  }, [canvasSize]);

  // отрисовка
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    const maxDistance = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDistance) {
          const alpha = 1 - dist / maxDistance;
          ctx.beginPath();
          ctx.moveTo(a.x + a.size / 2, a.y + a.size / 2);
          ctx.lineTo(b.x + b.size / 2, b.y + b.size / 2);
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha.toFixed(2)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      ctx.save();
      ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha * (p.life / 1000);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });
  }, [particles, canvasSize]);

  return { particles };
}
