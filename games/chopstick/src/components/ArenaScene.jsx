import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { getSkinById } from "../game/skins";
import { getOpponentSeat } from "../shared/rules";

function FingerMesh({ count, depthSign, fingerIndex, opacity, pulse, skin, x }) {
  const groupRef = useRef();
  const extended = fingerIndex < count;

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const pulseAmount = Math.sin(pulse.current * Math.PI) * 0.18;
    const targetRotation = extended ? 0.08 : 1.22;
    const targetY = extended ? 1.38 : 0.74;
    const targetZ = depthSign * (extended ? 0.12 : -0.2);
    const targetScaleY = extended ? 1 : 0.62;

    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetRotation, 8, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, targetY, 8, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, 8, delta);
    group.scale.y = THREE.MathUtils.damp(group.scale.y, targetScaleY + pulseAmount, 8, delta);
  });

  return (
    <group ref={groupRef} position={[x, 1.38, depthSign * 0.12]}>
      <mesh>
        <boxGeometry args={[0.24, 1.12, 0.34]} />
        <meshStandardMaterial
          color={count === 0 ? skin.dead : skin.finger}
          emissive={skin.glow}
          emissiveIntensity={extended ? 0.28 : 0.08}
          roughness={0.34}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshStandardMaterial
          color={count === 0 ? skin.dead : skin.finger}
          emissive={skin.accent}
          emissiveIntensity={extended ? 0.18 : 0.05}
          roughness={0.35}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}

