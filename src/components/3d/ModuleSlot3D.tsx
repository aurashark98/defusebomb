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
          color={isSelected ? "#3f3f46" : "#18181b"}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Actual Module Component */}
      {children}

      {/* Top-Right Status LED (Green = Defused, Red = Armed) */}
      <group position={[0.95, 0.75, 0.12]}>
        {/* LED Bezel */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.03, 16]} />
          <meshStandardMaterial color="#27272a" metalness={0.9} />
        </mesh>
        {/* LED Lens */}
        <mesh position={[0, 0, 0.02]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial
            color={isDefused ? "#10b981" : "#ef4444"}
            emissive={isDefused ? "#10b981" : "#ef4444"}
            emissiveIntensity={isDefused ? 2.5 : 1.2}
          />
        </mesh>
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
