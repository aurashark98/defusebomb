import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { PipelineStep } from '../../types/game';
import { sound } from '../../utils/audio';

interface SequenceModule3DProps {
  initialSteps: PipelineStep[];
  isDefused: boolean;
  onSolve: () => void;
  onStrike: (explanation: string) => void;
}

export const SequenceModule3D: React.FC<SequenceModule3DProps> = ({
  initialSteps,
  isDefused,
  onSolve,
  onStrike
}) => {
  const [steps, setSteps] = useState<PipelineStep[]>(() => [
    initialSteps[2],
    initialSteps[0],
    initialSteps[4],
    initialSteps[1],
    initialSteps[3],
  ]);

  const move = (idx: number, dir: -1 | 1, e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (isDefused) return;
    sound.playKeypadClick();

    const target = idx + dir;
    if (target < 0 || target >= steps.length) return;

    const next = [...steps];
    const temp = next[idx];
    next[idx] = next[target];
    next[target] = temp;
    setSteps(next);
  };

  const verify = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (isDefused) return;

    const isCorrect = steps.every((s, idx) => s.order === idx + 1);
    if (isCorrect) {
      onSolve();
    } else {
      onStrike('URUTAN PIPELINE SALAH! Split train/test harus dilakukan paling awal.');
    }
  };

  return (
    <group>
      {/* Base Plate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 1.8, 0.12]} />
        <meshStandardMaterial color="#18181b" metalness={0.7} roughness={0.3} />
      </mesh>

      <Text position={[0, 0.74, 0.08]} fontSize={0.07} color="#fbbf24">
        SORT ML PIPELINE SEQUENCE
      </Text>

      {/* 5 Reorderable Step Bars */}
      <group position={[0, 0.44, 0.08]}>
        {steps.map((step, idx) => {
          const yPos = -idx * 0.22;
          return (
            <group key={step.id} position={[0, yPos, 0.02]}>
              <mesh>
                <boxGeometry args={[1.9, 0.16, 0.04]} />
                <meshStandardMaterial color="#27272a" roughness={0.5} />
              </mesh>

              <Text position={[-0.8, 0, 0.03]} fontSize={0.07} color="#f59e0b" fontWeight="bold">
                {String(idx + 1)}
              </Text>

              <Text position={[0.05, 0, 0.03]} fontSize={0.048} color="#e4e4e7" maxWidth={1.3}>
                {step.name.slice(0, 36)}
              </Text>

              {/* Up / Down arrows */}
              <group position={[0.75, 0, 0.03]}>
                <mesh position={[-0.06, 0, 0]} onClick={(e) => move(idx, -1, e)}>
                  <boxGeometry args={[0.09, 0.12, 0.03]} />
                  <meshStandardMaterial color={idx === 0 ? "#3f3f46" : "#0284c7"} />
                </mesh>
                <mesh position={[0.06, 0, 0]} onClick={(e) => move(idx, 1, e)}>
                  <boxGeometry args={[0.09, 0.12, 0.03]} />
                  <meshStandardMaterial color={idx === steps.length - 1 ? "#3f3f46" : "#0284c7"} />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>

      {/* Lock Sequence Button */}
      <group position={[0, -0.66, 0.1]} onClick={(e) => verify(e)}>
        <mesh>
          <boxGeometry args={[1.6, 0.2, 0.04]} />
          <meshStandardMaterial color="#10b981" roughness={0.3} />
        </mesh>
        <Text position={[0, 0, 0.03]} fontSize={0.07} color="#000000" fontWeight="bold">
          LOCK SEQUENCE
        </Text>
      </group>
    </group>
  );
};
