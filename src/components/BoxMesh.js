import { useEffect } from "react";
import * as THREE from "three";


const BoxMesh = ({ scene, color = "blue" }) => {
      useEffect(() => {
    if (!scene) return;
    // Añadir cubo a la escena
    const geometry = new THREE.BoxGeometry(16, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    return () => { // Limpieza
      scene.remove(mesh);
    geometry.dispose();
      material.dispose();

    };



      }
    );

  return null;
};

export default BoxMesh;