function HandActor({
  clickable,
  count,
  isControlled,
  isSelected,
  isTurnOwner,
  lastAction,
  onClick,
  position,
  reducedMotion,
  role,
  seat,
  side,
  skin,
  slotIndex,
  theme
}) {
  const rootRef = useRef();
  const pulseRef = useRef(0);
  const attackRef = useRef(0);
  const aliveRef = useRef(count > 0 ? 1 : 0);
  const lastActionIdRef = useRef(null);
  const seed = slotIndex + (role === "bottom" ? 0.4 : 1.7);
  const basePosition = useMemo(() => new THREE.Vector3(...position), [position]);
  const baseScale = role === "bottom" ? 0.72 : 0.68;
  const depthSign = role === "bottom" ? 1 : -1;
  const sideSign = side === "left" ? -1 : 1;

  const isAttackSource =
    lastAction?.type === "attack" &&
    lastAction?.seat === seat &&
    lastAction?.from === slotIndex;
  const isAttackTarget =
    lastAction?.type === "attack" &&
    lastAction?.targetSeat === seat &&
    lastAction?.to === slotIndex;
  const isSplitTarget =
    lastAction?.type === "split" &&
    lastAction?.seat === seat;

  useEffect(() => {
    if (!lastAction || lastAction.id === lastActionIdRef.current) {
      return;
    }

    if (isAttackSource) {
      attackRef.current = 1;
    }

    if (isAttackTarget || isSplitTarget) {
      pulseRef.current = 1;
    }

    lastActionIdRef.current = lastAction.id;
  }, [isAttackSource, isAttackTarget, isSplitTarget, lastAction]);

  useFrame((state, delta) => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    attackRef.current = Math.max(0, attackRef.current - delta * (reducedMotion ? 6.5 : 3.2));
    pulseRef.current = Math.max(0, pulseRef.current - delta * (reducedMotion ? 7 : 3.8));
    aliveRef.current = THREE.MathUtils.damp(aliveRef.current, count === 0 ? 0 : 1, 5.5, delta);

    const elapsed = state.clock.getElapsedTime();
    const idle = reducedMotion ? 0 : Math.sin(elapsed * 1.2 + seed) * 0.08;
    const pulse = Math.sin(pulseRef.current * Math.PI) * 0.14;
    const attackWave = Math.sin(attackRef.current * Math.PI);
    const targetOffsetX =
      lastAction?.type === "attack"
        ? (lastAction.to === 0 ? -1 : 1) * 0.45
        : 0;
    const forwardLift = role === "bottom" ? 0.55 : -0.55;
    const forwardPush = role === "bottom" ? -1.05 : 1.05;
    const deadDrop = (1 - aliveRef.current) * 0.7;
    const bob = idle + pulse;

    root.position.set(
      basePosition.x + attackWave * targetOffsetX,
      basePosition.y + bob - deadDrop + attackWave * forwardLift,
      basePosition.z + attackWave * forwardPush
    );

    if (role === "bottom") {
      root.rotation.set(
        -Math.PI / 2 + attackWave * 0.16 + (1 - aliveRef.current) * 0.8,
        0,
        sideSign * (0.05 + attackWave * 0.04)
      );
    } else {
      root.rotation.set(
        Math.PI - 0.82 + attackWave * 0.2 - (1 - aliveRef.current) * 0.8,
        0,
        sideSign * (-0.08 - attackWave * 0.05)
      );
    }

    root.scale.setScalar(baseScale * (isSelected ? 1.05 : 1) * (1 + pulse * 0.16));
  });

  const opacity = 0.35 + aliveRef.current * 0.65;
  const activeGlow = isSelected ? 0.9 : isTurnOwner ? 0.55 : 0.28;
  const ringColor = isControlled ? skin.glow : theme === "light" ? "#c9a56b" : "#d4c09f";

  return (
    <group
      onPointerDown={clickable ? onClick : undefined}
      ref={rootRef}
    >
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.45, 1.65, 0.68]} />
          <meshStandardMaterial
            color={count === 0 ? skin.dead : skin.palm}
            emissive={skin.accent}
            emissiveIntensity={activeGlow}
            metalness={0.18}
            roughness={0.44}
            transparent
            opacity={opacity}
          />
        </mesh>

        {[-0.52, -0.17, 0.17, 0.52].map((fingerX, fingerIndex) => (
          <FingerMesh
            count={count}
            depthSign={depthSign}
            fingerIndex={fingerIndex}
            key={fingerIndex}
            opacity={opacity}
            pulse={pulseRef}
            skin={skin}
            x={fingerX}
          />
        ))}

        <mesh
          position={[sideSign * 0.92, -0.26, depthSign * 0.08]}
          rotation={[0, 0, sideSign * -0.72]}
        >
          <boxGeometry args={[0.5, 1.05, 0.52]} />
          <meshStandardMaterial
            color={count === 0 ? skin.dead : skin.finger}
            emissive={skin.glow}
            emissiveIntensity={activeGlow * 0.6}
            roughness={0.4}
            transparent
            opacity={opacity}
          />
        </mesh>

        <mesh position={[0, -0.12, depthSign * -0.42]}>
          <boxGeometry args={[1.18, 1.22, 0.2]} />
          <meshStandardMaterial
            color="#072032"
            emissive={skin.glow}
            emissiveIntensity={activeGlow * 0.4}
            roughness={0.5}
            transparent
            opacity={0.76}
          />
        </mesh>
      </group>

      <mesh position={[0, -1.18, -0.54]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.88, 1.12, 48]} />
        <meshBasicMaterial
          color={ringColor}
          transparent
          opacity={isSelected ? 0.72 : isTurnOwner ? 0.34 : 0.15}
        />
      </mesh>
    </group>
  );
}

function CameraRig() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, -0.1, 11.2);
    camera.lookAt(0, -0.95, -1.15);
  }, [camera]);

  return null;
}

