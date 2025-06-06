import { useEffect } from "react";
import * as THREE from "three";

export default function SphereMesh({ scene, color, position, label, onClick }) {
  useEffect(() => {
    const geometry = new THREE.SphereGeometry(1, 64, 64); // Tamaño burbujas
    const material = new THREE.MeshPhysicalMaterial({
      color,
      transparent: true,
      opacity: 0.8,
      roughness: 0.1,
      metalness: 0.3,
      transmission: 1.0,
      thickness: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(...position);
    sphere.userData.onClick = onClick;
    sphere.userData.isPodSphere = true; // Limpieza

    // Texto
    const createTextSprite = (message) => {
      const fontSize = 15;
      const fontFamily = "Calibri";

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.font = `${fontSize}px ${fontFamily}`;
      const textWidth = tempCtx.measureText(message).width;

      const padding = 40;
      const canvasWidth = textWidth + padding;
      const canvasHeight = 64;

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const context = canvas.getContext("2d");

      context.font = `${fontSize}px ${fontFamily}`;
      context.fillStyle = "white";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(message, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.needsUpdate = true;

      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.raycast = () => {};

      const scaleFactor = 0.03;
      sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);
      sprite.position.set(0, 1.5, 0);

      return { sprite, texture, material: spriteMaterial };
    };

    const { sprite, texture: labelTexture, material: labelMaterial } = createTextSprite(label || "Bubble");

    sphere.add(sprite);
    scene.add(sphere);

    return () => {
      // Limpieza a fondo
      sphere.remove(sprite);
      scene.remove(sphere);

      geometry.dispose();
      material.dispose();
      labelTexture.dispose();
      labelMaterial.dispose();
    };
  }, [scene, color, position, label, onClick]);

  return null;
}
