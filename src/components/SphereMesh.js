import { useEffect } from "react";
import * as THREE from "three";

/**
 * Componente que renderiza una esfera con un material cristalino
 * y un texto encima. La esfera se puede cliquear y tiene una propiedad
 * userData.isPodSphere para eliminarla en la limpieza. Eso permite recargarlas cada 5 segundos para 
 * actualizar el estado y poder ver las burbujas de los pods reales. 
 *
 * @param {{scene: THREE.Scene, color: THREE.Color, position: [number, number, number], label: string, onClick: () => void}} props
 * @returns {null}
 */
export default function SphereMesh({ scene, color, position, label, onClick }) {
  useEffect(() => {
    const geometry = new THREE.SphereGeometry(1, 64, 64); // Tamaño burbujas
    // Material
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

    // Se crea la esfera
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(...position);
    sphere.userData.onClick = onClick;
    sphere.userData.isPodSphere = true; // Limpieza

    // Este método crea un sprite de texto encima de la esfera
    //primero se crea un canvas con el texto básico y se convierte en una textura, pero se mide
    //el texto y se crea un canvas con el tamaño adecuado. Esto permite que el sprite se adapte
    //a la longitud del texto
    const createTextSprite = (message) => {
      const fontSize = 15;
      const fontFamily = "Calibri";

      // Medir el ancho del texto
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.font = `${fontSize}px ${fontFamily}`;
      const textWidth = tempCtx.measureText(message).width;

      // Crear un canvas con el ancho adecuado
      const padding = 40;
      const canvasWidth = textWidth + padding;
      const canvasHeight = 64;

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const context = canvas.getContext("2d");

      // Dibujar el texto en el canvas
      context.font = `${fontSize}px ${fontFamily}`;
      context.fillStyle = "white";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(message, canvas.width / 2, canvas.height / 2);

      // Convertir el canvas en una textura
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.needsUpdate = true;

      // Crear el sprite
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.raycast = () => {};

      // Ajustar el tamañoo del sprite a un factorizador que se adapte a la pantalla que hemos creado anteriormente
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
