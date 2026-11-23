import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { TerminalFixOption } from '../../types/game';
import { sound } from '../../utils/audio';

interface TerminalModule3DProps {
  context: string;
  brokenCode: string;
  options: TerminalFixOption[];
  isDefused: boolean;
  onSolve: () => void;
  onStrike: (explanation: string) => void;
}

export const TerminalModule3D: React.FC<TerminalModule3DProps> = ({
  context,
  brokenCode,
  options,
  isDefused,
  onSolve,
  onStrike
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (opt: TerminalFixOption, e: { stopPropagation: () => void }) => {
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

  return (
    <group>
      {/* Module Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 1.8, 0.12]} />
        <meshStandardMaterial color="#141416" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Retro Curved CRT Screen */}
      <group position={[0, 0.28, 0.08]}>
        <mesh>
          <boxGeometry args={[2.0, 0.85, 0.05]} />
          <meshStandardMaterial color="#022c22" roughness={0.2} emissive="#022c22" emissiveIntensity={0.3} />
        </mesh>
        <Text position={[0, 0.32, 0.04]} fontSize={0.065} color="#34d399">
          {`# ${context.slice(0, 42)}`}
        </Text>
        <Text position={[0, -0.05, 0.04]} fontSize={0.055} color="#86efac" maxWidth={1.85}>
          {brokenCode}
        </Text>
      </group>

      {/* 4 Interactive Code Patch Buttons */}
      <group position={[0, -0.4, 0.08]}>
        {options.map((opt, idx) => {
          const yPos = -idx * 0.18;
          const isSelected = selectedId === opt.id;

          return (
            <group
              key={opt.id}
              position={[0, yPos, 0.02]}
              onClick={(e) => handleSelect(opt, e)}
            >
              <mesh>
                <boxGeometry args={[1.95, 0.15, 0.04]} />
                <meshStandardMaterial
                  color={
                    isSelected
                      ? opt.isCorrect ? "#065f46" : "#7f1d1d"
                      : "#27272a"
                  }
                  roughness={0.4}
                />
              </mesh>
              <Text
                position={[0, 0, 0.03]}
                fontSize={0.052}
                color={isSelected ? "#ffffff" : "#6ee7b7"}
                anchorX="center"
                anchorY="middle"
              >
                {`[${idx + 1}] ${opt.codeSnippet.slice(0, 42)}`}
              </Text>
            </group>
          );
        })}
      </group>
    </group>
  );
};
