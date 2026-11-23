import React, { useRef, useEffect, useState, useCallback, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { DefusalModule, PlayerStance } from '../../types/game';
import { AppSettings } from '../../types/settings';
import { BombCase3D } from './BombCase3D';
import { HostageRoom } from './HostageRoom';
import { KeyRiddleModal } from '../menu/KeyRiddleModal';
import { sound } from '../../utils/audio';
import {
  RotateCcw, Volume2, VolumeX, ShieldAlert, Layers, Settings,
  Home, BookOpen, Key, Lock, Unlock, FileText, MousePointer2, Focus, Eye,
  Flashlight, FlashlightOff
} from 'lucide-react';

interface BombSceneProps {
  modules: DefusalModule[];
  currentModuleIndex: number;
  onSelectModule: (index: number) => void;
  timeLeft: number;
  strikes: number;
  maxStrikes: number;
  settings: AppSettings;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
  onSolveModule: (index: number) => void;
  onStrike: (explanation: string) => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
  onGoToMenu: () => void;
  hasKey: boolean;
  isChestOpen: boolean;
  onPickUpKey: () => void;
  onOpenChest: () => void;
  onOpenClueBook: () => void;
  hasFlashlight: boolean;
  isFlashlightOn: boolean;
  onToggleFlashlight: () => void;
  onPickUpFlashlight: () => void;
  hasHintPaper: boolean;
  onPickUpHintPaper: () => void;
  onOpenHintPaper: () => void;
  penaltyNotification: string | null;
}

// Tactical Focused Flashlight (follows camera orientation and position)
function FlashlightLight({ isOn }: { isOn: boolean }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const { camera, scene } = useThree();

  useEffect(() => {
    const targetObj = targetRef.current;
    scene.add(targetObj);
    return () => {
      scene.remove(targetObj);
    };
  }, [scene]);

  useFrame(() => {
    if (!lightRef.current) return;
    lightRef.current.position.copy(camera.position);
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    targetRef.current.position.copy(camera.position).addScaledVector(forward, 15);
    lightRef.current.target = targetRef.current;
  });

  if (!isOn) return null;

  return (
    <spotLight
      ref={lightRef}
      intensity={9.5}
      distance={35}
      angle={Math.PI / 13}
      penumbra={0.15}
      color="#f8fafc"
      castShadow
    />
  );
}

// ─── First-Person Hand Viewmodel (Glove holding item in view) ────────────────
interface FirstPersonHandProps {
  activeSlot: 1 | 2 | null;
  hasFlashlight: boolean;
  isFlashlightOn: boolean;
  hasHintPaper: boolean;
}

function FirstPersonHand({
  activeSlot,
  hasFlashlight,
  isFlashlightOn,
  hasHintPaper
}: FirstPersonHandProps) {
  const handGroupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((state) => {
    if (!handGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle breathing / walking bob
    const bobX = Math.sin(t * 2) * 0.003;
    const bobY = Math.cos(t * 3.5) * 0.003;

    // Position & orient relative to camera
    handGroupRef.current.position.copy(camera.position);
    handGroupRef.current.quaternion.copy(camera.quaternion);

    // Offset into lower-right of player view (-Z is camera forward)
    const offset = new THREE.Vector3(0.24 + bobX, -0.22 + bobY, -0.48);
    offset.applyQuaternion(camera.quaternion);
    handGroupRef.current.position.add(offset);
  });

  const isHoldingFlashlight = activeSlot === 1 && hasFlashlight;
  const isHoldingPaper = activeSlot === 2 && hasHintPaper;

  if (!isHoldingFlashlight && !isHoldingPaper) return null;

  return (
    <group ref={handGroupRef}>
      {isHoldingFlashlight && (
        <group rotation={[0.2, -0.2, 0.05]}>
          {/* Forearm Sleeve */}
          <mesh position={[0.1, -0.25, 0.32]} rotation={[-0.45, 0.1, -0.1]}>
            <cylinderGeometry args={[0.065, 0.075, 0.5, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          {/* Wrist Cuff */}
          <mesh position={[0.06, -0.07, 0.16]} rotation={[-0.45, 0.1, -0.1]}>
            <cylinderGeometry args={[0.068, 0.068, 0.07, 16]} />
            <meshStandardMaterial color="#3f3f46" roughness={0.6} />
          </mesh>
          {/* Tactical Glove Hand Palm */}
          <mesh position={[0.02, -0.01, 0.04]} rotation={[0.08, 0.15, -0.1]}>
            <boxGeometry args={[0.085, 0.08, 0.12]} />
            <meshStandardMaterial color="#27272a" roughness={0.7} />
          </mesh>
          {/* Gripping Fingers around Flashlight */}
          <mesh position={[-0.035, 0.005, 0.02]} rotation={[0, 0, 0.35]}>
            <boxGeometry args={[0.038, 0.075, 0.11]} />
            <meshStandardMaterial color="#1f2937" roughness={0.7} />
          </mesh>
          {/* Glove Thumb */}
          <mesh position={[0.035, 0.045, 0.035]} rotation={[-0.2, 0.1, -0.3]}>
            <boxGeometry args={[0.035, 0.055, 0.04]} />
            <meshStandardMaterial color="#1f2937" roughness={0.7} />
          </mesh>

          {/* Flashlight Held in Hand */}
          <group position={[0, 0, 0]}>
            {/* Flashlight Barrel */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.3, 16]} />
              <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Gold Accent Ring */}
            <mesh position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.032, 0.032, 0.02, 16]} />
              <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Flashlight Head */}
            <mesh position={[0, 0, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.048, 0.03, 0.1, 16]} />
              <meshStandardMaterial color="#1f2937" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Front Bulb Lens */}
            <mesh position={[0, 0, -0.211]} rotation={[0, Math.PI, 0]}>
              <circleGeometry args={[0.044, 16]} />
              <meshStandardMaterial
                color={isFlashlightOn ? "#ffffff" : "#475569"}
                emissive={isFlashlightOn ? "#ffffff" : "#0f172a"}
                emissiveIntensity={isFlashlightOn ? 6.0 : 0.2}
              />
            </mesh>
            {/* Lens Flare Light */}
            {isFlashlightOn && (
              <pointLight position={[0, 0, -0.24]} distance={0.8} intensity={2.5} color="#ffffff" />
            )}
          </group>
        </group>
      )}

      {isHoldingPaper && (
        <group position={[0.08, 0.02, 0]} rotation={[0.25, -0.25, -0.05]}>
          {/* Hand holding clue paper */}
          <mesh position={[0.06, -0.14, 0.18]} rotation={[-0.3, 0.1, 0]}>
            <cylinderGeometry args={[0.055, 0.065, 0.35, 12]} />
            <meshStandardMaterial color="#18181b" roughness={0.8} />
          </mesh>
          <mesh position={[0.02, 0, 0.05]}>
            <boxGeometry args={[0.08, 0.06, 0.09]} />
            <meshStandardMaterial color="#27272a" roughness={0.7} />
          </mesh>
          {/* Sheet of Intel Paper */}
          <mesh position={[-0.08, 0.04, -0.04]} rotation={[-0.1, 0.25, 0.05]}>
            <boxGeometry args={[0.26, 0.004, 0.32]} />
            <meshStandardMaterial color="#fef9c3" emissive="#fef08a" emissiveIntensity={0.25} roughness={0.6} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// FPS Limiter
function FpsLimiter({ targetFps }: { targetFps: number }) {
  const lastTime = useRef<number>(0);
  const interval = 1000 / targetFps;
  useFrame(() => {
    const now = performance.now();
    const elapsed = now - lastTime.current;
    if (elapsed < interval) return;
    lastTime.current = now - (elapsed % interval);
  });
  return null;
}

// ─── FPS Camera Controller (runs INSIDE Canvas) ───────────────────────────────
interface FpsCameraProps {
  stance: PlayerStance;
  isInteracting: boolean;
  playerPos: React.MutableRefObject<THREE.Vector3>;
  yaw: React.MutableRefObject<number>;
  pitch: React.MutableRefObject<number>;
}

function FpsCameraController({
  stance,
  isInteracting,
  playerPos,
  yaw,
  pitch,
}: FpsCameraProps) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (stance === 'sitting') {
      if (isInteracting) {
        // OrbitControls handles position when interacting
        return;
      } else {
        // Sitting in chair, viewing front of the bomb
        camera.position.lerp(new THREE.Vector3(0, 0.35, 4.9), Math.min(delta * 6, 1));
        camera.lookAt(0, 0, 0);
      }
      return;
    }

    // Standing / walking – true First-Person (GTA style eye height 1.65)
    const eyeHeight = 1.65;
    const targetPos = new THREE.Vector3(playerPos.current.x, eyeHeight, playerPos.current.z);
    camera.position.lerp(targetPos, Math.min(delta * 12, 1));

    // Look direction from yaw + pitch
    const lookDir = new THREE.Vector3(
      Math.sin(yaw.current) * Math.cos(pitch.current),
      Math.sin(pitch.current),
      Math.cos(yaw.current) * Math.cos(pitch.current)
    );
    camera.lookAt(
      camera.position.x + lookDir.x,
      camera.position.y + lookDir.y,
      camera.position.z + lookDir.z
    );
  });

  return null;
}

