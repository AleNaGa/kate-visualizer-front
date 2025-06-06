import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class SceneInit {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.bubbles = [];
    this.cameraTarget = null; 
    this.cameraLookAtTarget = null;
    this.originalCameraPosition = new THREE.Vector3();
    this.originalLookAt = new THREE.Vector3();
  }

  initialize() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 15;
    

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.rotateSpeed = 0.5;

    
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 30;
    this.controls.enablePan = false;
    this.controls.minPolarAngle = Math.PI / 4;
    this.controls.maxPolarAngle = Math.PI / 1.5;

    const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      encoding: THREE.sRGBEncoding,
    });

    this.composer = new EffectComposer(this.renderer, renderTarget);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(
      new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 1, 0.2)
    );

    this.loadRotatedEXREnvironment();

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const pointLight = new THREE.PointLight(0x99ccff, 0.6, 100);
    pointLight.position.set(10, 20, 10);
    this.scene.add(pointLight);
    this.originalCameraPosition.copy(this.camera.position);
    this.originalLookAt.copy(this.controls.target);

    this.createBackgroundBubbles();
  }

  loadRotatedEXREnvironment() {
    new EXRLoader().load("/textures/BGReflection.exr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      const exrScene = new THREE.Scene();
      const sphereGeo = new THREE.SphereGeometry(100, 32, 32);
      sphereGeo.scale(-1, 1, 1);

      const exrMat = new THREE.MeshBasicMaterial({ map: texture });
      const sphere = new THREE.Mesh(sphereGeo, exrMat);
      sphere.rotation.x = Math.PI / 2; // Rotación
      exrScene.add(sphere);

      const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        encoding: THREE.sRGBEncoding,
      });

      const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
      cubeCamera.update(this.renderer, exrScene);

      this.scene.environment = cubeRenderTarget.texture;
      this.scene.background = cubeRenderTarget.texture;

      texture.dispose();
    });
  }

  createBackgroundBubbles() {
    const geo = new THREE.SphereGeometry(1, 32, 32);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
      metalness: 0.3,
      transmission: 1.0,
      thickness: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });

    for (let i = 0; i < 100; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      );
      this.scene.add(mesh);
      this.bubbles.push({ mesh, speed: 0.1 + Math.random() * 0.3 });
    }
  }

    moveCameraTo(position, lookAt = new THREE.Vector3(0, 0, 0)) {
      this.cameraTarget = position.clone();        // dónde se mueve
      this.cameraLookAtTarget = lookAt.clone();    // a qué mirar
    }
    resetCamera() {
      this.moveCameraTo(this.originalCameraPosition, this.originalLookAt);
    }
  animate = () => {
    requestAnimationFrame(this.animate);

    // Animación suave para mover la cámara si hay objetivo
    if (this.cameraTarget) {
      
        this.camera.position.lerp(this.cameraTarget, 0.05);

        // Mira  hacia el objetivo
        if (this.cameraLookAtTarget) {
          this.controls.target.lerp(this.cameraLookAtTarget, 0.05);
          this.controls.update();
        }

        const closeEnough =
          this.camera.position.distanceTo(this.cameraTarget) < 0.01 &&
          this.controls.target.distanceTo(this.cameraLookAtTarget) < 0.01;

        if (closeEnough) {
          this.cameraTarget = null;
          this.cameraLookAtTarget = null;
        }
      }
      

    this.bubbles.forEach((b) => {
      b.mesh.position.y += b.speed * 0.2;
      if (b.mesh.position.y > 100) {
        b.mesh.position.y = -100;
        b.mesh.position.x = (Math.random() - 0.5) * 200;
        b.mesh.position.z = (Math.random() - 0.5) * 200;
      }
    });
    

    this.controls.update();
    this.composer.render();
  };
}
