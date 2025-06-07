import { useEffect } from "react";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { PMREMGenerator } from "three";

/**
 * Proveedor de entorno para la escena 3D.
 * 
 * Recibe el renderizador y la escena como props y se encarga de cargar el entorno
 * de reflexi n (BGReflection.exr) y asignarlo a la escena.
 * 
 * Lanza el evento onLoad cuando el entorno est  listo.
 * @param {{ renderer: THREE.WebGLRenderer, scene: THREE.Scene, onLoad?: (envMap: THREE.Texture) => void }}
 * @returns {JSX.Element} No renderiza nada.
 */
export default function EnvironmentProvider({ renderer, scene, onLoad }) {
  useEffect(() => {
    if (!renderer || !scene) return;

    const exrLoader = new EXRLoader();
    const pmremGenerator = new PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    exrLoader.load("/textures/BGReflection.exr", (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = envMap;

      texture.dispose();
      pmremGenerator.dispose();

      if (onLoad) onLoad(envMap);
    });
  }, [renderer, scene, onLoad]);

  return null;
}
