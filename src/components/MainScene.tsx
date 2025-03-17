"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DISPLAY_CONFIG } from "@/config/Config";

const MainScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // 클라이언트에서만 true로 설정
  }, []);

  useEffect(() => {
    if (!mountRef.current || !isMounted) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75, 
        DISPLAY_CONFIG.getAspectRatio(), 
        0.1, 
        1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(DISPLAY_CONFIG.width(), DISPLAY_CONFIG.height());
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(DISPLAY_CONFIG.width(), DISPLAY_CONFIG.height());
      camera.aspect = DISPLAY_CONFIG.getAspectRatio();
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [isMounted]);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default MainScene;