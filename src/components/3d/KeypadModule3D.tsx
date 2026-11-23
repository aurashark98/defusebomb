import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { ConfusionMatrixData } from '../../types/game';
import { sound } from '../../utils/audio';

interface KeypadModule3DProps {
  matrixData: ConfusionMatrixData;
  isDefused: boolean;
  onSolve: () => void;
  onStrike: (explanation: string) => void;
}

export const KeypadModule3D: React.FC<KeypadModule3DProps> = ({
  matrixData,
  isDefused,
  onSolve,
  onStrike
}) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handlePress = (key: string, e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (isDefused) return;
    sound.playKeypadClick();

    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150);

    if (key === 'CLR') {
      setPinInput('');
      return;
    }

    if (key === 'ENT') {
      if (!pinInput) return;
      const num = parseInt(pinInput, 10);
      const isMatch = Math.abs(num - matrixData.correctAnswer) <= (matrixData.tolerance || 0);
      if (isMatch) {
        onSolve();
      } else {
        onStrike(`KODE SALAH! Target ${matrixData.targetMetricLabel} bernilai ${matrixData.correctAnswer}%.`);
        setPinInput('');
      }
      return;
    }

    if (pinInput.length < 3) {
      setPinInput(prev => prev + key);
    }
  };

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['CLR', '0', 'ENT']
  ];

  return (
    <group>
      {/* Module Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 1.8, 0.12]} />
        <meshStandardMaterial color="#1c1c1f" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Mini Confusion Matrix display on left */}
      <group position={[-0.55, 0.15, 0.08]}>
        <mesh>
          <boxGeometry args={[0.95, 1.05, 0.04]} />
          <meshStandardMaterial color="#09090b" />
        </mesh>
        <Text position={[0, 0.42, 0.03]} fontSize={0.06} color="#fbbf24">
          CONFUSION MATRIX
        </Text>
        <Text position={[-0.22, 0.18, 0.03]} fontSize={0.065} color="#34d399">
          {`TP=${matrixData.tp}`}
        </Text>
        <Text position={[0.22, 0.18, 0.03]} fontSize={0.065} color="#f59e0b">
          {`FN=${matrixData.fn}`}
        </Text>
        <Text position={[-0.22, -0.08, 0.03]} fontSize={0.065} color="#ef4444">
          {`FP=${matrixData.fp}`}
        </Text>
        <Text position={[0.22, -0.08, 0.03]} fontSize={0.065} color="#94a3b8">
          {`TN=${matrixData.tn}`}
        </Text>

        <Text position={[0, -0.36, 0.03]} fontSize={0.055} color="#38bdf8">
          {`HITUNG: ${matrixData.targetMetricLabel}`}
        </Text>
      </group>

      {/* Digital Screen on Top Right */}
      <group position={[0.55, 0.58, 0.08]}>
        <mesh>
          <boxGeometry args={[0.85, 0.28, 0.04]} />
          <meshStandardMaterial color="#050505" />
        </mesh>
        <Text position={[0, 0, 0.03]} fontSize={0.16} color="#10b981">
          {pinInput ? `${pinInput}%` : '_ _ %'}
        </Text>
      </group>

      {/* 3D Keypad Buttons on Right */}
      <group position={[0.55, 0.05, 0.08]}>
        {keys.map((row, rIdx) => (
          <group key={rIdx} position={[0, -rIdx * 0.22, 0]}>
            {row.map((k, cIdx) => {
              const xPos = (cIdx - 1) * 0.28;
              const isPressed = pressedKey === k;
              const isEnt = k === 'ENT';
              const isClr = k === 'CLR';

              return (
                <group
                  key={k}
                  position={[xPos, 0, isPressed ? 0.01 : 0.03]}
                  onClick={(e) => handlePress(k, e)}
                >
                  <mesh>
                    <boxGeometry args={[0.24, 0.18, 0.05]} />
                    <meshStandardMaterial
                      color={isEnt ? "#059669" : isClr ? "#dc2626" : "#27272a"}
                      roughness={0.4}
                    />
                  </mesh>
                  <Text
                    position={[0, 0, 0.03]}
                    fontSize={isEnt || isClr ? 0.06 : 0.08}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {k}
                  </Text>
                </group>
              );
            })}
          </group>
        ))}
      </group>
    </group>
  );
};
