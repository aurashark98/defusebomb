import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface HostageRoomProps {
  hasKey: boolean;
  isChestOpen: boolean;
  hasHintPaper: boolean;
  hasFlashlight: boolean;
  onPickUpKey: () => void;
  onInteractChest: () => void;
  onPickUpHintPaper: () => void;
  onPickUpFlashlight: () => void;
  playerPos: [number, number, number];
}

export const HostageRoom: React.FC<HostageRoomProps> = ({
  hasKey,
  isChestOpen,
  hasHintPaper,
  hasFlashlight,
  onPickUpKey,
  onInteractChest,
  onPickUpHintPaper,
  onPickUpFlashlight,
  playerPos
}) => {
  const hangingLampRef = useRef<THREE.Group>(null);
  const fanRef = useRef<THREE.Group>(null);
  const keyGlowRef = useRef<THREE.PointLight>(null);
  const chestGlowRef = useRef<THREE.PointLight>(null);
  const doorWheelRef = useRef<THREE.Group>(null);
  const hostageChestRef = useRef<THREE.Group>(null);
  const hostageHeadRef = useRef<THREE.Group>(null);
  const warningBeaconRef = useRef<THREE.PointLight>(null);

  // Distances for interaction & proximity prompts (exact gameplay coordinates preserved)
  const distToKey = Math.hypot(playerPos[0] - 7.5, playerPos[2] - 1.5);
  const distToChest = Math.hypot(playerPos[0] - (-7.5), playerPos[2] - (-4.2));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Overhead swinging interrogation lamp (cinematic tension)
    if (hangingLampRef.current) {
      hangingLampRef.current.rotation.z = Math.sin(t * 0.85) * 0.035;
      hangingLampRef.current.rotation.x = Math.cos(t * 0.65) * 0.02;
    }

    // 2. Rotating ventilation fan
    if (fanRef.current) {
      fanRef.current.rotation.z += 0.075;
    }

    // 3. Key pulsing golden glow
    if (keyGlowRef.current) {
      keyGlowRef.current.intensity = Math.sin(t * 4.5) * 0.5 + 1.3;
    }

    // 4. Secret chest beacon light
    if (chestGlowRef.current) {
      chestGlowRef.current.intensity = isChestOpen ? 1.6 : Math.sin(t * 3) * 0.4 + 0.9;
    }

    // 5. Hostage subtle breathing animation (realistic tension)
    if (hostageChestRef.current) {
      const breath = Math.sin(t * 1.8) * 0.015;
      hostageChestRef.current.position.y = breath;
      hostageChestRef.current.scale.set(1 + breath * 0.8, 1 + breath, 1 + breath * 0.6);
    }
    if (hostageHeadRef.current) {
      hostageHeadRef.current.rotation.x = Math.sin(t * 1.8) * 0.025 + 0.15; // weary forward head tilt
    }

    // 6. Emergency red wall flasher pulse
    if (warningBeaconRef.current) {
      warningBeaconRef.current.intensity = Math.sin(t * 6) * 0.7 + 1.2;
    }
  });

  return (
    <group>
      {/* ================= FLOOR & TACTICAL WORKSPACE PERIMETER ================= */}
      {/* Heavy Industrial Concrete Base Floor */}
      <mesh position={[0, -4.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 24]} />
        <meshStandardMaterial color="#131417" roughness={0.82} metalness={0.25} />
      </mesh>

      {/* Concrete Tile Expansion Joint Grid Seams */}
      <gridHelper position={[0, -4.09, 0]} args={[24, 12, '#3f3f46', '#1f2228']} />

      {/* Yellow/Black Painted Hazard Boundary around Central Bomb Station */}
      <group position={[0, -4.08, 0]}>
        {/* Anti-Static Workspace Floor Mat */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[13.4, 7.8]} />
          <meshStandardMaterial color="#1a1c22" roughness={0.7} metalness={0.3} />
        </mesh>
        
        {/* Perimeter Caution Yellow Hazard Curb Strips */}
        {/* Front Strip */}
        <mesh position={[0, 0.005, 3.9]}>
          <boxGeometry args={[13.4, 0.01, 0.2]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Back Strip */}
        <mesh position={[0, 0.005, -3.9]}>
          <boxGeometry args={[13.4, 0.01, 0.2]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Left Strip */}
        <mesh position={[-6.7, 0.005, 0]}>
          <boxGeometry args={[0.2, 0.01, 7.8]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Right Strip */}
        <mesh position={[6.7, 0.005, 0]}>
          <boxGeometry args={[0.2, 0.01, 7.8]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* Industrial Drainage Pit Grate in Front Corner */}
      <group position={[9.2, -4.08, 7.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.2, 1.4]} />
          <meshStandardMaterial color="#090a0f" roughness={0.9} />
        </mesh>
        {[-0.8, -0.4, 0, 0.4, 0.8].map((gx, gi) => (
          <mesh key={gi} position={[gx, 0.006, 0]}>
            <boxGeometry args={[0.04, 0.01, 1.4]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ================= ROOM WALLS & MILITARY FACILITY BUTTRESSES ================= */}
      {/* Back Wall */}
      <mesh position={[0, 2.5, -6.5]} receiveShadow>
        <planeGeometry args={[26, 14]} />
        <meshStandardMaterial color="#16181d" roughness={0.88} metalness={0.18} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-11.0, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[24, 14]} />
        <meshStandardMaterial color="#121317" roughness={0.9} metalness={0.15} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[11.0, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[24, 14]} />
        <meshStandardMaterial color="#121317" roughness={0.9} metalness={0.15} />
      </mesh>

      {/* Front Wall (Enclosing Behind Player) */}
      <mesh position={[0, 2.5, 9.2]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[26, 14]} />
        <meshStandardMaterial color="#111216" roughness={0.9} metalness={0.15} />
      </mesh>

      {/* Heavy Steel Wall Baseboards / Kickplates along Perimeter */}
      <mesh position={[0, -3.95, -6.48]}>
        <boxGeometry args={[26, 0.3, 0.05]} />
        <meshStandardMaterial color="#27272a" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[-10.98, -3.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[24, 0.3, 0.05]} />
        <meshStandardMaterial color="#27272a" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[10.98, -3.95, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[24, 0.3, 0.05]} />
        <meshStandardMaterial color="#27272a" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Structural Steel Support Columns (Pillars) in Corners */}
      {[
        [-10.8, 2.5, -6.3], [10.8, 2.5, -6.3],
        [-10.8, 2.5, 9.0], [10.8, 2.5, 9.0]
      ].map(([px, py, pz], pi) => (
        <group key={pi} position={[px, py, pz]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.7, 13.5, 0.7]} />
            <meshStandardMaterial color="#27272a" metalness={0.85} roughness={0.3} />
          </mesh>
          {/* Yellow Warning Chevron Collar Band */}
          <mesh position={[0, -1.8, 0]}>
            <boxGeometry args={[0.72, 0.6, 0.72]} />
            <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Wall Stencil Label */}
      <group position={[-5.8, 1.8, -6.48]}>
        <Text fontSize={0.24} color="#eab308" fontWeight="black" letterSpacing={0.1}>
          SECTOR-04 // ORDNANCE DISPOSAL
        </Text>
        <Text position={[0, -0.3, 0]} fontSize={0.13} color="#71717a" fontWeight="bold">
          SECURITY LEVEL: MAXIMUM ISOLATION
        </Text>
      </group>

      {/* High-Voltage Junction Box on Right Wall */}
      <group position={[10.9, 0.8, -2.8]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 1.6, 0.35]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.18]}>
          <boxGeometry args={[1.1, 1.5, 0.02]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} />
        </mesh>
        {/* Blinking Diagnostic Power LED */}
        <mesh position={[-0.35, 0.55, 0.2]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={3.5} />
        </mesh>
        <Text position={[0.05, 0.55, 0.2]} fontSize={0.065} color="#e2e8f0" fontWeight="bold">
          MAIN POWER: ONLINE
        </Text>
        {/* Yellow Danger Warning Triangle */}
        <mesh position={[0, 0.05, 0.2]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.18, 0.3, 3]} />
          <meshStandardMaterial color="#eab308" metalness={0.7} />
        </mesh>
        {/* Conduit Pipes leading down to floor */}
        {[-0.2, 0, 0.2].map((cx, ci) => (
          <mesh key={ci} position={[cx, -1.8, 0.08]}>
            <cylinderGeometry args={[0.03, 0.03, 2.2, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ================= CEILING, HEAVY I-BEAMS & VENTILATION ================= */}
      {/* Ceiling Plane */}
      <mesh position={[0, 8.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 24]} />
        <meshStandardMaterial color="#090a0f" roughness={0.92} />
      </mesh>

      {/* Heavy Structural Steel I-Beams across Ceiling */}
      {[-4, 0, 4].map((bz, bi) => (
        <group key={bi} position={[0, 7.8, bz]}>
          {/* Main Web */}
          <mesh castShadow>
            <boxGeometry args={[26, 0.45, 0.3]} />
            <meshStandardMaterial color="#1e2126" metalness={0.9} roughness={0.25} />
          </mesh>
          {/* Lower Flange */}
          <mesh position={[0, -0.25, 0]}>
            <boxGeometry args={[26, 0.12, 0.7]} />
            <meshStandardMaterial color="#2d3139" metalness={0.9} roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* Overhead Cable Trays */}
      <group position={[0, 7.2, 2.0]}>
        <mesh>
          <boxGeometry args={[26, 0.08, 0.6]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Bundled Heavy Electrical Cables */}
        <mesh position={[0, 0.08, -0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 26, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 26, 12]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.08, 0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 26, 12]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} />
        </mesh>
      </group>

      {/* Industrial Air Vent with Rotating Fan */}
      <group position={[7.5, 3.2, -6.4]}>
        <mesh>
          <boxGeometry args={[1.9, 1.9, 0.12]} />
          <meshStandardMaterial color="#18181b" metalness={0.85} roughness={0.3} />
        </mesh>
        {/* Grate Outer Ring */}
        <mesh position={[0, 0, 0.07]}>
          <ringGeometry args={[0.7, 0.85, 32]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.9} />
        </mesh>
        {/* Rotating 4-Blade Fan */}
        <group ref={fanRef} position={[0, 0, 0.05]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
              <boxGeometry args={[0.22, 1.45, 0.02]} />
              <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.2} />
            </mesh>
          ))}
        </group>
        {/* Safety Mesh Grill Bars */}
        {[-0.4, 0, 0.4].map((vx, vi) => (
          <mesh key={vi} position={[vx, 0, 0.1]}>
            <cylinderGeometry args={[0.012, 0.012, 1.6, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} />
          </mesh>
        ))}
      </group>

      {/* Industrial Overhead Steel Conduit Pipes */}
      <group position={[0, 6.2, -6.1]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 24, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.88} roughness={0.25} />
        </mesh>
      </group>
      <group position={[0, 5.6, -6.1]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 24, 16]} />
          <meshStandardMaterial color="#eab308" metalness={0.75} roughness={0.3} />
        </mesh>
      </group>

      {/* Red Emergency Warning Flasher Light on Back Wall */}
      <group position={[-5.8, 3.4, -6.4]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 0.08, 16]} />
          <meshStandardMaterial color="#27272a" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.5} />
        </mesh>
        <pointLight ref={warningBeaconRef} position={[0, 0, 0.35]} distance={9} intensity={1.5} color="#ef4444" />
      </group>

      {/* ================= REINFORCED OPERATION TABLE (WORKBENCH) ================= */}
      {/* Position: [0, -2.4, 0] */}
      <group position={[0, -2.4, 0]}>
        {/* Main Wood Table Top (Warm Dark Walnut Core) */}
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[11.0, 0.3, 4.6]} />
          <meshStandardMaterial color="#2b1a10" roughness={0.65} metalness={0.2} />
        </mesh>

        {/* Anti-Static ESD Rubber Work Mat in Center (Under Bomb Case) */}
        <mesh position={[0, 0.155, 0]} receiveShadow>
          <boxGeometry args={[9.2, 0.02, 3.8]} />
          <meshStandardMaterial color="#18181b" roughness={0.85} metalness={0.1} />
        </mesh>
        {/* Rubber Mat Yellow Beveled Outer Trim */}
        <mesh position={[0, 0.16, 1.91]}>
          <boxGeometry args={[9.24, 0.015, 0.04]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.16, -1.91]}>
          <boxGeometry args={[9.24, 0.015, 0.04]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Steel Edge Armor Banding with Rivet Detailing */}
        <mesh position={[0, 0, 2.32]}>
          <boxGeometry args={[11.04, 0.32, 0.05]} />
          <meshStandardMaterial color="#71717a" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0, -2.32]}>
          <boxGeometry args={[11.04, 0.32, 0.05]} />
          <meshStandardMaterial color="#71717a" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[-5.52, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[4.64, 0.32, 0.05]} />
          <meshStandardMaterial color="#71717a" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[5.52, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[4.64, 0.32, 0.05]} />
          <meshStandardMaterial color="#71717a" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Heavy Table Legs with Corner Gusset Brackets & Floor Levelers */}
        {[
          [-5.1, -1.8, 1.9], [5.1, -1.8, 1.9],
          [-5.1, -1.8, -1.9], [5.1, -1.8, -1.9]
        ].map(([x, y, z], idx) => (
          <group key={idx} position={[x, y, z]}>
            {/* Main Leg Column */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.38, 3.4, 0.38]} />
              <meshStandardMaterial color="#27272a" metalness={0.92} roughness={0.25} />
            </mesh>
            {/* Leveler Foot Pad */}
            <mesh position={[0, -1.7, 0]}>
              <cylinderGeometry args={[0.26, 0.26, 0.08, 16]} />
              <meshStandardMaterial color="#18181b" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Lower Storage Shelf between Legs */}
        <mesh position={[0, -2.5, 0]} receiveShadow>
          <boxGeometry args={[9.6, 0.15, 3.4]} />
          <meshStandardMaterial color="#1e2229" metalness={0.85} roughness={0.3} />
        </mesh>

        {/* Clutter Props on Lower Shelf: Heavy Battery Backup Unit */}
        <group position={[-2.8, -2.15, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.8, 0.6, 1.2]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <boxGeometry args={[1.4, 0.08, 0.8]} />
            <meshStandardMaterial color="#eab308" metalness={0.5} />
          </mesh>
        </group>

        {/* Handcuffs on Desk (Left Edge) */}
        <group position={[-4.5, 0.22, 1.4]} rotation={[0, 0.4, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.22, 0.04, 12, 24]} />
            <meshStandardMaterial color="#e4e4e7" metalness={0.96} roughness={0.1} />
          </mesh>
          <mesh position={[0.3, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.22, 0.04, 12, 24]} />
            <meshStandardMaterial color="#e4e4e7" metalness={0.96} roughness={0.1} />
          </mesh>
          {/* Connecting Chain Links */}
          <mesh position={[0.15, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.96} />
          </mesh>
        </group>

        {/* Wire Cutters on Desk (Right Edge) */}
        <group position={[4.2, 0.2, 0.8]} rotation={[0, -0.3, 0]}>
          {/* Red Rubberized Handles */}
          <mesh position={[-0.14, 0.04, 0]} rotation={[0, 0, 0.22]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1.1, 12]} />
            <meshStandardMaterial color="#dc2626" roughness={0.35} />
          </mesh>
          <mesh position={[0.14, 0.04, 0]} rotation={[0, 0, -0.22]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1.1, 12]} />
            <meshStandardMaterial color="#dc2626" roughness={0.35} />
          </mesh>
          {/* Steel Jaw Blades */}
          <mesh position={[0, 0.04, -0.65]} castShadow>
            <boxGeometry args={[0.24, 0.08, 0.35]} />
            <meshStandardMaterial color="#f4f4f5" metalness={0.95} roughness={0.12} />
          </mesh>
          {/* Pivot Hinge Pin */}
          <mesh position={[0, 0.08, -0.45]}>
            <cylinderGeometry args={[0.04, 0.04, 0.04, 12]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.95} />
          </mesh>
        </group>

        {/* Tactical Multimeter Diagnostic Unit on Desk */}
        <group position={[-3.8, 0.24, -1.2]} rotation={[0, 0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.22, 1.1]} />
            <meshStandardMaterial color="#eab308" metalness={0.3} roughness={0.5} />
          </mesh>
          {/* LCD Screen Display */}
          <mesh position={[0, 0.12, -0.22]}>
            <boxGeometry args={[0.5, 0.02, 0.4]} />
            <meshStandardMaterial color="#064e3b" emissive="#10b981" emissiveIntensity={0.6} roughness={0.2} />
          </mesh>
          {/* Dial Knob */}
          <mesh position={[0, 0.14, 0.25]}>
            <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
            <meshStandardMaterial color="#18181b" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ================= INTERROGATION CHAIR & BOUND HOSTAGE CHARACTER ================= */}
      {/* Position: [0, -3.0, 3.3] (exact chair anchor preserved) */}
      <group position={[0, -3.0, 3.3]}>
        {/* Heavy Metal Chair Seat */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.15, 1.6]} />
          <meshStandardMaterial color="#292524" roughness={0.65} metalness={0.3} />
        </mesh>
        {/* Chair Backrest */}
        <mesh position={[0, 1.0, 0.75]} castShadow>
          <boxGeometry args={[1.5, 1.6, 0.12]} />
          <meshStandardMaterial color="#292524" roughness={0.65} metalness={0.3} />
        </mesh>
        {/* Steel Chair Tubular Legs */}
        {[
          [-0.7, -0.7, 0.7], [0.7, -0.7, 0.7],
          [-0.7, -0.7, -0.7], [0.7, -0.7, -0.7]
        ].map(([x, y, z], idx) => (
          <mesh key={idx} position={[x, y, z]}>
            <cylinderGeometry args={[0.05, 0.05, 1.3, 12]} />
            <meshStandardMaterial color="#52525b" metalness={0.92} roughness={0.2} />
          </mesh>
        ))}

        {/* ── HIGH-QUALITY VISUAL HOSTAGE MODEL (TIED TO CHAIR) ─────────────── */}
        <group position={[0, 0.1, 0]}>
          {/* Seated Lower Body (Cargo Pants) */}
          <group position={[0, 0.15, -0.15]}>
            {/* Pelvis/Hips */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.95, 0.35, 0.8]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            {/* Left Thigh extending forward */}
            <mesh position={[-0.26, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.14, 0.8, 12]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            {/* Right Thigh extending forward */}
            <mesh position={[0.26, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.14, 0.8, 12]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            {/* Left Lower Leg down to floor */}
            <mesh position={[-0.26, -0.5, -0.8]} castShadow>
              <cylinderGeometry args={[0.13, 0.11, 0.85, 12]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            {/* Right Lower Leg down to floor */}
            <mesh position={[0.26, -0.5, -0.8]} castShadow>
              <cylinderGeometry args={[0.13, 0.11, 0.85, 12]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            {/* Combat Boots on Floor */}
            <mesh position={[-0.26, -0.9, -0.92]} castShadow>
              <boxGeometry args={[0.26, 0.22, 0.45]} />
              <meshStandardMaterial color="#18181b" roughness={0.6} metalness={0.2} />
            </mesh>
            <mesh position={[0.26, -0.9, -0.92]} castShadow>
              <boxGeometry args={[0.26, 0.22, 0.45]} />
              <meshStandardMaterial color="#18181b" roughness={0.6} metalness={0.2} />
            </mesh>
          </group>

          {/* Upper Body (Breathing Animated Torso) */}
          <group ref={hostageChestRef} position={[0, 0.9, 0.12]}>
            {/* Torso with Tactical Utility Shirt */}
            <mesh castShadow>
              <boxGeometry args={[1.0, 1.1, 0.55]} />
              <meshStandardMaterial color="#b45309" roughness={0.85} />
            </mesh>
            {/* Tactical Body Vest */}
            <mesh position={[0, 0, 0.05]} castShadow>
              <boxGeometry args={[1.05, 0.95, 0.58]} />
              <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </mesh>
            {/* Ropes Binding Torso to Backrest */}
            {[-0.2, 0.1, 0.35].map((ry, ri) => (
              <mesh key={ri} position={[0, ry, 0.04]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.58, 0.035, 8, 24]} />
                <meshStandardMaterial color="#78350f" roughness={0.9} />
              </mesh>
            ))}

            {/* Shoulders & Bound Arms behind Chair */}
            {/* Left Arm bound behind */}
            <mesh position={[-0.56, 0.2, 0.25]} rotation={[0.4, 0, 0.2]} castShadow>
              <cylinderGeometry args={[0.12, 0.11, 0.8, 10]} />
              <meshStandardMaterial color="#b45309" roughness={0.85} />
            </mesh>
            {/* Right Arm bound behind */}
            <mesh position={[0.56, 0.2, 0.25]} rotation={[0.4, 0, -0.2]} castShadow>
              <cylinderGeometry args={[0.12, 0.11, 0.8, 10]} />
              <meshStandardMaterial color="#b45309" roughness={0.85} />
            </mesh>
            {/* Metallic Handcuffs Binding Wrists Behind Chair */}
            <mesh position={[0, -0.2, 0.65]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.35, 12]} />
              <meshStandardMaterial color="#e4e4e7" metalness={0.95} roughness={0.15} />
            </mesh>

            {/* Neck & Head with Blindfold */}
            <group ref={hostageHeadRef} position={[0, 0.82, 0]}>
              {/* Neck */}
              <mesh position={[0, -0.15, 0]}>
                <cylinderGeometry args={[0.12, 0.14, 0.25, 12]} />
                <meshStandardMaterial color="#d4a373" roughness={0.6} />
              </mesh>
              {/* Head */}
              <mesh castShadow>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color="#d4a373" roughness={0.6} />
              </mesh>
              {/* Dark Disheveled Hair */}
              <mesh position={[0, 0.15, -0.05]}>
                <sphereGeometry args={[0.31, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
                <meshStandardMaterial color="#18181b" roughness={0.9} />
              </mesh>
              {/* Tactical Cloth Blindfold / Bandana */}
              <mesh position={[0, 0.05, 0.02]} rotation={[0.1, 0, 0]}>
                <boxGeometry args={[0.62, 0.18, 0.62]} />
                <meshStandardMaterial color="#eab308" roughness={0.7} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Chair Interactive Prompt Label */}
        <Text position={[0, 0.2, -0.9]} fontSize={0.13} color="#fbbf24" fontWeight="bold">
          [Q] KURSI INTEROGASI
        </Text>
      </group>

      {/* ================= HEAVY REINFORCED BLAST DOOR (GTA BUNKER STYLE) ================= */}
      {/* Position: [-1.8, -1.2, -6.42] */}
      <group position={[-1.8, -1.2, -6.42]}>
        {/* Door Recess Outer Frame */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[3.6, 6.2, 0.3]} />
          <meshStandardMaterial color="#090a0f" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Steel Beveled Door Frame with Hazard Warning Trim */}
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[3.2, 5.8, 0.2]} />
          <meshStandardMaterial color="#27272a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Inner Door Slab (Heavy Blast Steel Plate) */}
        <mesh position={[0, -0.05, 0.15]} castShadow receiveShadow>
          <boxGeometry args={[2.7, 5.3, 0.14]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.88} roughness={0.3} />
        </mesh>

        {/* Cross-Braced Structural Steel Ribs (X Pattern) */}
        <mesh position={[0, 0.8, 0.23]} rotation={[0, 0, 0.45]}>
          <boxGeometry args={[2.6, 0.18, 0.05]} />
          <meshStandardMaterial color="#52525b" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0.8, 0.23]} rotation={[0, 0, -0.45]}>
          <boxGeometry args={[2.6, 0.18, 0.05]} />
          <meshStandardMaterial color="#52525b" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[0, -1.2, 0.23]} rotation={[0, 0, 0.45]}>
          <boxGeometry args={[2.6, 0.18, 0.05]} />
          <meshStandardMaterial color="#52525b" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[0, -1.2, 0.23]} rotation={[0, 0, -0.45]}>
          <boxGeometry args={[2.6, 0.18, 0.05]} />
          <meshStandardMaterial color="#52525b" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Perimeter Rivets */}
        {[-1.2, -0.6, 0, 0.6, 1.2].map((x, xi) => (
          <React.Fragment key={xi}>
            <mesh position={[x, 2.45, 0.24]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 8]} />
              <meshStandardMaterial color="#d4d4d8" metalness={0.96} />
            </mesh>
            <mesh position={[x, -2.55, 0.24]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 8]} />
              <meshStandardMaterial color="#d4d4d8" metalness={0.96} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Reinforced Peephole Window */}
        <group position={[0, 1.6, 0.23]}>
          <mesh>
            <boxGeometry args={[0.8, 0.6, 0.06]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.66, 0.46, 0.02]} />
            <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} transparent opacity={0.65} />
          </mesh>
          {[-0.2, 0, 0.2].map((bx, bi) => (
            <mesh key={bi} position={[bx, 0, 0.04]}>
              <cylinderGeometry args={[0.015, 0.015, 0.46, 8]} />
              <meshStandardMaterial color="#71717a" metalness={0.95} />
            </mesh>
          ))}
        </group>

        {/* Vault Mechanical Turning Wheel Lock */}
        <group ref={doorWheelRef} position={[0.7, -0.2, 0.25]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.12, 16]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.32, 0.04, 12, 24]} />
            <meshStandardMaterial color="#eab308" metalness={0.88} roughness={0.2} />
          </mesh>
          {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((ang, ai) => (
            <mesh key={ai} rotation={[0, 0, ang]}>
              <boxGeometry args={[0.6, 0.04, 0.04]} />
              <meshStandardMaterial color="#71717a" metalness={0.9} />
            </mesh>
          ))}
          <mesh position={[0.45, 0, -0.05]}>
            <cylinderGeometry args={[0.05, 0.05, 0.45, 12]} />
            <meshStandardMaterial color="#e4e4e7" metalness={0.95} />
          </mesh>
        </group>

        {/* Electronic Security Terminal & Keypad Beside Door */}
        <group position={[1.75, 0.2, 0.1]}>
          <mesh>
            <boxGeometry args={[0.35, 0.8, 0.1]} />
            <meshStandardMaterial color="#18181b" metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.25, 0.06]}>
            <circleGeometry args={[0.05, 16]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.2} />
          </mesh>
          <mesh position={[0, -0.08, 0.06]}>
            <planeGeometry args={[0.22, 0.35]} />
            <meshStandardMaterial color="#27272a" />
          </mesh>
          <Text position={[0, -0.32, 0.06]} fontSize={0.055} color="#f87171" fontWeight="bold">
            LOCKED
          </Text>
        </group>

        {/* Overhead Glowing Green EXIT / KELUAR Sign Box */}
        <group position={[0, 3.15, 0.2]}>
          <mesh>
            <boxGeometry args={[1.6, 0.45, 0.18]} />
            <meshStandardMaterial color="#14532d" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.1]}>
            <planeGeometry args={[1.45, 0.35]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2.5} />
          </mesh>
          <Text position={[0, 0, 0.11]} fontSize={0.14} color="#052e16" fontWeight="bold">
            KELUAR // EXIT
          </Text>
          <pointLight position={[0, -0.2, 0.3]} distance={4.5} intensity={1.8} color="#4ade80" />
        </group>

        {/* Warning Stencil on Door Body */}
        <group position={[-0.4, -0.2, 0.23]}>
          <Text position={[0, 0.35, 0]} fontSize={0.09} color="#eab308" fontWeight="bold">
            RESTRICTED AREA // PROTOKOL PENYEKAPAN
          </Text>
          <Text position={[0, 0.18, 0]} fontSize={0.075} color="#ef4444" fontWeight="bold">
            MAXIMUM SECURITY BLAST LOCKDOWN
          </Text>
          <Text position={[0, 0, 0]} fontSize={0.06} color="#a1a1aa">
            JINAKKAN BOM UNTUK MEMBUKA KUNCI PINTU
          </Text>
        </group>

        {/* Steel Diamond Floor Threshold */}
        <mesh position={[0, -2.85, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.2, 0.6]} />
          <meshStandardMaterial color="#52525b" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>

      {/* ================= SECRET CHEST (PETI RAHASIA DI SUDUT LEMARI) ================= */}
      {/* Position: [-7.5, -3.3, -4.2] (exact gameplay coordinates preserved) */}
      <group position={[-7.5, -3.3, -4.2]} onClick={onInteractChest}>
        {/* Steel Storage Cabinet Locker Housing */}
        <group position={[0, 1.2, -0.4]}>
          <mesh position={[0, 0, -0.6]}>
            <boxGeometry args={[2.8, 3.4, 0.1]} />
            <meshStandardMaterial color="#1e293b" metalness={0.82} roughness={0.35} />
          </mesh>
          <mesh position={[-1.35, 0, 0]}>
            <boxGeometry args={[0.1, 3.4, 1.3]} />
            <meshStandardMaterial color="#1e293b" metalness={0.82} roughness={0.35} />
          </mesh>
          <mesh position={[1.35, 0, 0]}>
            <boxGeometry args={[0.1, 3.4, 1.3]} />
            <meshStandardMaterial color="#1e293b" metalness={0.82} roughness={0.35} />
          </mesh>
          <mesh position={[0, 1.65, 0]}>
            <boxGeometry args={[2.8, 0.1, 1.3]} />
            <meshStandardMaterial color="#1e293b" metalness={0.82} roughness={0.35} />
          </mesh>
        </group>

        {/* Chest Heavy Armored Body */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.7, 1.1]} />
          <meshStandardMaterial color="#3b1d11" roughness={0.65} metalness={0.25} />
        </mesh>
        {/* Steel Reinforcement Ribs */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.64, 0.72, 0.12]} />
          <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Chest Hinged Lid */}
        <group position={[0, 0.7, isChestOpen ? -0.5 : 0]} rotation={[isChestOpen ? -1.4 : 0, 0, 0]}>
          <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.55, 0.55, 1.6, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#5a260e" roughness={0.55} />
          </mesh>
        </group>

        {/* Electronic Lock Latch Indicator */}
        <mesh position={[0, 0.6, 0.56]}>
          <boxGeometry args={[0.2, 0.25, 0.08]} />
          <meshStandardMaterial
            color={isChestOpen ? "#10b981" : hasKey ? "#f59e0b" : "#ef4444"}
            emissive={isChestOpen ? "#10b981" : hasKey ? "#f59e0b" : "#ef4444"}
            emissiveIntensity={2.0}
          />
        </mesh>

        {/* Secret Intel Clue Document */}
        {isChestOpen && !hasHintPaper && (
          <group position={[0, 0.45, 0]} onClick={onPickUpHintPaper}>
            <mesh castShadow>
              <boxGeometry args={[1.1, 0.08, 0.8]} />
              <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={0.65} roughness={0.4} />
            </mesh>
            <Text position={[0, 0.1, 0]} fontSize={0.09} color="#1c1917" fontWeight="bold">
              KERTAS HINT PROTOKOL DEFUSAL
            </Text>
          </group>
        )}

        {/* Proximity Prompt */}
        {distToChest < 3.2 && (
          <group position={[0, 1.8, 0]}>
            <Text position={[0, 0.2, 0]} fontSize={0.18} color={isChestOpen ? "#10b981" : hasKey ? "#fbbf24" : "#f87171"}>
              {isChestOpen
                ? (!hasHintPaper
                  ? "[PETI TERBUKA] TEKAN [X] AMBIL KERTAS HINT"
                  : "[PETI TERBUKA] KERTAS HINT SUDAH DIAMBIL [H]")
                : hasKey
                ? "[PUNYA KUNCI] TEKAN [X] BUKA PETI"
                : "[PETI TERKUNCI] CARI KUNCI DI RUANGAN!"}
            </Text>
          </group>
        )}

        <pointLight
          ref={chestGlowRef}
          position={[0, 0.8, 0.4]}
          distance={4.5}
          color={isChestOpen ? "#10b981" : "#f59e0b"}
        />
      </group>

      {/* ================= HIDDEN GOLDEN KEY ON TOOL RACK ================= */}
      {/* Position: [7.5, -1.2, 1.5] (exact gameplay coordinates preserved) */}
      {!hasKey && (
        <group position={[7.5, -1.2, 1.5]} onClick={onPickUpKey}>
          {/* Industrial Slotted Steel Shelving Unit */}
          <group position={[0, -0.6, 0]}>
            <mesh position={[-1.2, 0, 0]} castShadow>
              <boxGeometry args={[0.1, 3.2, 1.2]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[1.2, 0, 0]} castShadow>
              <boxGeometry args={[0.1, 3.2, 1.2]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
            </mesh>
            {[-1.2, 0, 1.2].map((y, i) => (
              <mesh key={i} position={[0, y, 0]} receiveShadow>
                <boxGeometry args={[2.5, 0.08, 1.2]} />
                <meshStandardMaterial color="#1e293b" metalness={0.88} roughness={0.25} />
              </mesh>
            ))}
            {/* Storage Ammo Wooden Crates on Lower Shelf */}
            <mesh position={[-0.5, -0.8, 0]} castShadow>
              <boxGeometry args={[0.8, 0.7, 0.8]} />
              <meshStandardMaterial color="#78350f" roughness={0.75} />
            </mesh>
            <mesh position={[0.5, -0.8, 0]} castShadow>
              <boxGeometry args={[0.7, 0.6, 0.7]} />
              <meshStandardMaterial color="#a16207" roughness={0.75} />
            </mesh>
          </group>

          {/* Golden Key Model */}
          <group position={[0, 0.15, 0]} rotation={[0, 0.5, Math.PI / 2]}>
            <mesh position={[-0.3, 0, 0]}>
              <torusGeometry args={[0.14, 0.03, 12, 24]} />
              <meshStandardMaterial color="#facc15" metalness={0.96} roughness={0.08} emissive="#eab308" emissiveIntensity={0.9} />
            </mesh>
            <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.6, 12]} />
              <meshStandardMaterial color="#facc15" metalness={0.96} roughness={0.08} emissive="#eab308" emissiveIntensity={0.9} />
            </mesh>
            <mesh position={[0.3, -0.06, 0]}>
              <boxGeometry args={[0.12, 0.1, 0.03]} />
              <meshStandardMaterial color="#facc15" metalness={0.96} roughness={0.08} emissive="#eab308" emissiveIntensity={0.9} />
            </mesh>
          </group>

          <pointLight ref={keyGlowRef} position={[0, 0.4, 0]} distance={5.5} color="#facc15" intensity={1.8} />

          {distToKey < 3.2 && (
            <group position={[0, 0.8, 0]}>
              <Text position={[0, 0, 0]} fontSize={0.18} color="#facc15" fontWeight="bold">
                [KUNCI PETI TERSEMBUNYI] TEKAN [X] UNTUK AMBIL
              </Text>
            </group>
          )}
        </group>
      )}

      {/* ================= REFINED INDUSTRIAL CLUTTER & OBSTACLES ================= */}
      {/* 1. Heavy Metal Barrels (Flammable Red, Hazmat Blue, Steel Gray) */}
      <group position={[-8.5, -3.1, 4.0]}>
        {/* Red Flammable Drum */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.65, 0.65, 1.8, 24]} />
            <meshStandardMaterial color="#991b1b" metalness={0.7} roughness={0.35} />
          </mesh>
          {/* Raised Drum Chime Rims */}
          {[-0.85, 0, 0.85].map((ry, ri) => (
            <mesh key={ri} position={[0, 0.9 + ry, 0]}>
              <torusGeometry args={[0.66, 0.03, 8, 24]} />
              <meshStandardMaterial color="#7f1d1d" metalness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Blue Hazmat Drum */}
        <group position={[1.1, 0, 0.3]}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.65, 0.65, 1.8, 24]} />
            <meshStandardMaterial color="#1e3a8a" metalness={0.7} roughness={0.35} />
          </mesh>
          {[-0.85, 0, 0.85].map((ry, ri) => (
            <mesh key={ri} position={[0, 0.9 + ry, 0]}>
              <torusGeometry args={[0.66, 0.03, 8, 24]} />
              <meshStandardMaterial color="#1e40af" metalness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Steel Industrial Drum */}
        <group position={[0.5, 0, -1.0]}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.65, 0.65, 1.8, 24]} />
            <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
          </mesh>
          {[-0.85, 0, 0.85].map((ry, ri) => (
            <mesh key={ri} position={[0, 0.9 + ry, 0]}>
              <torusGeometry args={[0.66, 0.03, 8, 24]} />
              <meshStandardMaterial color="#334155" metalness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 2. Pallets & Ordnance Supply Wooden Boxes */}
      <group position={[8.0, -3.8, -3.5]}>
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[2.5, 0.2, 2.5]} />
          <meshStandardMaterial color="#78350f" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.35, 0]} receiveShadow>
          <boxGeometry args={[2.5, 0.2, 2.5]} />
          <meshStandardMaterial color="#78350f" roughness={0.85} />
        </mesh>
        {/* Main Ammo Supply Crate */}
        <mesh position={[-0.4, 1.0, 0]} castShadow>
          <boxGeometry args={[1.3, 1.2, 1.3]} />
          <meshStandardMaterial color="#92400e" roughness={0.7} />
        </mesh>
        {/* Secondary Military Case */}
        <mesh position={[0.6, 0.9, 0.3]} castShadow>
          <boxGeometry args={[1.0, 1.0, 1.0]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        {/* Yellow Stenciled Ordnance Mark */}
        <mesh position={[-0.4, 1.0, 0.66]}>
          <planeGeometry args={[0.6, 0.3]} />
          <meshStandardMaterial color="#eab308" roughness={0.5} />
        </mesh>
      </group>

      {/* 3. Auxiliary Equipment Workbench (Back Corner) */}
      <group position={[5.5, -2.8, -5.4]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 0.25, 1.8]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Toolboxes on Workbench */}
        <mesh position={[-0.8, 0.3, 0]} castShadow>
          <boxGeometry args={[0.9, 0.45, 0.5]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.65} roughness={0.3} />
        </mesh>
        <mesh position={[0.8, 0.25, 0.2]} castShadow>
          <boxGeometry args={[0.7, 0.35, 0.4]} />
          <meshStandardMaterial color="#047857" metalness={0.65} roughness={0.3} />
        </mesh>
      </group>

      {/* ================= OVERHEAD SWINGING INTERROGATION LAMP ================= */}
      {/* Position: [0, 4.2, 0] */}
      <group ref={hangingLampRef} position={[0, 4.2, 0]}>
        {/* Heavy Suspension Steel Cable */}
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.4, 8]} />
          <meshStandardMaterial color="#18181b" roughness={0.9} />
        </mesh>
        {/* Industrial Metal Shade Cone */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.2, 1.3, 0.6, 24, 1, true]} />
          <meshStandardMaterial color="#27272a" metalness={0.88} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
        {/* Amber Tungsten Filament Bulb */}
        <mesh position={[0, -0.38, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#fffbeb" emissive="#f59e0b" emissiveIntensity={1.8} />
        </mesh>
        {/* Direct Dramatic Spotlight onto Bomb Table */}
        <spotLight
          position={[0, -0.4, 0]}
          angle={Math.PI / 2.3}
          penumbra={0.4}
          intensity={1.8}
          color="#fef08a"
          distance={16}
          castShadow
        />
      </group>

      {/* ================= TACTICAL FLASHLIGHT BESIDE BOMB ON DESK ================= */}
      {/* Position: [4.6, -2.15, 0.5] (exact gameplay coordinates preserved) */}
      {!hasFlashlight && (
        <group position={[4.6, -2.15, 0.5]} rotation={[0, 0.35, 0]} onClick={onPickUpFlashlight}>
          {/* Tactical Flashlight Body */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.75, 16]} />
            <meshStandardMaterial color="#18181b" metalness={0.92} roughness={0.2} />
          </mesh>
          {/* Bezel Ring */}
          <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Flashlight Head */}
          <mesh position={[-0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.15, 0.09, 0.25, 16]} />
            <meshStandardMaterial color="#27272a" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Front Glass Lens */}
          <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <circleGeometry args={[0.14, 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2.5} />
          </mesh>
          {/* Tactical Grip Knurling Bands */}
          {[-0.05, 0.08, 0.2].map((gx, gi) => (
            <mesh key={gi} position={[gx, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.083, 0.083, 0.06, 16]} />
              <meshStandardMaterial color="#3f3f46" metalness={0.8} roughness={0.4} />
            </mesh>
          ))}
          {/* Tailcap Switch */}
          <mesh position={[0.39, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.075, 0.075, 0.05, 16]} />
            <meshStandardMaterial color="#059669" emissive="#10b981" emissiveIntensity={1.8} />
          </mesh>
          {/* Glowing Beacon in dark room */}
          <pointLight position={[0, 0.35, 0]} distance={4.5} intensity={2.8} color="#38bdf8" />
          {/* Floating Label */}
          <Text position={[0, 0.38, 0]} fontSize={0.15} color="#38bdf8" fontWeight="bold">
            🔦 [SENTER TAKTIS] KLIK / TEKAN X
          </Text>
        </group>
      )}
    </group>
  );
};
