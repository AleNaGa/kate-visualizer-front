import React, { useEffect, useRef } from "react";

/**
 * GradientBackground
 *
 * Un componente que dibuja un fondo de pantalla
 * con un gradiente vertical con los colores dados.
 *
 * @param {{ colors: string[], style: object }} props
 * @property {string[]} colors - Un array de colores en formato hex
 * @property {object} style - Un objeto que contiene estilos CSS para el
 *                            canvas
 *
 * @returns {React.Component} Un componente que contiene un canvas
 *                            con el gradiente
 */
export default function GradientBackground({ colors = ["#1e3c72", "#2a5298"], style }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function drawGradient() {
      resize();
      // crear gradiente vertical
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      const step = 1 / (colors.length - 1);
      colors.forEach((color, i) => {
        gradient.addColorStop(i * step, color);
      });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function animate() {
      drawGradient();
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [colors]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
