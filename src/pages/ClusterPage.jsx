import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import SceneInit from "../components/SceneInit";
import SphereMesh from "../components/SphereMesh";
import { useClusterData } from "../components/hooks/useClusterData";
import GradientBackground from "../components/GradientBackground";
import PodCard from "../components/PodCard";
import DeploymentsForm from "../components/DeploymentsForm";
import { useNavigate } from "react-router-dom";

/**
 * Página principal del Cluster Visualizer.
 *
 * Muestra una visualización 3D de los nodos del cluster, con esferas que
 * representan los pods. Cada esfera tiene un color y un label que indica el
 * nombre del pod.
 *
 * Al hacer clic en una esfera, se muestra una tarjeta con información del pod
 * correspondiente. Si se hace clic en la esfera central, se muestra un formulario
 * para crear despliegues.
 *
 * @returns {JSX.Element} El JSX para la página principal del Cluster Visualizer.
 */
function ClusterPage() {
  // Obtener el estado del cluster cada 5 segundos
  const data = useClusterData(5000);

  // Navegación
  const navigate = useNavigate();

  // Referencias para la escena y la cámara
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  // Referencia para el canvas
  const canvasRef = useRef(null);
  const canvasInitialized = useRef(false);
  // Referencia para la escena
  const sceneInitRef = useRef(null);

  // Configuración de la escena, primero el fondo y luego las esferas
  const radius = 7;
  const [colors, setColors] = useState([]);
  const [names, setNames] = useState([]);
  const [selectedPod, setSelectedPod] = useState(null);
  const [showDeployments, setShowDeployments] = useState(false);

  // Siempre actualizado con la última escena/cámara
  const handleClick = useCallback((event) => {
    if (!sceneInitRef.current || !sceneRef.current || !cameraRef.current) return;

    // Calcular la posición del ratón en la escena para el raycaster y que no haga collide con objetos no relevantes
    const canvasBounds = sceneInitRef.current.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1,
      -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

    // Verificar si se hizo clic en una esfera
    let clicked = false;
    for (let i = 0; i < intersects.length; i++) {
      let obj = intersects[i].object;
      while (obj && !obj.userData?.onClick && obj.parent) {
        obj = obj.parent;
      }
      // Si se hizo clic en una esfera
      if (obj?.userData?.onClick) {
        obj.userData.onClick();
        clicked = true;
        break;
      }
    }

    // Si no se hizo clic en una esfera, resetear la cámara y quitar la tarjeta
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

    
  // Actualiza las esferas con los nuevos nombres y colores
  useEffect(() => {
  if (!sceneInitRef.current || !sceneInitRef.current.renderer) return;

  const canvas = sceneInitRef.current.renderer.domElement;
  canvas.addEventListener("click", handleClick);

  return () => {
    // Limpia el canvas del evento de clic
    canvas.removeEventListener("click", handleClick);
  };
}, [colors, names, handleClick]);

  // Muestra un mensaje de carga mientras se cargan los datos, ACTUALIZAR CON ANIMACIÓN
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
          // Calcular la posición de la esfera en base al radio que hemos especificado. 
          // La fórmula es: x = r * cos(θ), y = r * sin(θ) donde θ es el ángulo en radianes.
          // Significa que cada esfera estara en un angulo diferente, de 0 a 360 grados
          // dependiendo de la cantidad de esferas que hay y el radio que hemos especificado
          // las esferas se ubicaran en un circulo y las distancias entre ellas seran iguales
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
   
        <button
         onClick={() => {
              localStorage.clear(); // Limpiar el almacenamiento local para cerrar la sesión
              navigate(-1);         // Redirigir a la página anterior
            }}
          className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-b from-gray-500 to-gray-100 border-0 hover:scale-105 text-white font-bold rounded z-30"
        >
          Volver
        </button>

    </>
  );
}

export default ClusterPage;