// ─── Main BombScene Component ─────────────────────────────────────────────────
export const BombScene: React.FC<BombSceneProps> = ({
  modules,
  currentModuleIndex,
  onSelectModule,
  timeLeft,
  strikes,
  maxStrikes,
  settings,
  isMuted,
  onToggleMute,
  onRestart,
  onSolveModule,
  onStrike,
  onOpenSettings,
  onOpenHowToPlay,
  onGoToMenu,
  hasKey,
  isChestOpen,
  onPickUpKey,
  onOpenChest,
  onOpenClueBook,
  hasFlashlight,
  isFlashlightOn,
  onToggleFlashlight,
  onPickUpFlashlight,
  hasHintPaper,
  onPickUpHintPaper,
  onOpenHintPaper,
  penaltyNotification,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // ── Stance & interaction
  const [stance, setStance] = useState<PlayerStance>('sitting');
  const [isInteracting, setIsInteracting] = useState(false);
  const [isRiddleOpen, setIsRiddleOpen] = useState(false);

  // ── Active Item held in hand (Slot 1 = Flashlight, Slot 2 = Hint Paper / Key)
  const [activeSlot, setActiveSlot] = useState<1 | 2 | null>(null);

  // ── FPS camera refs
  const playerPos = useRef(new THREE.Vector3(0, 1.65, 5.2));
  const yaw = useRef(Math.PI); // Facing -Z
  const pitch = useRef(0);
  const keysPressed = useRef<Record<string, boolean>>({});
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  // ── Proximity helpers
  const keyCoords = new THREE.Vector2(7.5, 1.5);        // on tool rack
  const chestCoords = new THREE.Vector2(-7.5, -4.2);     // back-left locker
  const doorCoords = new THREE.Vector2(-1.8, -5.8);      // heavy exit blast door
  const flashlightCoords = new THREE.Vector2(3.2, 0.4);  // on desk beside bomb

  const getDistToKey = () =>
    Math.hypot(playerPos.current.x - keyCoords.x, playerPos.current.z - keyCoords.y);
  const getDistToChest = () =>
    Math.hypot(playerPos.current.x - chestCoords.x, playerPos.current.z - chestCoords.y);
  const getDistToDoor = () =>
    Math.hypot(playerPos.current.x - doorCoords.x, playerPos.current.z - doorCoords.y);
  const getDistToFlashlight = () =>
    Math.hypot(playerPos.current.x - flashlightCoords.x, playerPos.current.z - flashlightCoords.y);

  const [nearKey, setNearKey] = useState(false);
  const [nearChest, setNearChest] = useState(false);
  const [nearDoor, setNearDoor] = useState(false);
  const [nearFlashlight, setNearFlashlight] = useState(false);

  // ── Toggle interaction with mechanical latch animation & sound
  const toggleInteract = useCallback(() => {
    setIsInteracting(prev => {
      const next = !prev;
      sound.playBombInteract(next);
      return next;
    });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Pointer Lock (mouse look)
  // ─────────────────────────────────────────────────────────────────────────────
  const requestLock = useCallback(() => {
    if (stance === 'standing' && !isInteracting && !isRiddleOpen) {
      canvasRef.current?.requestPointerLock();
    }
  }, [stance, isInteracting, isRiddleOpen]);

  useEffect(() => {
    const onLockChange = () => {
      setIsPointerLocked(document.pointerLockElement === canvasRef.current);
    };
    document.addEventListener('pointerlockchange', onLockChange);
    return () => document.removeEventListener('pointerlockchange', onLockChange);
  }, []);

  useEffect(() => {
    if (stance === 'sitting' || isInteracting || isRiddleOpen) {
      if (document.pointerLockElement === canvasRef.current) {
        document.exitPointerLock();
      }
    }
  }, [stance, isInteracting, isRiddleOpen]);

  useEffect(() => {
    const sensitivity = 0.0024;
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvasRef.current) return;
      yaw.current -= e.movementX * sensitivity;
      pitch.current -= e.movementY * sensitivity;
      pitch.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch.current));
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // WASD Walking Loop (W=maju, S=kebelakang, A=jalan kekiri, D=jalan ke kanan)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (stance !== 'standing' || isInteracting || isRiddleOpen) return;

    const SPEED = 0.08;
    const ROOM_MIN_X = -9.2;
    const ROOM_MAX_X = 9.2;
    const ROOM_MIN_Z = -5.2;
    const ROOM_MAX_Z = 8.2;

    const interval = window.setInterval(() => {
      const k = keysPressed.current;
      let dx = 0, dz = 0;

      const fwdX = Math.sin(yaw.current);
      const fwdZ = Math.cos(yaw.current);
      const rightX = -Math.cos(yaw.current);
      const rightZ = Math.sin(yaw.current);

      if (k['w'] || k['arrowup'])   { dx += fwdX * SPEED;  dz += fwdZ * SPEED; } // W: Maju
      if (k['s'] || k['arrowdown']) { dx -= fwdX * SPEED;  dz -= fwdZ * SPEED; } // S: Kebelakang
      if (k['a'] || k['arrowleft']) { dx -= rightX * SPEED; dz -= rightZ * SPEED; } // A: Kiri
      if (k['d'] || k['arrowright']){ dx += rightX * SPEED; dz += rightZ * SPEED; } // D: Kanan

      if (dx === 0 && dz === 0) return;

      const nx = Math.max(ROOM_MIN_X, Math.min(ROOM_MAX_X, playerPos.current.x + dx));
      const nz = Math.max(ROOM_MIN_Z, Math.min(ROOM_MAX_Z, playerPos.current.z + dz));

      // Desk collision block [-5.6, 5.6] × [-2.4, 2.4]
      const inDesk = nx > -5.6 && nx < 5.6 && nz > -2.4 && nz < 2.4;
      if (!inDesk) {
        playerPos.current.set(nx, playerPos.current.y, nz);
      }

      setNearKey(getDistToKey() < 2.8);
      setNearChest(getDistToChest() < 2.8);
      setNearDoor(getDistToDoor() < 3.0);
    }, 16);

    return () => clearInterval(interval);
  }, [stance, isInteracting, isRiddleOpen]);

  // Proximity polling
  useEffect(() => {
    if (stance !== 'standing') {
      setNearKey(false);
      setNearChest(false);
      setNearDoor(false);
      setNearFlashlight(false);
      return;
    }
    const id = setInterval(() => {
      setNearKey(getDistToKey() < 2.8);
      setNearChest(getDistToChest() < 2.8);
      setNearDoor(getDistToDoor() < 3.0);
      setNearFlashlight(getDistToFlashlight() < 2.5);
    }, 150);
    return () => clearInterval(id);
  }, [stance, hasKey, isChestOpen, hasFlashlight]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Mouse Click Handler: Left Click (Button 0) turns Flashlight ON/OFF when held!
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left click
        if (activeSlot === 1 && hasFlashlight) {
          const target = e.target as HTMLElement;
          // Trigger when clicking 3D world / canvas or when pointer locked
          if (document.pointerLockElement === canvasRef.current || target.tagName.toLowerCase() === 'canvas') {
            sound.playKeypadClick();
            onToggleFlashlight();
          }
        }
      }
    };
    window.addEventListener('mousedown', handleMouseDown);
    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, [activeSlot, hasFlashlight, onToggleFlashlight]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Keyboard handlers: Q (duduk), E (berdiri), X (interact)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      // Q = Duduk di kursi
      if (e.key.toLowerCase() === 'q' && stance === 'standing') {
        sound.playKeypadClick();
        setStance('sitting');
        setIsInteracting(false);
        playerPos.current.set(0, 1.65, 5.2);
        return;
      }

      // E = Berdiri dari kursi
      if (e.key.toLowerCase() === 'e') {
        if (stance === 'sitting') {
          sound.playKeypadClick();
          setStance('standing');
          setIsInteracting(false);
        } else if (isInteracting) {
          sound.playKeypadClick();
          setIsInteracting(false);
        }
        return;
      }

      // 1 = Pegang / Lepas Senter (Slot 1)
      if (e.key === '1') {
        if (hasFlashlight) {
          sound.playKeypadClick();
          setActiveSlot(prev => (prev === 1 ? null : 1));
        }
        return;
      }

      // 2 = Pegang / Buka Kertas Hint atau Kunci (Slot 2)
      if (e.key === '2') {
        if (hasHintPaper || hasKey) {
          sound.playKeypadClick();
          setActiveSlot(prev => (prev === 2 ? null : 2));
          if (hasHintPaper) {
            onOpenHintPaper();
          }
        }
        return;
      }

      // F = Toggle Senter jika sudah diambil / pegang
      if (e.key.toLowerCase() === 'f') {
        if (hasFlashlight) {
          sound.playKeypadClick();
          if (activeSlot !== 1) setActiveSlot(1);
          onToggleFlashlight();
        }
        return;
      }

      // H = Buka Kertas Hint (jika sudah diambil)
      if (e.key.toLowerCase() === 'h' && hasHintPaper) {
        sound.playKeypadClick();
        onOpenHintPaper();
        return;
      }

      // X = Interaksi
      if (e.key.toLowerCase() === 'x') {
        if (stance === 'sitting') {
          toggleInteract();
          return;
        }
        if (stance === 'standing') {
          const dFlashlight = getDistToFlashlight();
          const dKey = getDistToKey();
          const dChest = getDistToChest();

          if (dFlashlight < 2.5 && !hasFlashlight) {
            sound.playVictory();
            onPickUpFlashlight();
            setActiveSlot(1);
            return;
          }
          if (dKey < 2.8 && !hasKey) {
            setIsRiddleOpen(true);
            return;
          }
          if (dChest < 2.8) {
            if (!isChestOpen) {
              if (hasKey) onOpenChest();
              else sound.playPenaltyBuzzer();
            } else if (!hasHintPaper) {
              onPickUpHintPaper();
              setActiveSlot(2);
            } else {
              onOpenHintPaper();
            }
          }
        }
      }

      // Escape
      if (e.key === 'Escape') {
        if (isInteracting) setIsInteracting(false);
        if (isRiddleOpen) setIsRiddleOpen(false);
        if (isPointerLocked) document.exitPointerLock();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [stance, isInteracting, isRiddleOpen, isPointerLocked, hasKey, isChestOpen, hasFlashlight, activeSlot, onToggleFlashlight, onPickUpFlashlight, hasHintPaper, onPickUpHintPaper, onOpenHintPaper, onPickUpKey, onOpenChest, onOpenClueBook]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Quick Camera Presets (Front & Back Face)
  // ─────────────────────────────────────────────────────────────────────────────
  const rotateToFront = () => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(0, 0.25, 4.5);
      controlsRef.current.update();
    }
  };

  const rotateToBack = () => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(0, 0.25, -4.5);
      controlsRef.current.update();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Riddle Callbacks
  // ─────────────────────────────────────────────────────────────────────────────
  const handleRiddleSuccess = () => {
    onPickUpKey();
    setIsRiddleOpen(false);
  };

  const handleRiddleWrong = () => {
    onStrike('Jawaban salah pada teka-teki kunci!');
    setIsRiddleOpen(false);
  };

  const defusedCount = modules.filter(m => m.isDefused).length;
  // High fidelity GTA-like sharpness DPR:
  const dpr = settings.graphicsQuality === 'high' ? [1.5, 2] as [number, number]
    : settings.graphicsQuality === 'medium' ? [1, 1.5] as [number, number]
    : 1;
  const enableShadows = settings.graphicsQuality !== 'low';

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-zinc-950">

      {/* ── 3D Canvas ─────────────────────────────────────────────────────────── */}
      <div
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0 }}
        onClick={requestLock}
      >
        <Canvas
          shadows={enableShadows}
          dpr={dpr}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
          }}
          style={{ width: '100%', height: '100%', display: 'block' }}
          className={
            stance === 'standing'
              ? 'cursor-crosshair'
              : isInteracting
              ? 'cursor-grab active:cursor-grabbing'
              : 'cursor-default'
          }
        >
          <FpsLimiter targetFps={settings.targetFps} />
          <color attach="background" args={['#09090d']} />
          <PerspectiveCamera makeDefault position={[0, 0.35, 4.9]} fov={62} near={0.05} far={200} />

          {/* Dynamic GTA Cinematic Lighting (Dimmer bunker atmosphere for tactical flashlight) */}
          <ambientLight intensity={0.15} />
          <directionalLight
            position={[5, 11, 6]}
            intensity={0.4}
            color="#fef3c7"
            castShadow={enableShadows}
            shadow-bias={-0.0001}
            shadow-camera-left={-14}
            shadow-camera-right={14}
            shadow-camera-top={14}
            shadow-camera-bottom={-14}
          />
          <directionalLight position={[-6, 6, -5]} intensity={0.2} color="#38bdf8" />
          <pointLight position={[0, 3.2, 3.5]} intensity={0.4} color="#ffffff" distance={16} />
          <pointLight position={[0, -0.5, 2.8]} intensity={0.3} color="#f59e0b" distance={9} />
          <pointLight position={[0, 0.5, -2.8]} intensity={0.3} color="#38bdf8" distance={9} />

          {/* Tactical Focused Flashlight (Active only when holding slot 1 AND flashlight is ON) */}
          <FlashlightLight isOn={activeSlot === 1 && hasFlashlight && isFlashlightOn} />

          {/* First-Person Hand Viewmodel (Arm & Hand holding active item) */}
          <FirstPersonHand
            activeSlot={activeSlot}
            hasFlashlight={hasFlashlight}
            isFlashlightOn={isFlashlightOn}
            hasHintPaper={hasHintPaper}
          />

          <Suspense fallback={null}>
            {/* Hostage Room Environment with Heavy Steel Security Door */}
            <HostageRoom
              hasKey={hasKey}
              isChestOpen={isChestOpen}
              hasHintPaper={hasHintPaper}
              hasFlashlight={hasFlashlight}
              onPickUpKey={() => setIsRiddleOpen(true)}
              onInteractChest={() => {
                if (!isChestOpen) {
                  if (hasKey) onOpenChest();
                  else sound.playPenaltyBuzzer();
                } else if (!hasHintPaper) {
                  onPickUpHintPaper();
                  setActiveSlot(2);
                } else {
                  onOpenHintPaper();
                }
              }}
              onPickUpHintPaper={() => {
                onPickUpHintPaper();
                setActiveSlot(2);
              }}
              onPickUpFlashlight={() => {
                sound.playVictory();
                onPickUpFlashlight();
                setActiveSlot(1);
              }}
              playerPos={[playerPos.current.x, playerPos.current.y, playerPos.current.z]}
            />

            {/* Camera transition manager */}
            <FpsCameraController
              stance={stance}
              isInteracting={isInteracting}
              playerPos={playerPos}
              yaw={yaw}
              pitch={pitch}
            />

            {/* The 3D Bomb Suitcase on the desk (Front & Back Face) */}
            <BombCase3D
              modules={modules}
              selectedModuleIndex={currentModuleIndex}
              onSelectModule={onSelectModule}
              timeLeft={timeLeft}
              strikes={strikes}
              maxStrikes={maxStrikes}
              onSolveModule={onSolveModule}
              onStrike={onStrike}
              isInteractive={isInteracting}
            />
          </Suspense>

          {/* Orbit Controls (Active when sitting AND interacting with bomb)
              Full 360 degree rotation to inspect both FRONT and BACK faces! */}
          {stance === 'sitting' && isInteracting && (
            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              minDistance={3.0}
              maxDistance={6.5}
              minPolarAngle={Math.PI / 4.5}
              maxPolarAngle={Math.PI / 1.85}
              rotateSpeed={0.8}
              target={[0, 0, 0]}
            />
          )}
        </Canvas>
      </div>

      {/* ── High-Tech Tactical HUD Interaction Reticles & Scan Animation ────── */}
      {stance === 'sitting' && isInteracting && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden animate-in fade-in duration-300">
          {/* Subtle Cyber Vignette */}
          <div className="absolute inset-0 bg-radial-gradient opacity-30" />

          {/* Top-Left Corner Targeting Reticle */}
          <div className="absolute top-16 left-6 flex flex-col gap-1 text-[10px] font-mono font-bold text-yellow-400">
            <div className="flex items-center gap-1.5 bg-zinc-950/85 px-2.5 py-1 rounded border border-yellow-500/60 shadow-lg backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>DEFUSAL PROTOCOL ACTIVE</span>
            </div>
            <div className="text-zinc-400 text-[9px] tracking-wider pl-1 font-semibold">
              ORBIT CAMERA: DRAG MOUSE / SWIPE
            </div>
          </div>

          {/* 4 Screen Edge Reticle Brackets */}
          <div className="absolute top-14 left-4 w-8 h-8 border-t-2 border-l-2 border-yellow-500/80 pointer-events-none animate-pulse" />
          <div className="absolute top-14 right-4 w-8 h-8 border-t-2 border-r-2 border-yellow-500/80 pointer-events-none animate-pulse" />
          <div className="absolute bottom-16 left-4 w-8 h-8 border-b-2 border-l-2 border-yellow-500/80 pointer-events-none animate-pulse" />
          <div className="absolute bottom-16 right-4 w-8 h-8 border-b-2 border-r-2 border-yellow-500/80 pointer-events-none animate-pulse" />

          {/* Holographic sweep animation */}
          <div className="absolute inset-0 scanline opacity-25 pointer-events-none" />
        </div>
      )}

      {/* ── First-Person Mouse Look Guide Overlay (when standing & not locked) ── */}
      {stance === 'standing' && !isPointerLocked && !isRiddleOpen && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{ background: 'rgba(0,0,0,0.35)' }}
        >
          <div className="bg-zinc-900/95 border-2 border-yellow-500 rounded-2xl px-8 py-5 flex flex-col items-center gap-3 shadow-2xl">
            <MousePointer2 className="w-8 h-8 text-yellow-400 animate-bounce" />
            <div className="text-yellow-300 font-black text-sm uppercase tracking-widest text-center">
              KLIK LAYAR UNTUK MENGAKTIFKAN MOUSE LOOK
            </div>
            <div className="text-zinc-400 text-xs font-mono text-center">
              [W] Maju &nbsp;|&nbsp; [S] Kebelakang &nbsp;|&nbsp; [A] Kiri &nbsp;|&nbsp; [D] Kanan &nbsp;|&nbsp; [ESC] Lepas Kursor
            </div>
          </div>
        </div>
      )}

      {/* Crosshair when mouse locked */}
      {stance === 'standing' && isPointerLocked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative w-5 h-5">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white opacity-70" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-white opacity-70" />
            <div className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 rounded-full" />
          </div>
        </div>
      )}

      {/* ── Sitting but not interacting prompt ───────────────────────────────── */}
      {stance === 'sitting' && !isInteracting && (
        <div className="absolute top-28 left-4 right-4 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-zinc-950/90 border border-yellow-500/80 px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-mono animate-pulse pointer-events-auto">
            <Focus className="w-4 h-4 text-yellow-400" />
            <span className="text-zinc-300">
              Kamu sedang duduk di kursi. Tekan <strong className="text-yellow-400 font-black">[X]</strong> untuk mulai berinteraksi dengan bom!
            </span>
          </div>
        </div>
      )}

      {/* ── Riddle Modal (Elsi Train Story) ─────────────────────────────────── */}
      {isRiddleOpen && (
        <KeyRiddleModal
          onSuccess={handleRiddleSuccess}
          onWrong={handleRiddleWrong}
          onClose={() => setIsRiddleOpen(false)}
        />
      )}

      {/* ── Top HUD ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        {/* Left: Menu & Mission Status + KEY COUNTER (0 or 1) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onGoToMenu}
            className="bg-zinc-900/95 backdrop-blur border border-zinc-700/80 p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 shadow-2xl flex items-center gap-1.5 text-xs font-mono font-bold transition"
            title="Kembali ke Menu Utama"
          >
            <Home className="w-4 h-4 text-yellow-400" />
            <span className="hidden sm:inline">MENU</span>
          </button>

          <div className="bg-zinc-900/95 backdrop-blur border border-zinc-700/80 p-2.5 rounded-lg shadow-2xl flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-mono text-xs font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" />
                HOSTAGE ROOM
              </span>
            </div>
            <div className="h-4 w-px bg-zinc-700" />
            <div className="text-xs font-mono text-zinc-300">
              DEFUSED: <strong className="text-emerald-400">{defusedCount}</strong> / {modules.length}
            </div>
          </div>

          {/* KEY STATUS BADGE: 0 if no key, 1 if key acquired */}
          <div className="bg-zinc-900/95 backdrop-blur border border-zinc-700/80 p-2.5 rounded-lg shadow-2xl flex items-center gap-2">
            <Key className={`w-4 h-4 transition-colors ${hasKey ? 'text-yellow-400 fill-yellow-400 animate-bounce' : 'text-zinc-500'}`} />
            <div className="text-xs font-mono font-bold flex items-center gap-1">
              <span className="text-zinc-400">KUNCI:</span>
              <span className={hasKey ? 'text-yellow-400 font-black' : 'text-zinc-400'}>
                {hasKey ? '1' : '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Floating Penalty */}
        {penaltyNotification && (
          <div className="bg-red-600 text-white font-black text-sm px-4 py-1.5 rounded-lg shadow-2xl animate-bounce border border-red-300 pointer-events-auto flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            {penaltyNotification}
          </div>
        )}

        {/* Right: Quick actions */}
        <div className="bg-zinc-900/95 backdrop-blur border border-zinc-700/80 p-2 rounded-lg shadow-2xl pointer-events-auto flex items-center gap-1.5 sm:gap-2 z-20">
          {/* Secret Clue Document Button if Chest is Unlocked */}
          {isChestOpen && (
            <button
              onClick={onOpenClueBook}
              className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500 flex items-center gap-1.5 transition glow-green"
              title="Buka Catatan Intelijen Peti"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">HINT PETUNJUK</span>
            </button>
          )}

          {/* Quick Front / Back Flip Buttons (when interacting with bomb) */}
          {isInteracting && (
            <>
              <button
                onClick={rotateToFront}
                className="px-2 py-1 text-xs font-mono font-bold rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1 transition"
                title="Lihat Sisi Depan Koper"
              >
                <Eye className="w-3.5 h-3.5 text-yellow-400" />
                <span className="hidden sm:inline">DEPAN</span>
              </button>

              <button
                onClick={rotateToBack}
                className="px-2 py-1 text-xs font-mono font-bold rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1 transition"
                title="Lihat Sisi Belakang Koper"
              >
                <RotateCcw className="w-3.5 h-3.5 text-yellow-400" />
                <span className="hidden sm:inline">BELAKANG</span>
              </button>

              <div className="h-4 w-px bg-zinc-700" />
            </>
          )}

          <button onClick={onOpenHowToPlay}
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
            title="Panduan Cara Bermain"
          >
            <BookOpen className="w-4 h-4 text-yellow-400" />
          </button>

          <button onClick={onOpenSettings}
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
            title="Pengaturan"
          >
            <Settings className="w-4 h-4 text-cyan-400" />
          </button>

          <button onClick={onToggleMute}
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button onClick={onRestart}
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
            title="Restart Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Stance & Interaction Bar ──────────────────────────────────────────── */}
      <div className="absolute top-20 left-4 right-4 flex items-center justify-center pointer-events-none z-20">
        <div className="bg-zinc-900/95 backdrop-blur border-2 border-yellow-500/70 px-4 py-2 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-mono pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 uppercase">POSISI:</span>
            <span className={`px-2 py-0.5 rounded font-black ${stance === 'sitting' ? 'bg-yellow-500 text-zinc-950' : 'bg-cyan-500 text-zinc-950'}`}>
              {stance === 'sitting' ? 'DUDUK DI KURSI' : 'BERDIRI / JALAN'}
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-700" />

          {stance === 'sitting' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleInteract}
                className={`px-3 py-1 rounded font-black uppercase text-xs flex items-center gap-1.5 transition ${
                  isInteracting
                    ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                }`}
              >
                <span>[X]</span>
                <span>{isInteracting ? 'LEPAS BOM' : 'INTERAKSI DEFUSE BOM'}</span>
              </button>

              <button
                onClick={() => { sound.playKeypadClick(); setStance('standing'); setIsInteracting(false); }}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold border border-zinc-700"
              >
                [E] BERDIRI
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-zinc-300">
                <strong className="text-yellow-400">[W]</strong> maju &nbsp;
                <strong className="text-yellow-400">[S]</strong> belakang &nbsp;
                <strong className="text-cyan-400">[A]</strong> kiri &nbsp;
                <strong className="text-cyan-400">[D]</strong> kanan
              </span>
              <button
                onClick={() => { sound.playKeypadClick(); setStance('sitting'); playerPos.current.set(0, 1.65, 5.2); }}
                className="px-2.5 py-1 rounded bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-black uppercase"
              >
                [Q] DUDUK DI MEJA
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Proximity Prompts (Near Key / Chest / Door) ──────────────────────── */}
      {stance === 'standing' && (
        <div className="absolute top-36 left-4 right-4 flex flex-col items-center gap-2 pointer-events-none z-20">
          {nearKey && !hasKey && (
            <div className="bg-yellow-500 text-zinc-950 font-black text-xs px-4 py-2 rounded-xl shadow-2xl animate-bounce border-2 border-white pointer-events-auto flex items-center gap-2">
              <Key className="w-4 h-4 fill-current" />
              <span>KUNCI PETI DITEMUKAN! TEKAN [X] UNTUK AMBIL!</span>
              <button onClick={() => setIsRiddleOpen(true)}
                className="ml-2 px-2 py-0.5 rounded bg-zinc-950 text-yellow-400 text-[10px] uppercase font-bold"
              >
                AMBIL
              </button>
            </div>
          )}

          {nearChest && (
            <div className="bg-zinc-900 border-2 border-yellow-500 text-white font-black text-xs px-4 py-2 rounded-xl shadow-2xl pointer-events-auto flex items-center gap-2">
              {isChestOpen ? (
                !hasHintPaper ? (
                  <>
                    <Unlock className="w-4 h-4 text-emerald-400" />
                    <span>PETI TERBUKA! TEKAN [X] UNTUK AMBIL KERTAS HINT!</span>
                    <button onClick={onPickUpHintPaper}
                      className="ml-2 px-2.5 py-1 rounded bg-yellow-500 text-zinc-950 text-[10px] uppercase font-bold"
                    >AMBIL KERTAS HINT</button>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>KERTAS HINT SUDAH DIAMBIL! TEKAN [H] UNTUK BACA!</span>
                    <button onClick={onOpenHintPaper}
                      className="ml-2 px-2.5 py-1 rounded bg-emerald-500 text-zinc-950 text-[10px] uppercase font-bold"
                    >BACA HINT (H)</button>
                  </>
                )
              ) : hasKey ? (
                <>
                  <Key className="w-4 h-4 text-yellow-400" />
                  <span>KAMU PUNYA KUNCI! TEKAN [X] BUKA PETI!</span>
                  <button onClick={onOpenChest}
                    className="ml-2 px-2.5 py-1 rounded bg-yellow-500 text-zinc-950 text-[10px] uppercase font-bold"
                  >BUKA</button>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-red-500" />
                  <span className="text-red-400">PETI TERKUNCI! CARI KUNCI DI RAK PERKAKAS!</span>
                </>
              )}
            </div>
          )}

          {/* Near Flashlight on Table Prompt */}
          {nearFlashlight && !hasFlashlight && (
            <div className="bg-cyan-500 text-zinc-950 font-black text-xs px-4 py-2 rounded-xl shadow-2xl animate-bounce border-2 border-white pointer-events-auto flex items-center gap-2">
              <Flashlight className="w-4 h-4 fill-current" />
              <span>SENTER TAKTIS DITEMUKAN DI SEBELAH BOM! TEKAN [X] UNTUK AMBIL!</span>
              <button
                onClick={() => {
                  sound.playVictory();
                  onPickUpFlashlight();
                  setActiveSlot(1);
                }}
                className="ml-2 px-2 py-0.5 rounded bg-zinc-950 text-cyan-300 text-[10px] uppercase font-bold"
              >
                AMBIL
              </button>
            </div>
          )}

          {/* Near Door Prompt */}
          {nearDoor && (
            <div className="bg-zinc-950/95 border-2 border-red-500/80 text-white font-mono text-xs px-4 py-2 rounded-xl shadow-2xl pointer-events-auto flex items-center gap-2 animate-pulse">
              <Lock className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-zinc-200">
                <strong className="text-red-400">PINTU KELUAR TERKUNCI (LOCKDOWN)!</strong> Jinakkan seluruh modul bom koper AI untuk membuka pintu ruangan ini!
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── 2-SLOT HOTBAR INVENTORY (Ditengah Bawah Layar) ────────────────────── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-auto z-30 flex items-center gap-2.5">
        {/* SLOT 1 (Senter) */}
        <button
          onClick={() => {
            if (hasFlashlight) {
              sound.playKeypadClick();
              if (activeSlot === 1) {
                // If already holding, click toggles flashlight light
                onToggleFlashlight();
              } else {
                setActiveSlot(1);
              }
            }
          }}
          className={`relative w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-150 select-none ${
            activeSlot === 1
              ? 'bg-zinc-900/95 border-2 border-yellow-400 shadow-xl shadow-yellow-500/25 -translate-y-1'
              : 'bg-black/80 hover:bg-zinc-900/80 border border-zinc-700/80'
          }`}
          title={
            hasFlashlight
              ? (activeSlot === 1
                ? 'Senter Dipegang (Klik Kiri / [F] untuk ON/OFF)'
                : 'Tekan [1] untuk Pegang Senter')
              : 'Slot 1: Kosong (Ambil senter di meja)'
          }
        >
          {/* Slot Number Label 1 */}
          <span className="absolute top-1 left-1.5 text-[10px] font-mono font-black text-zinc-400 leading-none">
            1
          </span>

          {hasFlashlight ? (
            <>
              {isFlashlightOn && activeSlot === 1 ? (
                <Flashlight className="w-6 h-6 text-yellow-300 animate-pulse drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
              ) : (
                <Flashlight className={`w-6 h-6 ${activeSlot === 1 ? 'text-zinc-200' : 'text-zinc-500'}`} />
              )}
              {/* Status indicator dot */}
              <div
                className={`absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full ${
                  isFlashlightOn && activeSlot === 1
                    ? 'bg-emerald-400 shadow-[0_0_4px_#34d399]'
                    : 'bg-zinc-600'
                }`}
              />
            </>
          ) : (
            /* Empty slot */
            <div className="w-5 h-5 rounded border border-dashed border-zinc-800" />
          )}

          {activeSlot === 1 && (
            <div className="absolute -top-1.5 right-1 w-2 h-2 rounded-full bg-yellow-400" />
          )}
        </button>

        {/* SLOT 2 (Kertas Hint atau Kunci) */}
        <button
          onClick={() => {
            if (hasHintPaper || hasKey) {
              sound.playKeypadClick();
              if (activeSlot === 2) {
                if (hasHintPaper) onOpenHintPaper();
                else setActiveSlot(null);
              } else {
                setActiveSlot(2);
                if (hasHintPaper) onOpenHintPaper();
              }
            }
          }}
          className={`relative w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-150 select-none ${
            activeSlot === 2
              ? 'bg-zinc-900/95 border-2 border-emerald-400 shadow-xl shadow-emerald-500/25 -translate-y-1'
              : 'bg-black/80 hover:bg-zinc-900/80 border border-zinc-700/80'
          }`}
          title={
            hasHintPaper
              ? (activeSlot === 2
                ? 'Kertas Hint Dipegang (Klik / [H] untuk Baca Catatan)'
                : 'Tekan [2] untuk Pegang Kertas Hint')
              : hasKey
              ? 'Kunci Emas Peti Intelijen'
              : 'Slot 2: Kosong'
          }
        >
          {/* Slot Number Label 2 */}
          <span className="absolute top-1 left-1.5 text-[10px] font-mono font-black text-zinc-400 leading-none">
            2
          </span>

          {hasHintPaper ? (
            <>
              <FileText className={`w-6 h-6 ${activeSlot === 2 ? 'text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'text-emerald-500'}`} />
              <span className="absolute bottom-1 text-[8px] font-mono font-bold text-emerald-400 leading-none">
                HINT
              </span>
            </>
          ) : hasKey ? (
            <>
              <Key className="w-6 h-6 text-yellow-400 fill-yellow-400/40" />
              <span className="absolute bottom-1 text-[8px] font-mono font-bold text-yellow-400 leading-none">
                KEY
              </span>
            </>
          ) : (
            /* Empty slot */
            <div className="w-5 h-5 rounded border border-dashed border-zinc-800" />
          )}

          {activeSlot === 2 && (
            <div className="absolute -top-1.5 right-1 w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>

      {/* Module description overlay (bottom right when interacting) */}
      {modules[currentModuleIndex] && isInteracting && (
        <div className="absolute bottom-4 right-4 bg-zinc-900/95 backdrop-blur border border-yellow-500/50 px-3.5 py-1.5 rounded-lg text-xs font-mono text-zinc-200 max-w-sm pointer-events-auto shadow-2xl z-20">
          <span className="text-yellow-400 font-bold uppercase mr-1.5">[{modules[currentModuleIndex].category}]:</span>
          <span>{modules[currentModuleIndex].description}</span>
        </div>
      )}
    </div>
  );
};
