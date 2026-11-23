import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { TuningDialData } from '../../types/game';
import { sound } from '../../utils/audio';

interface DialModule3DProps {
  dialData: TuningDialData;
  isDefused: boolean;
  onSolve: () => void;
  onStrike: (explanation: string) => void;
}

export const DialModule3D: React.FC<DialModule3DProps> = ({
  dialData,
  isDefused,
  onSolve,
  onStrike
}) => {
  const [val, setVal] = useState<number>(dialData.currentValue);

  const rotateKnob = (delta: number, e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (isDefused) return;
    sound.playKeypadClick();
    setVal(prev => Math.min(dialData.max, Math.max(dialData.min, prev + delta)));
  };

  const handleLock = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (isDefused) return;

    const [minTarget, maxTarget] = dialData.targetRange;
    const isTarget = val >= minTarget && val <= maxTarget;

    if (isTarget) {
      onSolve();
    } else {
      onStrike(`${dialData.wrongFeedback} max_depth = ${val} belum ideal.`);
    }
  };

  // Convert value to rotation angle in radians
  const angle = ((val - dialData.min) / (dialData.max - dialData.min)) * (Math.PI * 1.5) - (Math.PI * 0.75);

  return (
    <group>
      {/* Base Plate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 1.8, 0.12]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.7} roughness={0.3} />
      </mesh>

      <Text position={[0, 0.7, 0.08]} fontSize={0.075} color="#fbbf24">
        {`PRUNING DIAL: ${dialData.parameterName}`}
      </Text>

      {/* Digital readout */}
      <group position={[0, 0.44, 0.08]}>
        <mesh>
          <boxGeometry args={[1.0, 0.28, 0.04]} />
          <meshStandardMaterial color="#09090b" />
        </mesh>
        <Text position={[0, 0, 0.03]} fontSize={0.15} color="#f59e0b">
          {`${val} ${dialData.unit}`}
        </Text>
      </group>

      {/* 3D Rotary Knob */}
      <group position={[0, -0.05, 0.1]}>
        {/* Outer tick ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.47, 0.04, 32]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.8} />
        </mesh>

        {/* Turning Knob Cylinder */}
        <group rotation={[0, 0, -angle]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.34, 0.36, 0.12, 24]} />
            <meshStandardMaterial color="#18181b" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Pointer notch */}
          <mesh position={[0, 0.24, 0.07]}>
            <boxGeometry args={[0.04, 0.14, 0.02]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
          </mesh>
        </group>
      </group>

      {/* Adjust Buttons (- / +) */}
      <group
        position={[-0.6, -0.05, 0.1]}
        onClick={(e) => rotateKnob(-5, e)}
      >
        <mesh>
          <boxGeometry args={[0.26, 0.24, 0.06]} />
          <meshStandardMaterial color="#27272a" />
        </mesh>
        <Text position={[0, 0, 0.04]} fontSize={0.12} color="#ffffff">
          -5
        </Text>
      </group>

      <group
        position={[0.6, -0.05, 0.1]}
        onClick={(e) => rotateKnob(5, e)}
      >
        <mesh>
          <boxGeometry args={[0.26, 0.24, 0.06]} />
          <meshStandardMaterial color="#27272a" />
        </mesh>
        <Text position={[0, 0, 0.04]} fontSize={0.12} color="#ffffff">
          +5
        </Text>
      </group>

      {/* Lock Button */}
      <group
        position={[0, -0.58, 0.1]}
        onClick={(e) => handleLock(e)}
      >
        <mesh>
          <boxGeometry args={[1.4, 0.25, 0.05]} />
          <meshStandardMaterial color="#eab308" roughness={0.3} />
        </mesh>
        <Text position={[0, 0, 0.03]} fontSize={0.075} color="#09090b" fontWeight="bold">
          LOCK HYPERPARAMETER
        </Text>
      </group>
    </group>
  );
};
