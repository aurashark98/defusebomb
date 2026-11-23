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

  // Distances for interaction & proximity prompts
  const distToKey = Math.hypot(playerPos[0] - 7.5, playerPos[2] - 1.5);
  const distToChest = Math.hypot(playerPos[0] - (-7.5), playerPos[2] - (-4.2));
  const distToDoor = Math.hypot(playerPos[0] - (-1.8), playerPos[2] - (-5.8));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Overhead lamp sway (cinematic GTA tension)
    if (hangingLampRef.current) {
      hangingLampRef.current.rotation.z = Math.sin(t * 0.9) * 0.04;
      hangingLampRef.current.rotation.x = Math.cos(t * 0.7) * 0.02;
    }
    // Rotating ventilation fan
    if (fanRef.current) {
      fanRef.current.rotation.z += 0.08;
    }
    // Key pulsing glow
    if (keyGlowRef.current) {
      keyGlowRef.current.intensity = Math.sin(t * 5) * 0.5 + 1.2;
    }
    // Chest beacon
    if (chestGlowRef.current) {
      chestGlowRef.current.intensity = isChestOpen ? 1.5 : Math.sin(t * 3) * 0.4 + 0.8;
    }
  });

  return (
    <group>
      {/* ================= INTERROGATION WOODEN DESK & CHAIR ================= */}
      <group position={[0, -2.4, 0]}>
        {/* Main Wood Table Top (Warm Dark Walnut with Sharp Edges) */}
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[11.0, 0.3, 4.6]} />
          <meshStandardMaterial color="#2d1c10" roughness={0.65} metalness={0.2} />
        </mesh>

        {/* Steel Edge Banding with High Metallic Specularity */}
        <mesh position={[0, 0, 2.32]}>
          <boxGeometry args={[11.04, 0.32, 0.05]} />
          <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, -2.32]}>
          <boxGeometry args={[11.04, 0.32, 0.05]} />
          <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Table Heavy Legs */}
        {[
          [-5.1, -1.8, 1.9], [5.1, -1.8, 1.9],
          [-5.1, -1.8, -1.9], [5.1, -1.8, -1.9]
        ].map(([x, y, z], idx) => (
          <group key={idx} position={[x, y, z]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.35, 3.4, 0.35]} />
              <meshStandardMaterial color="#27272a" metalness={0.92} roughness={0.25} />
            </mesh>
            <mesh position={[0, -1.7, 0]}>
              <cylinderGeometry args={[0.24, 0.24, 0.08, 16]} />
              <meshStandardMaterial color="#18181b" metalness={0.7} />
            </mesh>
          </group>
        ))}

        {/* ================= INTERROGATION CHAIR (WHERE PLAYER SITS) ================= */}
        <group position={[0, -0.6, 3.3]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[1.6, 0.15, 1.6]} />
            <meshStandardMaterial color="#292524" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.0, 0.75]} castShadow>
            <boxGeometry args={[1.5, 1.6, 0.12]} />
            <meshStandardMaterial color="#292524" roughness={0.7} />
          </mesh>
          {[
            [-0.7, -0.7, 0.7], [0.7, -0.7, 0.7],
            [-0.7, -0.7, -0.7], [0.7, -0.7, -0.7]
          ].map(([x, y, z], idx) => (
            <mesh key={idx} position={[x, y, z]}>
              <cylinderGeometry args={[0.05, 0.05, 1.3, 12]} />
              <meshStandardMaterial color="#52525b" metalness={0.9} />
            </mesh>
          ))}
          <Text position={[0, 0.3, 0]} fontSize={0.12} color="#fbbf24">
            KURSI INTEROGASI [Q]
          </Text>
        </group>

        {/* Handcuffs on Desk */}
        <group position={[-4.5, 0.22, 1.4]} rotation={[0, 0.4, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.22, 0.04, 12, 24]} />
            <meshStandardMaterial color="#e4e4e7" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0.3, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.22, 0.04, 12, 24]} />
            <meshStandardMaterial color="#e4e4e7" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* Wire Cutters on Desk */}
        <group position={[4.2, 0.2, 0.8]} rotation={[0, -0.3, 0]}>
          <mesh position={[-0.14, 0.04, 0]} rotation={[0, 0, 0.22]}>
            <cylinderGeometry args={[0.06, 0.06, 1.1, 12]} />
            <meshStandardMaterial color="#ef4444" roughness={0.4} />
          </mesh>
          <mesh position={[0.14, 0.04, 0]} rotation={[0, 0, -0.22]}>
            <cylinderGeometry args={[0.06, 0.06, 1.1, 12]} />
            <meshStandardMaterial color="#ef4444" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.04, -0.65]}>
            <boxGeometry args={[0.24, 0.08, 0.35]} />
            <meshStandardMaterial color="#f4f4f5" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* ================= HEAVY REINFORCED GTA-STYLE BLAST DOOR ================= */}
      {/* Position: [-1.8, -1.2, -6.44] on the Back Wall */}
      <group position={[-1.8, -1.2, -6.42]}>
        {/* Door Recess Outer Frame */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[3.6, 6.2, 0.3]} />
          <meshStandardMaterial color="#09090b" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Steel Beveled Door Frame with Hazard Warning Stripes */}
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[3.2, 5.8, 0.2]} />
          <meshStandardMaterial color="#27272a" metalness={0.88} roughness={0.25} />
        </mesh>

        {/* Inner Door Slab (Heavy Blast Steel Plate) */}
        <mesh position={[0, -0.05, 0.15]} castShadow receiveShadow>
          <boxGeometry args={[2.7, 5.3, 0.14]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.85} roughness={0.35} />
        </mesh>

        {/* Cross-Braced Structural Steel Ribs (X Pattern) */}
        <mesh position={[0, 0.8, 0.23]} rotation={[0, 0, 0.45]}>
          <boxGeometry args={[2.6, 0.18, 0.05]} />
          <meshStandardMaterial color="#52525b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.8, 0.23]} rotation={[0, 0, -0.45]}>
          <boxGeometry args={[2.6, 0.18, 0.05]} />
          <meshStandardMaterial color="#52525b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -1.2, 0.23]} rotation={[0, 0, 0.45]}>
          <boxGeometry args={[2.6, 0.18, 0.05]} />
          <meshStandardMaterial color="#52525b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -1.2, 0.23]} rotation={[0, 0, -0.45]}>
          <boxGeometry args={[2.6, 0.18, 0.05]} />
          <meshStandardMaterial color="#52525b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Rivet Studs along Door Perimeter */}
        {[-1.2, -0.6, 0, 0.6, 1.2].map((x, xi) => (
          <React.Fragment key={xi}>
            <mesh position={[x, 2.45, 0.24]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 8]} />
              <meshStandardMaterial color="#d4d4d8" metalness={0.95} />
            </mesh>
            <mesh position={[x, -2.55, 0.24]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 8]} />
              <meshStandardMaterial color="#d4d4d8" metalness={0.95} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Reinforced Bulletproof Peephole / Glass Window */}
        <group position={[0, 1.6, 0.23]}>
          {/* Window Frame */}
          <mesh>
            <boxGeometry args={[0.8, 0.6, 0.06]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} />
          </mesh>
          {/* Tinted Armored Glass */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.66, 0.46, 0.02]} />
            <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} transparent opacity={0.65} />
          </mesh>
          {/* Vertical Steel Security Grate Bars */}
          {[-0.2, 0, 0.2].map((bx, bi) => (
            <mesh key={bi} position={[bx, 0, 0.04]}>
              <cylinderGeometry args={[0.015, 0.015, 0.46, 8]} />
              <meshStandardMaterial color="#71717a" metalness={0.95} />
            </mesh>
          ))}
        </group>

        {/* Vault Mechanical Turning Wheel Lock (GTA Safehouse Style) */}
        <group ref={doorWheelRef} position={[0.7, -0.2, 0.25]}>
          {/* Center Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.12, 16]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Outer Wheel Rim */}
          <mesh>
            <torusGeometry args={[0.32, 0.04, 12, 24]} />
            <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* 4 Spokes */}
          {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((ang, ai) => (
            <mesh key={ai} rotation={[0, 0, ang]}>
              <boxGeometry args={[0.6, 0.04, 0.04]} />
              <meshStandardMaterial color="#71717a" metalness={0.9} />
            </mesh>
          ))}
          {/* Heavy Horizontal Locking Deadbolts */}
          <mesh position={[0.45, 0, -0.05]}>
            <cylinderGeometry args={[0.05, 0.05, 0.45, 12]} />
            <meshStandardMaterial color="#e4e4e7" metalness={0.95} />
          </mesh>
        </group>

        {/* Electronic Security Terminal & Keypad (Beside Door) */}
        <group position={[1.75, 0.2, 0.1]}>
          <mesh>
            <boxGeometry args={[0.35, 0.8, 0.1]} />
            <meshStandardMaterial color="#18181b" metalness={0.8} />
          </mesh>
          {/* Glowing Red Lockdown LED */}
          <mesh position={[0, 0.25, 0.06]}>
            <circleGeometry args={[0.05, 16]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.0} />
          </mesh>
          {/* Keypad Digits Plate */}
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
          {/* Green illumination light casting downward onto door */}
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
          <meshStandardMaterial color="#52525b" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>

      {/* ================= SECRET CHEST (PETI RAHASIA DI SUDUT LEMARI) ================= */}
      {/* Position: [-7.5, -3.3, -4.2] */}
      <group position={[-7.5, -3.3, -4.2]} onClick={onInteractChest}>
        <group position={[0, 1.2, -0.4]}>
          <mesh position={[0, 0, -0.6]}>
            <boxGeometry args={[2.8, 3.4, 0.1]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
          </mesh>
          <mesh position={[-1.35, 0, 0]}>
            <boxGeometry args={[0.1, 3.4, 1.3]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
          </mesh>
          <mesh position={[1.35, 0, 0]}>
            <boxGeometry args={[0.1, 3.4, 1.3]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.65, 0]}>
            <boxGeometry args={[2.8, 0.1, 1.3]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
          </mesh>
        </group>

        {/* Chest Box */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.7, 1.1]} />
          <meshStandardMaterial color="#451a03" roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.64, 0.72, 0.12]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Chest Lid */}
        <group position={[0, 0.7, isChestOpen ? -0.5 : 0]} rotation={[isChestOpen ? -1.4 : 0, 0, 0]}>
          <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.55, 0.55, 1.6, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#78350f" roughness={0.5} />
          </mesh>
        </group>

        {/* Lock Latch */}
        <mesh position={[0, 0.6, 0.56]}>
          <boxGeometry args={[0.2, 0.25, 0.08]} />
          <meshStandardMaterial
            color={isChestOpen ? "#10b981" : hasKey ? "#f59e0b" : "#ef4444"}
            emissive={isChestOpen ? "#10b981" : hasKey ? "#f59e0b" : "#ef4444"}
            emissiveIntensity={1.5}
          />
        </mesh>

        {/* Secret Intel Clue Document */}
        {isChestOpen && !hasHintPaper && (
          <group position={[0, 0.45, 0]} onClick={onPickUpHintPaper}>
            <mesh castShadow>
              <boxGeometry args={[1.1, 0.08, 0.8]} />
              <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={0.6} roughness={0.4} />
            </mesh>
            <Text position={[0, 0.1, 0]} fontSize={0.09} color="#1c1917" fontWeight="bold">
              KERTAS HINT PROTOKOL DEFUSAL
            </Text>
          </group>
        )}

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
          distance={4}
          color={isChestOpen ? "#10b981" : "#f59e0b"}
        />
      </group>

      {/* ================= HIDDEN KEY (KUNCI EMAS DI ATAS RAK PERKAKAS) ================= */}
      {!hasKey && (
        <group position={[7.5, -1.2, 1.5]} onClick={onPickUpKey}>
          <group position={[0, -0.6, 0]}>
            <mesh position={[-1.2, 0, 0]}>
              <boxGeometry args={[0.1, 3.2, 1.2]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            <mesh position={[1.2, 0, 0]}>
              <boxGeometry args={[0.1, 3.2, 1.2]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            {[-1.2, 0, 1.2].map((y, i) => (
              <mesh key={i} position={[0, y, 0]}>
                <boxGeometry args={[2.5, 0.08, 1.2]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
              </mesh>
            ))}
            <mesh position={[-0.5, -0.8, 0]}>
              <boxGeometry args={[0.8, 0.7, 0.8]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>
            <mesh position={[0.5, -0.8, 0]}>
              <boxGeometry args={[0.7, 0.6, 0.7]} />
              <meshStandardMaterial color="#a16207" roughness={0.8} />
            </mesh>
          </group>

          {/* Golden Key */}
          <group position={[0, 0.15, 0]} rotation={[0, 0.5, Math.PI / 2]}>
            <mesh position={[-0.3, 0, 0]}>
              <torusGeometry args={[0.14, 0.03, 12, 24]} />
              <meshStandardMaterial color="#facc15" metalness={0.95} roughness={0.1} emissive="#eab308" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.6, 12]} />
              <meshStandardMaterial color="#facc15" metalness={0.95} roughness={0.1} emissive="#eab308" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0.3, -0.06, 0]}>
              <boxGeometry args={[0.12, 0.1, 0.03]} />
              <meshStandardMaterial color="#facc15" metalness={0.95} roughness={0.1} emissive="#eab308" emissiveIntensity={0.8} />
            </mesh>
          </group>

          <pointLight ref={keyGlowRef} position={[0, 0.4, 0]} distance={5} color="#facc15" intensity={1.5} />

          {distToKey < 3.2 && (
            <group position={[0, 0.8, 0]}>
              <Text position={[0, 0, 0]} fontSize={0.18} color="#facc15">
                [KUNCI PETI TERSEMBUNYI] TEKAN [X] UNTUK AMBIL
              </Text>
            </group>
          )}
        </group>
      )}

      {/* ================= CLUTTER & OBSTACLES ================= */}
      {/* 1. Barrels */}
      <group position={[-8.5, -3.1, 4.0]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.65, 0.65, 1.8, 24]} />
          <meshStandardMaterial color="#991b1b" metalness={0.65} roughness={0.4} />
        </mesh>
        <mesh position={[1.1, 0.9, 0.3]} castShadow>
          <cylinderGeometry args={[0.65, 0.65, 1.8, 24]} />
          <meshStandardMaterial color="#1e3a8a" metalness={0.65} roughness={0.4} />
        </mesh>
        <mesh position={[0.5, 0.9, -1.0]} castShadow>
          <cylinderGeometry args={[0.65, 0.65, 1.8, 24]} />
          <meshStandardMaterial color="#475569" metalness={0.75} roughness={0.35} />
        </mesh>
      </group>

      {/* 2. Pallets & Boxes */}
      <group position={[8.0, -3.8, -3.5]}>
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[2.5, 0.2, 2.5]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.35, 0]} receiveShadow>
          <boxGeometry args={[2.5, 0.2, 2.5]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[-0.4, 1.0, 0]} castShadow>
          <boxGeometry args={[1.3, 1.2, 1.3]} />
          <meshStandardMaterial color="#92400e" roughness={0.7} />
        </mesh>
        <mesh position={[0.6, 0.9, 0.3]} castShadow>
          <boxGeometry args={[1.0, 1.0, 1.0]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
      </group>

      {/* 3. Workbench */}
      <group position={[5.5, -2.8, -5.4]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 0.25, 1.8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[-0.8, 0.3, 0]} castShadow>
          <boxGeometry args={[0.9, 0.45, 0.5]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.6} />
        </mesh>
        <mesh position={[0.8, 0.25, 0.2]} castShadow>
          <boxGeometry args={[0.7, 0.35, 0.4]} />
          <meshStandardMaterial color="#047857" metalness={0.6} />
        </mesh>
      </group>

      {/* ================= OVERHEAD SWINGING INTERROGATION LAMP ================= */}
      <group ref={hangingLampRef} position={[0, 4.2, 0]}>
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.4, 8]} />
          <meshStandardMaterial color="#18181b" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.2, 1.3, 0.6, 24, 1, true]} />
          <meshStandardMaterial color="#27272a" metalness={0.85} roughness={0.25} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.38, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#fffbeb" emissive="#f59e0b" emissiveIntensity={1.2} />
        </mesh>
        {/* Dimmer mood lighting because flashlight is available */}
        <spotLight
          position={[0, -0.4, 0]}
          angle={Math.PI / 2.3}
          penumbra={0.45}
          intensity={1.2}
          color="#fef08a"
          distance={14}
          castShadow
        />
      </group>

      {/* ================= TACTICAL FLASHLIGHT BESIDE BOMB ON DESK ================= */}
      {!hasFlashlight && (
        <group position={[4.6, -2.15, 0.5]} rotation={[0, 0.35, 0]} onClick={onPickUpFlashlight}>
          {/* Tactical Flashlight Body */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.75, 16]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.25} />
          </mesh>
          {/* Bezel Ring */}
          <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Flashlight Head */}
          <mesh position={[-0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.15, 0.09, 0.25, 16]} />
            <meshStandardMaterial color="#27272a" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Front Glass Lens */}
          <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <circleGeometry args={[0.14, 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2.0} />
          </mesh>
          {/* Tactical Grip Knurling Bands */}
          {[-0.05, 0.08, 0.2].map((gx, gi) => (
            <mesh key={gi} position={[gx, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.083, 0.083, 0.06, 16]} />
              <meshStandardMaterial color="#3f3f46" metalness={0.8} roughness={0.5} />
            </mesh>
          ))}
          {/* Tailcap Switch */}
          <mesh position={[0.39, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.075, 0.075, 0.05, 16]} />
            <meshStandardMaterial color="#059669" emissive="#10b981" emissiveIntensity={1.5} />
          </mesh>
          {/* Glowing Beacon in dark room */}
          <pointLight position={[0, 0.35, 0]} distance={4.5} intensity={2.5} color="#38bdf8" />
          {/* Floating Label */}
          <Text position={[0, 0.38, 0]} fontSize={0.15} color="#38bdf8" fontWeight="bold">
            🔦 [SENTER TAKTIS] KLIK / TEKAN X
          </Text>
        </group>
      )}

      {/* ================= ROOM WALLS, CEILING & GRID FLOOR (GTA BUNKER STYLE) ================= */}
      {/* Floor with Concrete Tile Grid */}
      <mesh position={[0, -4.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 24]} />
        <meshStandardMaterial color="#18181b" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Concrete Tile Expansion Joint Seams on Floor */}
      <gridHelper position={[0, -4.09, 0]} args={[24, 12, '#3f3f46', '#27272a']} />

      {/* Back Wall */}
      <mesh position={[0, 2.5, -6.5]} receiveShadow>
        <planeGeometry args={[26, 14]} />
        <meshStandardMaterial color="#18181b" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-11.0, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[24, 14]} />
        <meshStandardMaterial color="#131316" roughness={0.85} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[11.0, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[24, 14]} />
        <meshStandardMaterial color="#131316" roughness={0.85} />
      </mesh>

      {/* Front Wall (Enclosing Room Behind Player) */}
      <mesh position={[0, 2.5, 9.2]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[26, 14]} />
        <meshStandardMaterial color="#131316" roughness={0.85} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 8.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 24]} />
        <meshStandardMaterial color="#09090b" roughness={0.9} />
      </mesh>

      {/* Ceiling Heavy Industrial Steel I-Beams (GTA Warehouse Look) */}
      {[-4, 0, 4].map((bz, bi) => (
        <group key={bi} position={[0, 7.8, bz]}>
          <mesh>
            <boxGeometry args={[26, 0.4, 0.3]} />
            <meshStandardMaterial color="#27272a" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[26, 0.1, 0.6]} />
            <meshStandardMaterial color="#3f3f46" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Industrial Wall Vent */}
      <group position={[7.5, 3.2, -6.4]}>
        <mesh>
          <boxGeometry args={[1.8, 1.8, 0.1]} />
          <meshStandardMaterial color="#18181b" metalness={0.8} />
        </mesh>
        <group ref={fanRef} position={[0, 0, 0.06]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
              <boxGeometry args={[0.2, 1.4, 0.02]} />
              <meshStandardMaterial color="#52525b" metalness={0.9} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Industrial Overhead Pipes */}
      <group position={[0, 6.2, -6.1]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 24, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>
      <group position={[0, 5.6, -6.1]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 24, 16]} />
          <meshStandardMaterial color="#eab308" metalness={0.7} roughness={0.35} />
        </mesh>
      </group>

      {/* Red Emergency Warning Flasher */}
      <group position={[-5.8, 3.4, -6.4]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 0.08, 16]} />
          <meshStandardMaterial color="#27272a" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.5} />
        </mesh>
        <pointLight position={[0, 0, 0.3]} distance={8} intensity={1.4} color="#ef4444" />
      </group>
    </group>
  );
};
