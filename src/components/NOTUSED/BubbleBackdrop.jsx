import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { PMREMGenerator } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

export default function BubbleBackdrop() {
  const mountRef = useRef();

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
   
    renderer.setClearColor(0x000000, 0); // OK
    mount.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.8,
      1,
      0.2
    );
    composer.addPass(bloomPass);

    const pmremGenerator = new PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    new EXRLoader().load("/textures/BGReflection.exr", (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = envMap;    
      texture.dispose();
      pmremGenerator.dispose();

      // Burbuja única y grande
      const geometry = new THREE.SphereGeometry(1, 128, 128);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.3,
        transmission: 1.0,
        thickness: 2.0,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMap: envMap,
        envMapIntensity: 1.5,
      });

      const bubble = new THREE.Mesh(geometry, material);
      scene.add(bubble);

      // Luces
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0x99ccff, 0.5, 10);
      pointLight.position.set(2, 5, 5);
      scene.add(pointLight);


      const animate = () => {
       requestAnimationFrame(animate);
 
        bubble.rotation.y += 0.002;
        bubble.rotation.x += 0.001;

        composer.render();
      };

      animate();
    });

    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      composer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
        ref={mountRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ width: "100%", height: "100%", backgroundColor: "transparent",  }}
        />

  );
}
