import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { DefusalModule } from '../../types/game';
import { ModuleSlot3D } from './ModuleSlot3D';
import { TimerModule3D } from './TimerModule3D';
import { WireModule3D } from './WireModule3D';
import { KeypadModule3D } from './KeypadModule3D';
import { TerminalModule3D } from './TerminalModule3D';
import { DialModule3D } from './DialModule3D';
import { SequenceModule3D } from './SequenceModule3D';
import { TacticalModule3D } from './TacticalModule3D';

interface BombCase3DProps {
  modules: DefusalModule[];
  selectedModuleIndex: number;
  onSelectModule: (index: number) => void;
  timeLeft: number;
  strikes: number;
  maxStrikes: number;
  onSolveModule: (index: number) => void;
  onStrike: (explanation: string) => void;
  isInteractive: boolean;
}

export const BombCase3D: React.FC<BombCase3DProps> = ({
  modules,
  selectedModuleIndex,
  onSelectModule,
  timeLeft,
  strikes,
  maxStrikes,
  onSolveModule,
  onStrike,
  isInteractive,
}) => {
  const caseGroupRef = useRef<THREE.Group>(null);
  const leftLatchRef = useRef<THREE.Group>(null);
  const rightLatchRef = useRef<THREE.Group>(null);
  const bezelLightRef = useRef<THREE.PointLight>(null);

  // Animate latches, settling bump, and power LEDs
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Mechanical Latches pop open when interactive
    const targetLatchRot = isInteractive ? -Math.PI / 2.5 : 0;
    if (leftLatchRef.current) {
      leftLatchRef.current.rotation.x = THREE.MathUtils.lerp(
        leftLatchRef.current.rotation.x,
        targetLatchRot,
        delta * 10
      );
    }
    if (rightLatchRef.current) {
      rightLatchRef.current.rotation.x = THREE.MathUtils.lerp(
        rightLatchRef.current.rotation.x,
        targetLatchRot,
        delta * 10
      );
    }

    // 2. Bezel diagnostic pulse light
    if (bezelLightRef.current) {
      bezelLightRef.current.intensity = isInteractive
        ? Math.sin(t * 8) * 0.4 + 1.2
        : 0.1;
    }

    // 3. Subtle breathing / power-on hover when interactive
    if (caseGroupRef.current) {
      const targetY = isInteractive ? Math.sin(t * 2) * 0.015 : 0;
      caseGroupRef.current.position.y = THREE.MathUtils.lerp(
        caseGroupRef.current.position.y,
        targetY,
        delta * 5
      );
    }
  });

  const handleSolve = (idx: number) => {
    if (!isInteractive) return;
    onSolveModule(idx);
  };

  const handleStrike = (explanation: string) => {
    if (!isInteractive) return;
    onStrike(explanation);
  };

  const handleSelect = (idx: number) => {
    if (!isInteractive) return;
    onSelectModule(idx);
  };

  // 3 columns x 2 rows
  const slotPositions: [number, number, number][] = [
    // FRONT FACE (Z = +1.12)
    [-2.5, 1.05, 1.12],   // Slot 0: Master Timer
    [0, 1.05, 1.12],      // Slot 1: Module 0 (Wires Imputasi)
    [2.5, 1.05, 1.12],    // Slot 2: Module 1 (EDA Multikolinearitas)
    [-2.5, -1.05, 1.12],  // Slot 3: Module 2 (Confusion Matrix Keypad)
    [0, -1.05, 1.12],     // Slot 4: Module 3 (Terminal CRT Fix)
    [2.5, -1.05, 1.12],   // Slot 5: Module 4 (Wires High Cardinality)

    // BACK FACE (Z = -1.12, rotated 180 deg around Y)
    [-2.5, 1.05, -1.12],  // Back Slot 0: Module 5 (Tuning Dial L1/L2)
    [0, 1.05, -1.12],     // Back Slot 1: Module 6 (Pipeline Sequence)
    [2.5, 1.05, -1.12],   // Back Slot 2: Module 7 (Tactical Recall)
    [-2.5, -1.05, -1.12], // Back Slot 3: Battery Pack / Serial Plate
    [0, -1.05, -1.12],    // Back Slot 4: Microcontroller PCB
    [2.5, -1.05, -1.12],  // Back Slot 5: High Voltage Capacitor
  ];

  const renderModuleContent = (mod: DefusalModule, idx: number) => {
    switch (mod.type) {
      case 'cut-wire':
        return mod.wires ? (
          <WireModule3D
            wires={mod.wires}
            isDefused={mod.isDefused}
            onSolve={() => handleSolve(idx)}
            onStrike={handleStrike}
          />
        ) : null;
      case 'confusion-matrix':
        return mod.matrixData ? (
          <KeypadModule3D
            matrixData={mod.matrixData}
            isDefused={mod.isDefused}
            onSolve={() => handleSolve(idx)}
            onStrike={handleStrike}
          />
        ) : null;
      case 'terminal-fix':
        return mod.terminalData ? (
          <TerminalModule3D
            context={mod.terminalData.context}
            brokenCode={mod.terminalData.brokenCode}
            options={mod.terminalData.options}
            isDefused={mod.isDefused}
            onSolve={() => handleSolve(idx)}
            onStrike={handleStrike}
          />
        ) : null;
      case 'tuning-dial':
        return mod.dialData ? (
          <DialModule3D
            dialData={mod.dialData}
            isDefused={mod.isDefused}
            onSolve={() => handleSolve(idx)}
            onStrike={handleStrike}
          />
        ) : null;
      case 'pipeline-sequence':
        return mod.pipelineSteps ? (
          <SequenceModule3D
            initialSteps={mod.pipelineSteps}
            isDefused={mod.isDefused}
            onSolve={() => handleSolve(idx)}
            onStrike={handleStrike}
          />
        ) : null;
      case 'tactical-choice':
        return mod.tacticalOptions ? (
          <TacticalModule3D
            options={mod.tacticalOptions}
            isDefused={mod.isDefused}
            onSolve={() => handleSolve(idx)}
            onStrike={handleStrike}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <group ref={caseGroupRef} position={[0, 0, 0]}>
      {/* Heavy Military Suitcase Main Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[8.0, 4.6, 2.2]} />
        <meshStandardMaterial
          color="#121214"
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>

      {/* Top Carry Handle */}
      <group position={[0, 2.45, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.5, 0.2, 0.4]} />
          <meshStandardMaterial color="#27272a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-1.1, -0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
          <meshStandardMaterial color="#52525b" metalness={0.9} />
        </mesh>
        <mesh position={[1.1, -0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
          <meshStandardMaterial color="#52525b" metalness={0.9} />
        </mesh>
      </group>

      {/* ================= ANIMATED MECHANICAL TOGGLE LATCHES ================= */}
      {/* Left Front Latch */}
      <group ref={leftLatchRef} position={[-2.8, 2.32, 1.12]}>
        {/* Latch base plate */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.45, 0.12, 0.08]} />
          <meshStandardMaterial color="#71717a" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Latch toggle lever (flips open when interactive) */}
        <mesh position={[0, 0.12, 0.05]}>
          <boxGeometry args={[0.35, 0.24, 0.04]} />
          <meshStandardMaterial
            color={isInteractive ? "#eab308" : "#a1a1aa"}
            metalness={0.95}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Right Front Latch */}
      <group ref={rightLatchRef} position={[2.8, 2.32, 1.12]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.45, 0.12, 0.08]} />
          <meshStandardMaterial color="#71717a" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.12, 0.05]}>
          <boxGeometry args={[0.35, 0.24, 0.04]} />
          <meshStandardMaterial
            color={isInteractive ? "#eab308" : "#a1a1aa"}
            metalness={0.95}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Glowing Power Bezel LED Strip on top rim */}
      <group position={[0, 2.31, 1.12]}>
        <mesh>
          <boxGeometry args={[4.2, 0.06, 0.02]} />
          <meshStandardMaterial
            color={isInteractive ? "#38bdf8" : "#27272a"}
            emissive={isInteractive ? "#0284c7" : "#000000"}
            emissiveIntensity={isInteractive ? 2.5 : 0}
          />
        </mesh>
        <pointLight
          ref={bezelLightRef}
          position={[0, 0.1, 0.2]}
          distance={3.5}
          color="#38bdf8"
        />
      </group>

      {/* Reinforced Corner Bumpers */}
      {[
        [-3.9, 2.2, 1.0], [3.9, 2.2, 1.0],
        [-3.9, -2.2, 1.0], [3.9, -2.2, 1.0],
        [-3.9, 2.2, -1.0], [3.9, 2.2, -1.0],
        [-3.9, -2.2, -1.0], [3.9, -2.2, -1.0]
      ].map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial
            color={isInteractive ? "#facc15" : "#ca8a04"}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
      ))}

      {/* ================= ACTIVE HOLOGRAPHIC TARGETING CORNER BRACKETS ================= */}
      {isInteractive && (
        <group position={[0, 0, 1.25]}>
          {/* Top-Left Bracket */}
          <group position={[-3.85, 2.15, 0]}>
            <mesh position={[0.2, 0, 0]}>
              <boxGeometry args={[0.4, 0.03, 0.01]} />
              <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={3} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[0.03, 0.4, 0.01]} />
              <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={3} />
            </mesh>
          </group>

          {/* Top-Right Bracket */}
          <group position={[3.85, 2.15, 0]}>
            <mesh position={[-0.2, 0, 0]}>
              <boxGeometry args={[0.4, 0.03, 0.01]} />
              <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={3} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[0.03, 0.4, 0.01]} />
              <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={3} />
            </mesh>
          </group>

          {/* Bottom-Left Bracket */}
          <group position={[-3.85, -2.15, 0]}>
            <mesh position={[0.2, 0, 0]}>
              <boxGeometry args={[0.4, 0.03, 0.01]} />
              <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={3} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.03, 0.4, 0.01]} />
              <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={3} />
            </mesh>
          </group>

          {/* Bottom-Right Bracket */}
          <group position={[3.85, -2.15, 0]}>
            <mesh position={[-0.2, 0, 0]}>
              <boxGeometry args={[0.4, 0.03, 0.01]} />
              <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={3} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.03, 0.4, 0.01]} />
              <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={3} />
            </mesh>
          </group>
        </group>
      )}

      {/* Side Serial Number Plate */}
      <group position={[4.01, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 0.6, 0.02]} />
          <meshStandardMaterial color="#e4e4e7" metalness={0.9} roughness={0.1} />
        </mesh>
        <Text position={[0, 0.08, 0.02]} fontSize={0.12} color="#000000" fontWeight="bold">
          SN: AI-8409-X
        </Text>
        <Text position={[0, -0.12, 0.02]} fontSize={0.07} color="#52525b">
          NEURAL DETONATOR // 2026
        </Text>
      </group>

      {/* Left Side Air Vent */}
      <group position={[-4.01, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {[-0.6, -0.3, 0, 0.3, 0.6].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]}>
            <boxGeometry args={[1.4, 0.08, 0.02]} />
            <meshStandardMaterial color="#09090b" />
          </mesh>
        ))}
      </group>

      {/* ================= FRONT FACE SLOTS ================= */}
      {/* Slot 0: 3D Master Timer */}
      <group position={slotPositions[0]}>
        <TimerModule3D
          timeLeft={timeLeft}
          strikes={strikes}
          maxStrikes={maxStrikes}
        />
      </group>

      {/* Front Face: Modules 0 to 4 */}
      {modules.slice(0, 5).map((mod, idx) => {
        const slotPos = slotPositions[idx + 1];
        const isSelected = selectedModuleIndex === idx;

        return (
          <group key={mod.id} position={slotPos}>
            <ModuleSlot3D
              id={mod.id}
              isDefused={mod.isDefused}
              isSelected={isSelected}
              onSelect={() => handleSelect(idx)}
            >
              {renderModuleContent(mod, idx)}
            </ModuleSlot3D>
          </group>
        );
      })}

      {/* ================= BACK FACE SLOTS ================= */}
      {/* Back Face: Modules 5 to 7 (Rotated 180 deg around Y) */}
      {modules.slice(5).map((mod, offsetIdx) => {
        const globalIdx = 5 + offsetIdx;
        const slotPos = slotPositions[6 + offsetIdx];
        const isSelected = selectedModuleIndex === globalIdx;

        return (
          <group key={mod.id} position={slotPos} rotation={[0, Math.PI, 0]}>
            <ModuleSlot3D
              id={mod.id}
              isDefused={mod.isDefused}
              isSelected={isSelected}
              onSelect={() => handleSelect(globalIdx)}
            >
              {renderModuleContent(mod, globalIdx)}
            </ModuleSlot3D>
          </group>
        );
      })}

      {/* Decorative Back Face Extra Props */}
      <group position={slotPositions[9]} rotation={[0, Math.PI, 0]}>
        <mesh position={[-0.45, 0, 0.08]}>
          <cylinderGeometry args={[0.3, 0.3, 1.4, 24]} />
          <meshStandardMaterial color="#2563eb" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.45, 0, 0.08]}>
          <cylinderGeometry args={[0.3, 0.3, 1.4, 24]} />
          <meshStandardMaterial color="#2563eb" metalness={0.7} roughness={0.3} />
        </mesh>
        <Text position={[0, 0.8, 0.08]} fontSize={0.08} color="#93c5fd" fontWeight="bold">
          BATTERY PACK (14.8V DUAL)
        </Text>
      </group>

      <group position={slotPositions[10]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.2, 1.8, 0.1]} />
          <meshStandardMaterial color="#064e3b" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[0.9, 0.9, 0.06]} />
          <meshStandardMaterial color="#18181b" metalness={0.9} />
        </mesh>
        <Text position={[0, 0, 0.12]} fontSize={0.09} color="#34d399">
          AI TENSOR-V3
        </Text>
      </group>

      <group position={slotPositions[11]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.2, 1.8, 0.1]} />
          <meshStandardMaterial color="#18181b" metalness={0.7} />
        </mesh>
        {[-0.5, 0.5].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.15]}>
            <cylinderGeometry args={[0.35, 0.35, 1.2, 24]} />
            <meshStandardMaterial color="#7f1d1d" metalness={0.6} />
          </mesh>
        ))}
        <Text position={[0, 0.72, 0.08]} fontSize={0.08} color="#ef4444" fontWeight="bold">
          DANGER: HIGH VOLTAGE
        </Text>
      </group>
    </group>
  );
};
