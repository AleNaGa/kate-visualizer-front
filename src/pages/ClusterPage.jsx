import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import SceneInit from "../components/SceneInit";
import SphereMesh from "../components/SphereMesh";
import { useClusterData } from "../components/hooks/useClusterData";
import GradientBackground from "../components/GradientBackground";
import PodCard from "../components/PodCard";
import DeploymentsForm from "../components/DeploymentsForm";

function ClusterPage() {
  const data = useClusterData(10000);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasInitialized = useRef(false);
  const sceneInitRef = useRef(null);

  const radius = 7;
  const [colors, setColors] = useState([]);
  const [names, setNames] = useState([]);
  const [selectedPod, setSelectedPod] = useState(null);
  const [showDeployments, setShowDeployments] = useState(false);

  // Siempre actualizado con la última escena/cámara
  const handleClick = useCallback((event) => {
    if (!sceneInitRef.current || !sceneRef.current || !cameraRef.current) return;

    const canvasBounds = sceneInitRef.current.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1,
      -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

    let clicked = false;
    for (let i = 0; i < intersects.length; i++) {
      let obj = intersects[i].object;
      while (obj && !obj.userData?.onClick && obj.parent) {
        obj = obj.parent;
      }
      if (obj?.userData?.onClick) {
        obj.userData.onClick();
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      sceneInitRef.current.resetCamera();
      setSelectedPod(null);
    }
  }, []);

  // Solo inicializa la escena una vez
  useEffect(() => {
    if (data?.nodes && canvasRef.current && !canvasInitialized.current) {
      const sceneInit = new SceneInit(canvasRef.current);
      sceneInit.initialize();
      sceneInit.animate();
      sceneRef.current = sceneInit.scene;
      cameraRef.current = sceneInit.camera;
      sceneInitRef.current = sceneInit;
      canvasInitialized.current = true;

      return () => {
        sceneInit.renderer?.domElement?.removeEventListener("click", handleClick);
      };
    }
  }, [data, handleClick]);

  //limpia esferas viejas
  useEffect(() => {
    if (!sceneRef.current) return;

    sceneRef.current.children
      .filter(obj => obj.userData?.isPodSphere)
      .forEach(obj => sceneRef.current.remove(obj));
  }, [data]);

  //Actualiza nombres y colores
  useEffect(() => {
    if (!data?.nodes) return;

    const allPods = data.nodes.flatMap((node) => node.pods);
    const allNames = allPods.map((pod) => pod.name);
    setNames(allNames);
    const podColors = allPods.map((pod) => (pod.status === "Running" ? "lime" : "red"));
    setColors(podColors);
  }, [data]);

    
  useEffect(() => {
  if (!sceneInitRef.current || !sceneInitRef.current.renderer) return;

  const canvas = sceneInitRef.current.renderer.domElement;
  canvas.addEventListener("click", handleClick);

  return () => {
    canvas.removeEventListener("click", handleClick);
  };
}, [colors, names, handleClick]);

  if (!data?.nodes) return <div>Cargando datos...</div>;


  const allPods = data.nodes.flatMap((node) => node.pods);

  return (
    <>
      <GradientBackground colors={["#0f2027", "#203a43", "#2c5364"]} />
      <canvas id="webgl-canvas" ref={canvasRef} />

      {sceneRef.current && (
        <SphereMesh
          key="center-sphere"
          scene={sceneRef.current}
          color={"cyan"}
          position={[0, 0, 0]}
          label={"Manage Deployments"}
          onClick={() => {
            const bubblePos = new THREE.Vector3(0, 0, 0);
            const direction = sceneInitRef.current.camera.position.clone().sub(bubblePos).normalize();
            const targetPos = bubblePos.clone().add(direction.multiplyScalar(1.2));
            sceneInitRef.current.moveCameraTo(targetPos, bubblePos);
            setTimeout(() => setShowDeployments(true), 1500);
          }}
          
        />
      )}

      {sceneRef.current &&
        colors.map((color, idx) => {
          const angle = (2 * Math.PI) / colors.length * idx;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const position = [x, y, 0];
          const podData = allPods[idx];

          return (
            <SphereMesh
              key={names[idx]}
              scene={sceneRef.current}
              color={color}
              position={position}
              label={` ${names[idx]}`}
              onClick={() => {
                const bubblePos = new THREE.Vector3(...position);
                const direction = sceneInitRef.current.camera.position.clone().sub(bubblePos).normalize();
                const targetPos = bubblePos.clone().add(direction.multiplyScalar(1.2));
                sceneInitRef.current.moveCameraTo(targetPos, bubblePos);
                setTimeout(() => setSelectedPod(podData), 1500);
              }}
            />
          );
          
        })}
        

      {selectedPod && <PodCard pod={selectedPod} onClose={() => setSelectedPod(null)} />}

      {showDeployments && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => {
            setShowDeployments(false);
            sceneInitRef.current?.resetCamera();
          }}
        >
          <div
            className="relative max-w-3xl w-full px-6 text-white transition-opacity duration-500 ease-in-out drop-shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <DeploymentsForm data={data} />
          </div>
        </div>
      )}
    </>
  );
}

export default ClusterPage;