function ArenaStage({
  controlledSeat,
  match,
  onHandClick,
  perspectiveSeat,
  players,
  reducedMotion,
  selectedHand,
  theme
}) {
  const opponentSeat = getOpponentSeat(perspectiveSeat);
  const lastAction = match?.lastAction;
  const palette =
    theme === "light"
      ? {
          background: "#f8f3ea",
          fog: "#f6eee1",
          floor: "#e4d4b8",
          ringPrimary: "#caa165",
          ringSecondary: "#ddbf8b",
          wall: "#f2e5d2",
          wallOpacity: 0.72,
          hemiSky: "#fff6e8",
          hemiGround: "#d4c0a2",
          frontLight: "#f6ebd8",
          frontLightIntensity: 1.08,
          coolLight: "#d7bb89",
          coolLightIntensity: 0.45,
          warmLight: "#fff6e4",
          warmLightIntensity: 0.68,
          backLight: "#d3a86b",
          backLightIntensity: 0.35
        }
      : {
          background: "#2a3a60",
          fog: "#2a3a60",
          floor: "#243143",
          ringPrimary: "#d2ad74",
          ringSecondary: "#e7c38f",
          wall: "#1e2941",
          wallOpacity: 0.52,
          hemiSky: "#5f78b5",
          hemiGround: "#1a2338",
          frontLight: "#ffe0b6",
          frontLightIntensity: 1.25,
          coolLight: "#d6bf94",
          coolLightIntensity: 0.72,
          warmLight: "#d8be90",
          warmLightIntensity: 0.72,
          backLight: "#cfa36e",
          backLightIntensity: 0.5
        };

  const handSlots = useMemo(
    () => [
      {
        seat: perspectiveSeat,
        index: 0,
        role: "bottom",
        side: "left",
        position: [-2.05, -2.15, 2.05]
      },
      {
        seat: perspectiveSeat,
        index: 1,
        role: "bottom",
        side: "right",
        position: [2.05, -2.15, 2.05]
      },
      {
        seat: opponentSeat,
        index: 0,
        role: "top",
        side: "left",
        position: [-2.1, 0.8, -2.85]
      },
      {
        seat: opponentSeat,
        index: 1,
        role: "top",
        side: "right",
        position: [2.1, 0.8, -2.85]
      }
    ],
    [opponentSeat, perspectiveSeat]
  );

  return (
    <>
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[palette.fog, 8, 16]} />
      <ambientLight intensity={0.8} />
      <hemisphereLight args={[palette.hemiSky, palette.hemiGround, 0.75]} />
      <directionalLight color={palette.frontLight} intensity={palette.frontLightIntensity} position={[0, 4, 5]} />
      <pointLight color={palette.warmLight} intensity={palette.warmLightIntensity} position={[0, 1.55, -2.1]} />
      <pointLight color={palette.coolLight} intensity={palette.coolLightIntensity} position={[0, 1.8, 1.2]} />
      <pointLight color={palette.backLight} intensity={palette.backLightIntensity} position={[0, 0.3, -4]} />

      <group position={[0, -3.15, -1.3]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[7.5, 48]} />
          <meshStandardMaterial color={palette.floor} />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.4, 5.4, 64]} />
          <meshBasicMaterial color={palette.ringPrimary} opacity={0.18} transparent />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 2.9, 64]} />
          <meshBasicMaterial color={palette.ringSecondary} opacity={0.15} transparent />
        </mesh>
      </group>

      <mesh position={[0, 2.45, -8.8]} rotation={[0.18, 0, 0]}>
        <planeGeometry args={[15, 8.5]} />
        <meshBasicMaterial color={palette.wall} opacity={palette.wallOpacity} transparent />
      </mesh>

      {handSlots.map((slot) => {
        const player = players?.[slot.seat];
        return (
          <HandActor
            clickable={Boolean(controlledSeat)}
            count={match?.hands?.[slot.seat]?.[slot.index] ?? 0}
            isControlled={controlledSeat === slot.seat}
            isSelected={controlledSeat === slot.seat && selectedHand === slot.index}
            isTurnOwner={match?.turn === slot.seat}
            key={`${slot.seat}-${slot.index}`}
            lastAction={lastAction}
            onClick={() => onHandClick(slot.seat, slot.index)}
            position={slot.position}
            reducedMotion={reducedMotion}
            role={slot.role}
            seat={slot.seat}
            side={slot.side}
            skin={getSkinById(player?.skinId)}
            slotIndex={slot.index}
            theme={theme}
          />
        );
      })}
    </>
  );
}

export default function ArenaScene({ theme = "dark", ...props }) {
  return (
    <div className="arena-canvas">
      <Canvas
        camera={{ fov: 31, position: [0, -0.1, 11.2] }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      >
        <CameraRig />
        <ArenaStage {...props} theme={theme} />
      </Canvas>
    </div>
  );
}
