// --- 3D Background Component using three.js ---
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
const COLORS = {
  primaryTeal: '#009688',
  accentOrange: '#FF8A65',
  backgroundLight: '#F8F9FA', // General page and 3D floor color
};

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Use imported THREE (not window.THREE)
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const particleGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: COLORS.primaryTeal, transparent: true, opacity: 0.9 });

    const particles: THREE.Mesh[] = [];
    const count = 150;
    for (let i = 0; i < count; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      );
      particles.push(particle);
      scene.add(particle);
    }

    // Resize handler uses window sizes so canvas fills screen
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.00005;

      camera.position.x += 0.0005 * Math.sin(time * 0.8);
      camera.position.y += 0.0005 * Math.cos(time * 0.6);
      camera.lookAt(0, 0, 0);

      particles.forEach((p, i) => {
        p.rotation.x += 0.01;
        p.rotation.y += 0.005;
        p.position.y += 0.0005 * Math.sin(time * 5 + i * 0.1);
        p.position.x += 0.0002 * Math.cos(time * 3 + i * 0.1);
        if (p.position.z > camera.position.z + 5) {
          p.position.z = camera.position.z - 15;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      particles.forEach(p => scene.remove(p));
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (currentMount.contains(renderer.domElement)) currentMount.removeChild(renderer.domElement);
      renderer.forceContextLoss?.();
      (renderer as any).context = null;
      (renderer as any).domElement = null;
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1, opacity: 0.3, backgroundColor: COLORS.backgroundLight }}
    />
  );
};

export default ThreeBackground;