import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { ThemeMode } from '../../types';

interface Landing3DSceneProps {
  currentScene: number; // 0 to 7
  reducedMotion: boolean;
  theme?: ThemeMode;
  onSelectQubit?: (qubitIndex: number) => void;
}

export const Landing3DScene: React.FC<Landing3DSceneProps> = ({
  currentScene,
  reducedMotion,
  theme = 'dark',
  onSelectQubit
}) => {

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const objectsGroupRef = useRef<THREE.Group | null>(null);
  const dnaGroupRef = useRef<THREE.Group | null>(null);
  const quantumGroupRef = useRef<THREE.Group | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup with adaptive atmosphere
    const isDark = theme === 'dark';
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = isDark 
      ? new THREE.FogExp2(0x11110f, 0.035) 
      : new THREE.FogExp2(0xf5f0e6, 0.022);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.2 : 1.0;
    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // 4. Lighting (Adaptive champagne + fill)
    const ambientLight = new THREE.AmbientLight(0xf5f0e6, isDark ? 0.8 : 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe8d89a, isDark ? 2.5 : 2.0);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xb89a4a, isDark ? 1.8 : 1.5);

    dirLight2.position.set(-15, -10, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xd4b76b, 3, 30);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    objectsGroupRef.current = mainGroup;

    // --- Build DNA Double Helix ---
    const dnaGroup = new THREE.Group();
    dnaGroupRef.current = dnaGroup;
    mainGroup.add(dnaGroup);

    const strandCount = 44;
    const helixRadius = 2.4;
    const helixHeight = 16;
    const turns = 2.8;

    const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const goldMat = new THREE.MeshStandardMaterial({ 
      color: 0xb89a4a, 
      roughness: 0.3, 
      metalness: 0.8 
    });
    const ivoryMat = new THREE.MeshStandardMaterial({ 
      color: 0xf5f0e6, 
      roughness: 0.5, 
      metalness: 0.2 
    });
    const yellowMat = new THREE.MeshStandardMaterial({ 
      color: 0xe8d89a, 
      roughness: 0.2, 
      metalness: 0.6 
    });
    const bronzeMat = new THREE.MeshStandardMaterial({ 
      color: 0x8c734b, 
      roughness: 0.4, 
      metalness: 0.7 
    });

    const cylinderGeo = new THREE.CylinderGeometry(0.04, 0.04, helixRadius * 2, 8);
    const rungMat = new THREE.MeshStandardMaterial({ 
      color: 0x5c5549, 
      roughness: 0.6,
      transparent: true,
      opacity: 0.7
    });

    for (let i = 0; i < strandCount; i++) {
      const t = i / strandCount;
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * helixHeight;

      const x1 = Math.cos(angle) * helixRadius;
      const z1 = Math.sin(angle) * helixRadius;
      const x2 = -x1;
      const z2 = -z1;

      // Strand 1 node
      const node1 = new THREE.Mesh(sphereGeo, i % 2 === 0 ? goldMat : yellowMat);
      node1.position.set(x1, y, z1);
      dnaGroup.add(node1);

      // Strand 2 node
      const node2 = new THREE.Mesh(sphereGeo, i % 2 === 0 ? ivoryMat : bronzeMat);
      node2.position.set(x2, y, z2);
      dnaGroup.add(node2);

      // Connecting base-pair rung
      const rung = new THREE.Mesh(cylinderGeo, rungMat);
      rung.position.set(0, y, 0);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = angle;
      dnaGroup.add(rung);
    }

    // --- Build 3D Quantum Qubit Register / Circuit Lattice ---
    const quantumGroup = new THREE.Group();
    quantumGroupRef.current = quantumGroup;
    mainGroup.add(quantumGroup);
    quantumGroup.position.set(0, 0, 0);

    const qubitCount = 12;
    const qubitGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const ringGeo = new THREE.TorusGeometry(0.65, 0.03, 16, 48);

    const qubitMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < qubitCount; i++) {
      const qRing = new THREE.Mesh(
        ringGeo, 
        new THREE.MeshStandardMaterial({ color: 0xb89a4a, roughness: 0.2, metalness: 0.9 })
      );
      const qSphere = new THREE.Mesh(
        qubitGeo, 
        new THREE.MeshStandardMaterial({ 
          color: 0xe8d89a, 
          emissive: 0x8c734b, 
          emissiveIntensity: 0.4,
          roughness: 0.1, 
          metalness: 0.5 
        })
      );
      
      const qObject = new THREE.Group();
      qObject.add(qSphere);
      qObject.add(qRing);

      // Arrange in entangled hexagonal lattice
      const angle = (i / qubitCount) * Math.PI * 2;
      const rad = 4.2 + (i % 2 === 0 ? 0.6 : -0.6);
      qObject.position.set(Math.cos(angle) * rad, Math.sin(angle) * (rad * 0.7), (i % 3 - 1) * 1.5);
      
      qObject.userData = { qubitIndex: i, initialY: qObject.position.y };
      quantumGroup.add(qObject);
      qubitMeshes.push(qSphere);
    }

    // Coupling lines between qubits
    const lineMat = new THREE.LineBasicMaterial({ 
      color: 0xb89a4a, 
      transparent: true, 
      opacity: 0.35 
    });
    for (let i = 0; i < qubitCount; i++) {
      const nextIdx = (i + 1) % qubitCount;
      const crossIdx = (i + 4) % qubitCount;
      const p1 = quantumGroup.children[i].position;
      const p2 = quantumGroup.children[nextIdx].position;
      const p3 = quantumGroup.children[crossIdx].position;

      const points = [p1, p2, p3];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, lineMat);
      quantumGroup.add(line);
    }

    // --- Background Scientific Particles / Flowing Genomic Sequences ---
    const particleCount = 450;
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    const cGold = new THREE.Color(0xb89a4a);
    const cSec = isDark ? new THREE.Color(0xe8d89a) : new THREE.Color(0x8c734b);
    const cTert = isDark ? new THREE.Color(0xf5f0e6) : new THREE.Color(0x24221e);

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 36;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const c = i % 3 === 0 ? cGold : i % 3 === 1 ? cSec : cTert;
      pColors[i * 3] = c.r;
      pColors[i * 3 + 1] = c.g;
      pColors[i * 3 + 2] = c.b;
    }


    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.65
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
    particleSystemRef.current = particles;

    // --- Mouse Parallax Handler ---
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 1.5;
      mouseRef.current.targetY = y * 1.2;
    };

    // Click Raycaster for interactive qubit selection
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(qubitMeshes);

      if (intersects.length > 0 && onSelectQubit) {
        const parent = intersects[0].object.parent;
        if (parent && parent.userData.qubitIndex !== undefined) {
          onSelectQubit(parent.userData.qubitIndex);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const motionSpeed = reducedMotion ? 0.15 : 1.0;

      // 1. Helix continuous rotation
      if (dnaGroupRef.current) {
        dnaGroupRef.current.rotation.y += 0.008 * motionSpeed;
        dnaGroupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      }

      // 2. Quantum register rotation & state oscillations
      if (quantumGroupRef.current) {
        quantumGroupRef.current.rotation.z += 0.005 * motionSpeed;
        quantumGroupRef.current.rotation.y = Math.cos(time * 0.4) * 0.15;

        // Individual qubit ring precession
        quantumGroupRef.current.children.forEach((child, i) => {
          if (child instanceof THREE.Group) {
            child.rotation.x = time * 0.8 + i;
            child.rotation.y = time * 0.6 + i;
          }
        });
      }

      // 3. Floating particle gentle drift
      if (particleSystemRef.current) {
        particleSystemRef.current.rotation.y = time * 0.02 * motionSpeed;
      }

      // 4. Camera target position based on current scene state (Cinematic choreography)
      const sceneTargets = [
        // 0: DNA Focus (Hero)
        { camZ: 17, camY: 0, dnaScale: 1.0, dnaAlpha: 1.0, qScale: 0.4, qAlpha: 0.1, rotX: 0 },
        // 1: Sequencing (DNA fragments breakdown)
        { camZ: 15, camY: 0.5, dnaScale: 0.9, dnaAlpha: 0.9, qScale: 0.5, qAlpha: 0.2, rotX: 0.1 },
        // 2: Alignment (Linear projection)
        { camZ: 14, camY: -0.5, dnaScale: 0.8, dnaAlpha: 0.8, qScale: 0.6, qAlpha: 0.3, rotX: -0.1 },
        // 3: Candidate Discovery (Evidence focus)
        { camZ: 13, camY: 0, dnaScale: 0.7, dnaAlpha: 0.6, qScale: 0.8, qAlpha: 0.5, rotX: 0.15 },
        // 4: Quantum Transition (DNA fades, Quantum lattice grows)
        { camZ: 12, camY: 0.2, dnaScale: 0.4, dnaAlpha: 0.2, qScale: 1.1, qAlpha: 0.85, rotX: 0.2 },
        // 5: QAOA Optimization (Full quantum focus)
        { camZ: 11, camY: 0, dnaScale: 0.1, dnaAlpha: 0.05, qScale: 1.25, qAlpha: 1.0, rotX: 0.0 },
        // 6: Classical Validation (Hybrid convergence)
        { camZ: 13, camY: -0.3, dnaScale: 0.6, dnaAlpha: 0.7, qScale: 0.9, qAlpha: 0.7, rotX: -0.1 },
        // 7: Final Variant Call Result
        { camZ: 15, camY: 0, dnaScale: 0.85, dnaAlpha: 0.9, qScale: 0.85, qAlpha: 0.85, rotX: 0.0 }
      ];

      const target = sceneTargets[Math.min(currentScene, sceneTargets.length - 1)];

      if (cameraRef.current) {
        const destZ = target.camZ;
        const destY = target.camY + mouseRef.current.y * 0.8;
        const destX = mouseRef.current.x * 0.8;

        cameraRef.current.position.x += (destX - cameraRef.current.position.x) * 0.04;
        cameraRef.current.position.y += (destY - cameraRef.current.position.y) * 0.04;
        cameraRef.current.position.z += (destZ - cameraRef.current.position.z) * 0.04;
        cameraRef.current.lookAt(0, 0, 0);
      }

      if (dnaGroupRef.current) {
        dnaGroupRef.current.scale.lerp(new THREE.Vector3(target.dnaScale, target.dnaScale, target.dnaScale), 0.05);
      }

      if (quantumGroupRef.current) {
        quantumGroupRef.current.scale.lerp(new THREE.Vector3(target.qScale, target.qScale, target.qScale), 0.05);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [reducedMotion, theme]);


  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    />
  );
};
