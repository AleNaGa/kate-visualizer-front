import React, { useEffect, useRef } from "react";

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
