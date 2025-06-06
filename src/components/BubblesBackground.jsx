import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { PMREMGenerator } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

export default function BubblesBackground() {
  
  const mountRef = useRef();
  

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();


    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6;


    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.backgroundColor = "transparent";

    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      encoding: THREE.sRGBEncoding,
    });
    const composer = new EffectComposer(renderer, renderTarget);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(mountRef.current.clientWidth, mountRef.current.clientHeight),
      0.8, // fuerza del bloom
      1,   // radio del desenfoque
      0.2  // umbral de brillo
    );
    composer.addPass(bloomPass);

    const pmremGenerator = new PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    new EXRLoader().load("/textures/BGReflection.exr", (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = envMap;
      scene.background = envMap;
      texture.dispose();
      pmremGenerator.dispose();
    });

    // lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x99ccff, 0.5, 10);
    pointLight.position.set(5, 10, 10);
    scene.add(pointLight);

    // Material burbujas
    const bubbles = [];
    const bubbleGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const bubbleMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,         
      transparent: true,         
      opacity: 0.7,               
      roughness: 0.1,            
      metalness: 0.3,            
      transmission: 1.0,          // glass material
      thickness: 1.5,            
      clearcoat: 1,             
      clearcoatRoughness: 0.1,   
    });

    const numBubbles = 100;
    for (let i = 0; i < numBubbles; i++) {
      const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
      bubble.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      );
      scene.add(bubble);
      bubbles.push({
        mesh: bubble,
        speed: 0.01 + Math.random() * 0.003,
      });
    }

    // animación
    const animate = () => {
      requestAnimationFrame(animate);

      bubbles.forEach((b) => {
        b.mesh.position.y += b.speed;
        if (b.mesh.position.y > 7) {
          b.mesh.position.y = -7;
          b.mesh.position.x = (Math.random() - 0.5) * 15;
          b.mesh.position.z = (Math.random() - 0.5) * 15;
        }
      });

      composer.render();
    };

    animate();

    // resize
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      composer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

  
  }, []);

  // fondo
  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />


  );
}
