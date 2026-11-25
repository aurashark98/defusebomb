import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { TacticalChoiceOption } from '../../types/game';
import { sound } from '../../utils/audio';

interface TacticalModule3DProps {
  options: TacticalChoiceOption[];
  isDefused: boolean;
  onSolve: () => void;
  onStrike: (explanation: string) => void;
}

export const TacticalModule3D: React.FC<TacticalModule3DProps> = ({
  options,
  isDefused,
  onSolve,
  onStrike
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (opt: TacticalChoiceOption, e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (isDefused) return;
    sound.playKeypadClick();
    setSelectedId(opt.id);

    if (opt.isCorrect) {
      onSolve();
    } else {
      onStrike(opt.explanation);
    }
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <group>
      {/* Base Plate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 1.8, 0.12]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.7} roughness={0.3} />
      </mesh>

      <Text position={[0, 0.72, 0.08]} fontSize={0.075} color="#fbbf24">
        TACTICAL PROTOCOL SELECTION
      </Text>

      {/* 4 Push Buttons */}
      <group position={[0, 0.1, 0.08]}>
        {options.map((opt, idx) => {
          const yPos = -idx * 0.32;
          const isSelected = selectedId === opt.id;

          return (
            <group
              key={opt.id}
              position={[0, yPos, 0.02]}
              onClick={(e) => handleSelect(opt, e)}
            >
              {/* Button Case */}
              <mesh>
                <boxGeometry args={[2.0, 0.25, 0.05]} />
                <meshStandardMaterial
                  color={
                    isSelected
                      ? opt.isCorrect ? "#065f46" : "#7f1d1d"
                      : "#27272a"
                  }
                  roughness={0.4}
                />
              </mesh>

              {/* Letter Badge */}
              <mesh position={[-0.85, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
                <meshStandardMaterial color="#eab308" />
              </mesh>
              <Text position={[-0.85, 0, 0.05]} fontSize={0.08} color="#000000" fontWeight="bold">
                {letters[idx]}
              </Text>

              {/* Option text */}
              <Text
                position={[0.1, 0, 0.04]}
                fontSize={0.042}
                lineHeight={1.1}
                color={isSelected ? "#ffffff" : "#d4d4d8"}
                maxWidth={1.65}
                anchorX="center"
                anchorY="middle"
              >
                {opt.text.length > 70 ? opt.text.slice(0, 68) + '...' : opt.text}
              </Text>
            </group>
          );
        })}
      </group>
    </group>
  );
};
