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

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Click row to select or swap with another row
  const handleRowClick = (idx: number, e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (isDefused) return;
    sound.playKeypadClick();

    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else {
      // Swap steps[selectedIdx] and steps[idx]
      const next = [...steps];
      const temp = next[selectedIdx];
      next[selectedIdx] = next[idx];
      next[idx] = temp;
      setSteps(next);
      setSelectedIdx(null);
    }
  };

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
    setSelectedIdx(null);
  };

  const verify = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (isDefused) return;

    const isCorrect = steps.every((s, idx) => s.order === idx + 1);
    if (isCorrect) {
      sound.playModuleDefused();
      onSolve();
    } else {
      onStrike('URUTAN PIPELINE SALAH! Split train/test harus dilakukan paling awal sebelum imputasi & scaling.');
      setSelectedIdx(null);
    }
  };

  return (
    <group>
      {/* Base Plate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 1.8, 0.12]} />
        <meshStandardMaterial color="#18181b" metalness={0.7} roughness={0.3} />
      </mesh>

      <Text position={[0, 0.77, 0.08]} fontSize={0.065} color="#fbbf24" fontWeight="bold">
        URUTKAN PIPELINE MACHINE LEARNING
      </Text>
      <Text position={[0, 0.69, 0.08]} fontSize={0.038} color="#94a3b8">
        (1 = Langkah Pertama • Klik 2 baris untuk SWAP atau tombol ▲ ▼)
      </Text>

      {/* 5 Reorderable Step Bars */}
      <group position={[0, 0.42, 0.08]}>
        {steps.map((step, idx) => {
          const yPos = -idx * 0.21;
          const isSelected = selectedIdx === idx;
          const isCorrectPosition = isDefused && step.order === idx + 1;

          return (
            <group
              key={step.id}
              position={[0, yPos, 0.02]}
              onClick={(e) => handleRowClick(idx, e)}
            >
              {/* Row Bar Background */}
              <mesh>
                <boxGeometry args={[1.98, 0.16, 0.04]} />
                <meshStandardMaterial
                  color={
                    isCorrectPosition
                      ? "#065f46"
                      : isSelected
                      ? "#854d0e"
                      : "#27272a"
                  }
                  emissive={
                    isCorrectPosition
                      ? "#10b981"
                      : isSelected
                      ? "#eab308"
                      : "#000000"
                  }
                  emissiveIntensity={isSelected ? 0.6 : isCorrectPosition ? 0.4 : 0}
                  roughness={0.4}
                />
              </mesh>

              {/* Step Slot Number [1] .. [5] */}
              <group position={[-0.82, 0, 0.03]}>
                <mesh>
                  <boxGeometry args={[0.18, 0.12, 0.02]} />
                  <meshStandardMaterial color={isSelected ? "#ca8a04" : "#1e293b"} />
                </mesh>
                <Text position={[0, 0, 0.02]} fontSize={0.065} color={isSelected ? "#000000" : "#f59e0b"} fontWeight="bold">
                  {`#${idx + 1}`}
                </Text>
              </group>

              {/* Step Title */}
              <Text
                position={[-0.65, 0, 0.03]}
                fontSize={0.044}
                color={isSelected ? "#fef08a" : isCorrectPosition ? "#a7f3d0" : "#f1f5f9"}
                anchorX="left"
                maxWidth={1.1}
              >
                {step.name}
              </Text>

              {/* Explicit Move UP [â–²] and DOWN [â–¼] Buttons */}
              {!isDefused && (
                <group position={[0.74, 0, 0.03]}>
                  {/* UP Button */}
                  <group position={[-0.08, 0, 0]} onClick={(e) => move(idx, -1, e)}>
                    <mesh>
                      <boxGeometry args={[0.11, 0.12, 0.02]} />
                      <meshStandardMaterial
                        color={idx === 0 ? "#3f3f46" : "#0284c7"}
                        emissive={idx === 0 ? "#000000" : "#0369a1"}
                        emissiveIntensity={0.3}
                      />
                    </mesh>
                    <Text position={[0, 0, 0.02]} fontSize={0.055} color={idx === 0 ? "#71717a" : "#ffffff"} fontWeight="bold">
                      ▲
                    </Text>
                  </group>

                  {/* DOWN Button */}
                  <group position={[0.08, 0, 0]} onClick={(e) => move(idx, 1, e)}>
                    <mesh>
                      <boxGeometry args={[0.11, 0.12, 0.02]} />
                      <meshStandardMaterial
                        color={idx === steps.length - 1 ? "#3f3f46" : "#0284c7"}
                        emissive={idx === steps.length - 1 ? "#000000" : "#0369a1"}
                        emissiveIntensity={0.3}
                      />
                    </mesh>
                    <Text position={[0, 0, 0.02]} fontSize={0.055} color={idx === steps.length - 1 ? "#71717a" : "#ffffff"} fontWeight="bold">
                      ▼
                    </Text>
                  </group>
                </group>
              )}
            </group>
          );
        })}
      </group>

      {/* Lock Sequence Button */}
      <group position={[0, -0.66, 0.1]} onClick={(e) => verify(e)}>
        <mesh>
          <boxGeometry args={[1.7, 0.18, 0.04]} />
          <meshStandardMaterial
            color={isDefused ? "#059669" : "#10b981"}
            emissive={isDefused ? "#10b981" : "#059669"}
            emissiveIntensity={isDefused ? 1.0 : 0.3}
            roughness={0.2}
          />
        </mesh>
        <Text position={[0, 0, 0.03]} fontSize={0.065} color="#ffffff" fontWeight="bold">
          {isDefused ? "URUTAN PIPELINE VALID ✓" : "KUNCI URUTAN PIPELINE (LOCK)"}
        </Text>
      </group>
    </group>
  );
};
