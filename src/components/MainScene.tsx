"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { DISPLAY_CONFIG } from "@/config/Config";
// import seedrandom from 'seedrandom'; //결정론적 랜덤함수 사용시

const MainScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    // const rng = seedrandom('mySeed'); // 결정론적 랜덤 함수 (선택 사항)

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      DISPLAY_CONFIG.getAspectRatio(),
      0.01,
      10000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(DISPLAY_CONFIG.width(), DISPLAY_CONFIG.height());
    renderer.setClearColor(0x000000);
    mountRef.current.appendChild(renderer.domElement);
    camera.position.z = DISPLAY_CONFIG.renderDistance / 2; // 초기 z 위치 변경

    function createStars(scene, camera, starMaterial) {
      const starGeometry = new THREE.BufferGeometry();

      const starCount = DISPLAY_CONFIG.starCount;
      const positions = [];
      const { x: camX, y: camY, z: camZ } = camera.position;
      const renderDistance = DISPLAY_CONFIG.renderDistance;

      if (renderDistance <= 0) {
        console.error("renderDistance must be greater than 0");
        return;
      }

      for (let i = 0; i < starCount; i++) {
        const x = camX + Math.random() * renderDistance * 2 - renderDistance;
        const y = camY + Math.random() * renderDistance * 2 - renderDistance;
        const z = camZ + Math.random() * renderDistance * 2 - renderDistance;
        // const x = camX + rng() * renderDistance * 2 - renderDistance; //결정론적 랜덤함수 사용시
        // const y = camY + rng() * renderDistance * 2 - renderDistance;
        // const z = camZ + rng() * renderDistance * 2 - renderDistance;
        positions.push(x, y, z);
      }

      starGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );

      const starPoints = new THREE.Points(starGeometry, starMaterial);
      scene.add(starPoints);
      return starPoints;
    }

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 5.0,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });

    let starPoints = createStars(scene, camera, starMaterial);

    let previousChunkX = Math.floor(
      camera.position.x / DISPLAY_CONFIG.chunkSize
    );
    let previousChunkY = Math.floor(
      camera.position.y / DISPLAY_CONFIG.chunkSize
    );
    let previousChunkZ = Math.floor(
      camera.position.z / DISPLAY_CONFIG.chunkSize
    );

    const clock = new THREE.Clock();
    let delta = 0;
    let smoothDelta = 0;
    const smoothFactor = 0.1; // animate 함수 바깥에

    const animate = () => {
      // console.log("animate called"); // animate 함수 호출 확인 (필요시)
      let delta = clock.getDelta();

      smoothDelta = smoothDelta * (1 - smoothFactor) + delta * smoothFactor;
        // delta 값 제한 (선택 사항)
      requestAnimationFrame(animate);

      camera.position.z -= 50 * smoothDelta; // 카메라 이동 방향 및 속도 조절
      camera.updateMatrixWorld();

      const currentChunkX = Math.floor(
        camera.position.x / DISPLAY_CONFIG.chunkSize
      );
      const currentChunkY = Math.floor(
        camera.position.y / DISPLAY_CONFIG.chunkSize
      );
      const currentChunkZ = Math.floor(
        camera.position.z / DISPLAY_CONFIG.chunkSize
      );

      if (
        currentChunkX !== previousChunkX ||
        currentChunkY !== previousChunkY ||
        currentChunkZ !== previousChunkZ
      ) {
        if (starPoints) {
          scene.remove(starPoints);
          starPoints.geometry.dispose();
          starPoints.material.dispose();
        }
        starPoints = createStars(scene, camera, starMaterial);
      }

      // 별 깜빡임 효과 (ShaderMaterial 사용이 더 효율적)
      starMaterial.opacity = Math.sin(Date.now() * 0.001) * 0.2 + 0.8;
      starMaterial.needsUpdate = true;

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      renderer.setSize(DISPLAY_CONFIG.width(), DISPLAY_CONFIG.height());
      camera.aspect = DISPLAY_CONFIG.getAspectRatio();
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    animate(); // useEffect 안에서 호출

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      scene.remove(starPoints);
      starPoints.geometry.dispose();
      starPoints.material.dispose();
    };
  }, []); // 빈 배열

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default MainScene;