import React from 'react';
import { Text } from '@react-three/drei';

interface ModuleSlot3DProps {
  id: string;
  isDefused: boolean;
  isSelected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}

export const ModuleSlot3D: React.FC<ModuleSlot3DProps> = ({
  id,
  isDefused,
  isSelected,
  onSelect,
  children
}) => {
  return (
    <group>
      {/* Outer Socket Frame */}
      <mesh position={[0, 0, -0.05]} onClick={onSelect}>
        <boxGeometry args={[2.3, 1.9, 0.1]} />
        <meshStandardMaterial
          color={isDefused ? "#064e3b" : isSelected ? "#3f3f46" : "#18181b"}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Luminous Green Frame Accent when Defused */}
      {isDefused && (
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[2.34, 1.94, 0.02]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={0.8}
            wireframe
          />
        </mesh>
      )}

      {/* Actual Module Component */}
      {children}

      {/* Top-Right Status LED (Ultra-Vivid Green = Defused, Red = Armed) */}
      <group position={[0.95, 0.75, 0.12]}>
        {/* LED Metal Bezel */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.09, 0.04, 20]} />
          <meshStandardMaterial color="#27272a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* LED Bulb Lens */}
        <mesh position={[0, 0, 0.025]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial
            color={isDefused ? "#22c55e" : "#ef4444"}
            emissive={isDefused ? "#22c55e" : "#ef4444"}
            emissiveIntensity={isDefused ? 4.5 : 1.4}
            roughness={0.1}
          />
        </mesh>

        {/* Real Light Emitted onto the Module */}
        <pointLight
          position={[0, 0, 0.15]}
          distance={2.2}
          intensity={isDefused ? 3.0 : 0.6}
          color={isDefused ? "#22c55e" : "#ef4444"}
        />

        {/* DEFUSED Text Badge */}
        {isDefused && (
          <Text
            position={[-0.32, 0, 0.04]}
            fontSize={0.065}
            color="#4ade80"
            fontWeight="bold"
            anchorX="right"
          >
            DEFUSED ✓
          </Text>
        )}
      </group>

      {/* Module ID engraving */}
      <Text
        position={[-0.8, -0.82, 0.08]}
        fontSize={0.06}
        color="#71717a"
        anchorX="left"
      >
        {`SLOT-${id.toUpperCase()}`}
      </Text>
    </group>
  );
};
