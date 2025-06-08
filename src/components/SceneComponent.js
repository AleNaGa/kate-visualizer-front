import { useEffect, useRef, useState } from "react";
import SceneInit from "./SceneInit";
//NO se usa
const SceneComponent = ({ canvasID = "webgl-canvas", onSceneReady }) => {
  const sceneInitRef = useRef(null);
  const [ setScene] = useState(null);

  useEffect(() => {
    const sceneInit = new SceneInit(canvasID);
    sceneInitRef.current = sceneInit;
    sceneInit.initialize();
    sceneInit.animate();
    setScene(sceneInit.scene);

    if (onSceneReady) onSceneReady(sceneInit.scene);


    return () => {
      if (sceneInit.renderer) {
        sceneInit.renderer.dispose?.();
        sceneInit.renderer.forceContextLoss?.();
        sceneInit.renderer.domElement = null;
        sceneInit.renderer = null;
      }

      // Eliminar stats
      const statsEl = document.body.querySelector(".stats");
      if (statsEl) statsEl.remove();

      window.removeEventListener("resize", sceneInit.onWindowResize);
    };
  }, [canvasID]);

  return <canvas id={canvasID} />;
};

export default SceneComponent;
