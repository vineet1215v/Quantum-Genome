import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ThemeMode } from '../../types';

interface HelixQuantumViewerProps {
  theme: ThemeMode;
  activeLocus?: string;
  isAnalyzing?: boolean;
}

export const HelixQuantumViewer: React.FC<HelixQuantumViewerProps> = ({
  theme,
  activeLocus = 'TP53 Exon 5-8',
  isAnalyzing = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 36);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const helixGroup = new THREE.Group();
    scene.add(helixGroup);

    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);

    const strandColor = isDark ? 0xb89a4a : 0x8c7333;
    const strandMat = new THREE.MeshStandardMaterial({
      color: strandColor,
      roughness: 0.3,
      metalness: 0.8,
    });

    const baseColors = [
      0x10b981, // A - Emerald
      0x06b6d4, // C - Cyan
      0xf59e0b, // G - Amber
      0xef4444, // T - Rose
    ];

    const numPairs = 24;
    const radius = 4.2;
    const heightSpan = 22;
    const turns = 2.2;

    for (let i = 0; i < numPairs; i++) {
      const t = i / (numPairs - 1);
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * heightSpan;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = -x1;
      const z2 = -z1;

      const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const s1 = new THREE.Mesh(sphereGeo, strandMat);
      s1.position.set(x1, y, z1);
      helixGroup.add(s1);

      const s2 = new THREE.Mesh(sphereGeo, strandMat);
      s2.position.set(x2, y, z2);
      helixGroup.add(s2);

      const basePairColor = baseColors[i % baseColors.length];
      const rungMat = new THREE.MeshStandardMaterial({
        color: basePairColor,
        roughness: 0.2,
        metalness: 0.5,
        emissive: basePairColor,
        emissiveIntensity: isDark ? 0.35 : 0.15,
      });

      const rungLength = radius * 2;
      const rungGeo = new THREE.CylinderGeometry(0.12, 0.12, rungLength, 8);
      const rung = new THREE.Mesh(rungGeo, rungMat);

      rung.position.set(0, y, 0);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = -angle;
      helixGroup.add(rung);
    }

    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color(isDark ? 0xe8d89a : 0xb89a4a);
    const cyanColor = new THREE.Color(0x38bdf8);

    for (let p = 0; p < particleCount; p++) {
      const theta = Math.random() * Math.PI * 2;
      const r = radius * 1.2 + Math.random() * 4.5;
      const py = (Math.random() - 0.5) * heightSpan * 1.2;

      positions[p * 3] = Math.cos(theta) * r;
      positions[p * 3 + 1] = py;
      positions[p * 3 + 2] = Math.sin(theta) * r;

      const mixed = Math.random() > 0.5 ? goldColor : cyanColor;
      particleColors[p * 3] = mixed.r;
      particleColors[p * 3 + 1] = mixed.g;
      particleColors[p * 3 + 2] = mixed.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isDark ? 0.45 : 0.35,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.85 : 0.7,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particlesGroup.add(particles);

    const ambientLight = new THREE.AmbientLight(isDark ? 0xffffff : 0xfbf6ea, isDark ? 1.2 : 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7e6, 2.0);
    keyLight.position.set(15, 20, 25);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-15, -10, -10);
    scene.add(fillLight);

    let isDragging = false;
    let previousMouseX = 0;
    let rotationVelocity = 0.008;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      helixGroup.rotation.y += deltaX * 0.01;
      particlesGroup.rotation.y += deltaX * 0.005;
      previousMouseX = e.clientX;
      rotationVelocity = deltaX * 0.002;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const speed = isAnalyzing ? 0.065 : 0.008;

      if (!isDragging) {
        helixGroup.rotation.y += speed;
        particlesGroup.rotation.y += isAnalyzing ? speed * 1.6 : speed * 0.5;
        rotationVelocity *= 0.95;
        helixGroup.rotation.y += rotationVelocity;
      }

      const time = clock.getElapsedTime();
      helixGroup.rotation.z = Math.sin(time * (isAnalyzing ? 2.5 : 0.8)) * (isAnalyzing ? 0.16 : 0.08);
      particles.rotation.y = time * (isAnalyzing ? 0.6 : 0.15);

      if (isAnalyzing) {
        const pulse = Math.sin(time * 6) * 1.5;
        camera.position.z = 36 + pulse;
      } else {
        camera.position.z = 36;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 200;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [theme, isAnalyzing]);

  return (
    <div className={`relative w-full h-full min-h-[180px] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none transition-all duration-500 ${
      isAnalyzing ? 'animate-quantum-pulse' : ''
    }`}>
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border backdrop-blur-md transition-colors ${
          isAnalyzing
            ? 'bg-[#B89A4A] text-[#11110F] border-[#B89A4A] shadow-md animate-pulse'
            : 'bg-white/40 dark:bg-black/50 border-[#DDD4C0] dark:border-[#38352F] text-[#181715] dark:text-[#E8D89A]'
        }`}>
          {isAnalyzing ? '⚡ QAOA Accelerating' : '3D Quantum Helix'}
        </span>
        <span className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] bg-white/30 dark:bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
          Locus: {activeLocus}
        </span>
      </div>

      <div className="absolute bottom-3 right-3 pointer-events-none flex items-center gap-2 text-[10px] font-mono text-[#5C5549] dark:text-[#A8A092] bg-white/30 dark:bg-black/40 px-2.5 py-1 rounded backdrop-blur-xs">
        <span className={`w-1.5 h-1.5 rounded-full ${isAnalyzing ? 'bg-amber-400 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
        <span>{isAnalyzing ? 'Simulating Qubits...' : 'Drag to rotate'}</span>
      </div>
    </div>
  );
};


