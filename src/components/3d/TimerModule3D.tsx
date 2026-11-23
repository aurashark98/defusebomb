import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface TimerModule3DProps {
  timeLeft: number;
  strikes: number;
  maxStrikes: number;
}

export const TimerModule3D: React.FC<TimerModule3DProps> = ({
  timeLeft,
  strikes,
  maxStrikes
}) => {
  const sirenLightRef = useRef<THREE.PointLight>(null);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isCritical = timeLeft < 60;

  useFrame((state) => {
    if (sirenLightRef.current) {
      const t = state.clock.getElapsedTime();
      sirenLightRef.current.intensity = isCritical 
        ? Math.sin(t * 12) * 2 + 2 
        : strikes > 0 
        ? Math.sin(t * 6) * 1.5 + 1.5 
        : 0.5;
    }
  });

  return (
    <group>
      {/* Module base metal plate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 1.8, 0.15]} />
        <meshStandardMaterial color="#1c1c1f" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Screws */}
      {[
        [-0.95, 0.75], [0.95, 0.75],
        [-0.95, -0.75], [0.95, -0.75]
      ].map(([x, y], idx) => (
        <mesh key={idx} position={[x, y, 0.08]} rotation={[0, 0, idx]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 8]} />
          <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Recessed Digital Clock Screen */}
      <mesh position={[0, 0.25, 0.08]}>
        <boxGeometry args={[1.8, 0.7, 0.05]} />
        <meshStandardMaterial color="#050505" roughness={0.1} />
      </mesh>

      {/* 3D Digital Time Text */}
      <Text
        position={[0, 0.25, 0.12]}
        fontSize={0.42}
        color={isCritical ? "#ff1a40" : "#ffaa00"}
        anchorX="center"
        anchorY="middle"
      >
        {timeFormatted}
      </Text>

      {/* Strikes Panel Label */}
      <Text
        position={[-0.45, -0.28, 0.09]}
        fontSize={0.09}
        color="#a1a1aa"
        anchorX="center"
        anchorY="middle"
      >
        CRITICAL STRIKES
      </Text>

      {/* Strike Indicator Lights */}
      {Array.from({ length: maxStrikes }).map((_, idx) => {
        const isStruck = idx < strikes;
        const xPos = -0.75 + idx * 0.3;
        return (
          <group key={idx} position={[xPos, -0.48, 0.08]}>
            {/* Bezel */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.09, 0.11, 0.04, 16]} />
              <meshStandardMaterial color="#3f3f46" metalness={0.8} />
            </mesh>
            {/* Bulb */}
            <mesh position={[0, 0, 0.03]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial
                color={isStruck ? "#ff0033" : "#27272a"}
                emissive={isStruck ? "#ff0022" : "#000000"}
                emissiveIntensity={isStruck ? 2.5 : 0}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* Siren Light on top */}
      <group position={[0.65, -0.38, 0.12]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.06, 16]} />
          <meshStandardMaterial color="#27272a" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.14, 16]} />
          <meshStandardMaterial
            color={strikes > 0 ? "#ff2200" : "#f59e0b"}
            emissive={strikes > 0 ? "#ff2200" : "#d97706"}
            emissiveIntensity={1.8}
            transparent
            opacity={0.85}
          />
        </mesh>
        <pointLight
          ref={sirenLightRef}
          color={strikes > 0 ? "#ff2200" : "#f59e0b"}
          distance={2.5}
          decay={2}
          position={[0, 0, 0.2]}
        />
      </group>
    </group>
  );
};
