import { useEffect } from "react";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { PMREMGenerator } from "three";

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
