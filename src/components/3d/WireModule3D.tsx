import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { WireOption } from '../../types/game';
import { sound } from '../../utils/audio';

interface WireModule3DProps {
  wires: WireOption[];
  isDefused: boolean;
  onSolve: () => void;
  onStrike: (explanation: string) => void;
}

export const WireModule3D: React.FC<WireModule3DProps> = ({
  wires,
  isDefused,
  onSolve,
  onStrike
}) => {
  const [cutIds, setCutIds] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleCut = (wire: WireOption, e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (isDefused || cutIds.includes(wire.id)) return;

    sound.playWireCut();
    setCutIds(prev => [...prev, wire.id]);

    if (wire.isCorrect) {
      onSolve();
    } else {
      onStrike(wire.explanation);
    }
  };

  const getWireHex = (color: WireOption['color']): string => {
    switch (color) {
      case 'red': return '#ef4444';
      case 'blue': return '#3b82f6';
      case 'yellow': return '#f59e0b';
      case 'green': return '#10b981';
      case 'purple': return '#a855f7';
      case 'cyan': return '#06b6d4';
      default: return '#71717a';
    }
  };

  return (
    <group>
      {/* Background Plate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 1.8, 0.12]} />
        <meshStandardMaterial color="#18181b" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.72, 0.08]}
        fontSize={0.08}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
      >
        WIRES // CUT CORRECT SOLVER
      </Text>

      {/* Wire Rows */}
      {wires.map((wire, idx) => {
        const yPos = 0.45 - idx * 0.28;
        const isCut = cutIds.includes(wire.id);
        const hex = getWireHex(wire.color);
        const isHovered = hoveredId === wire.id;

        return (
          <group key={wire.id} position={[0, yPos, 0.08]}>
            {/* Left Terminal Screw */}
            <mesh position={[-0.9, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.07, 0.04, 12]} />
              <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Right Terminal Screw */}
            <mesh position={[0.9, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.07, 0.04, 12]} />
              <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* 3D Wire Geometry */}
            {isCut ? (
              // Severed wire halves
              <>
                <mesh position={[-0.5, -0.04, 0.04]} rotation={[0, 0, Math.PI / 2 - 0.2]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.7, 12]} />
                  <meshStandardMaterial color={hex} roughness={0.4} />
                </mesh>
                <mesh position={[0.5, 0.04, 0.04]} rotation={[0, 0, Math.PI / 2 + 0.2]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.7, 12]} />
                  <meshStandardMaterial color={hex} roughness={0.4} />
                </mesh>
                {/* Exposed Copper Core */}
                <mesh position={[-0.15, -0.11, 0.04]}>
                  <sphereGeometry args={[0.02, 8, 8]} />
                  <meshStandardMaterial color="#d97706" metalness={0.9} />
                </mesh>
                <mesh position={[0.15, 0.11, 0.04]}>
                  <sphereGeometry args={[0.02, 8, 8]} />
                  <meshStandardMaterial color="#d97706" metalness={0.9} />
                </mesh>
              </>
            ) : (
              // Intact 3D Wire
              <mesh
                position={[0, 0, 0.05]}
                rotation={[0, 0, Math.PI / 2]}
                onPointerOver={() => setHoveredId(wire.id)}
                onPointerOut={() => setHoveredId(null)}
                onClick={(e) => handleCut(wire, e)}
              >
                <cylinderGeometry args={[0.035, 0.035, 1.76, 16]} />
                <meshStandardMaterial
                  color={hex}
                  emissive={isHovered ? hex : "#000000"}
                  emissiveIntensity={isHovered ? 0.6 : 0}
                  roughness={0.3}
                />
              </mesh>
            )}

            {/* Wire Label text */}
            <Text
              position={[0, -0.09, 0.06]}
              fontSize={0.06}
              color={isCut ? "#ef4444" : isHovered ? "#ffffff" : "#a1a1aa"}
              anchorX="center"
              anchorY="middle"
            >
              {isCut ? `[SEVERED] ${wire.label.slice(0, 24)}` : wire.label.slice(0, 32)}
            </Text>
          </group>
        );
      })}
    </group>
  );
};
