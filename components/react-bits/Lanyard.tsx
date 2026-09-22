"use client";

import {
  Suspense,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";
import "./Lanyard.css";

const CARD_GLB = "/models/card.glb";
const STRAP_COLOR = "#02462e";
const STRAP_WIDTH = 0.28;
const STRAP_THICKNESS = 0.05;

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

type CardNodes = {
  card: THREE.Mesh;
  clip: THREE.Mesh;
  clamp: THREE.Mesh;
};

type CardMaterials = {
  base: THREE.MeshStandardMaterial;
  metal: THREE.MeshStandardMaterial;
};

type BodyWithLerp = RapierRigidBody & { lerped?: THREE.Vector3 };

type Vec3Like = { x: number; y: number; z: number };

type LanyardProps = {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage: string;
  backImage: string;
  imageFit?: "cover" | "contain";
  onContextLost?: () => void;
};

type BandProps = {
  maxSpeed?: number;
  minSpeed?: number;
  frontImage: string;
  backImage: string;
  imageFit: "cover" | "contain";
};

const yAxis = new THREE.Vector3(0, 1, 0);
const strapDir = new THREE.Vector3();
const strapMid = new THREE.Vector3();

function alignStrap(
  mesh: THREE.Mesh | null,
  from: Vec3Like,
  to: Vec3Like,
) {
  if (!mesh) return;
  strapDir.set(to.x - from.x, to.y - from.y, to.z - from.z);
  const len = strapDir.length();
  if (len < 0.001) {
    mesh.visible = false;
    return;
  }
  mesh.visible = true;
  strapMid.set(
    (from.x + to.x) * 0.5,
    (from.y + to.y) * 0.5,
    (from.z + to.z) * 0.5,
  );
  mesh.position.copy(strapMid);
  mesh.quaternion.setFromUnitVectors(yAxis, strapDir.multiplyScalar(1 / len));
  mesh.scale.set(1, len, 1);
}

export default function Lanyard({
  position = [0, 0, 24],
  gravity = [0, -40, 0],
  fov = 18,
  frontImage,
  backImage,
  imageFit = "cover",
  onContextLost,
}: LanyardProps) {
  return (
    <div className="lanyard-wrapper" data-lenis-prevent>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, 1.25]}
        gl={{
          alpha: true,
          antialias: true,
          stencil: false,
          powerPreference: "low-power",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#02462e"), 0);
          const canvas = gl.domElement;
          canvas.style.background = "transparent";
          const handleLost = (event: Event) => {
            event.preventDefault();
            onContextLost?.();
          };
          canvas.addEventListener("webglcontextlost", handleLost, false);
        }}
      >
        <ambientLight intensity={1.35} />
        <directionalLight position={[5, 8, 6]} intensity={2.4} />
        <directionalLight position={[-4, 2, 5]} intensity={1.1} />
        <directionalLight position={[0, -2, 8]} intensity={0.55} />
        <Suspense fallback={null}>
          <Physics gravity={gravity} interpolate timeStep={1 / 60}>
            <Band
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
            />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  frontImage,
  backImage,
  imageFit,
}: BandProps) {
  const strap1 = useRef<THREE.Mesh>(null);
  const strap2 = useRef<THREE.Mesh>(null);
  const strap3 = useRef<THREE.Mesh>(null);
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<BodyWithLerp>(null);
  const j2 = useRef<BodyWithLerp>(null);
  const j3 = useRef<BodyWithLerp>(null);
  const card = useRef<RapierRigidBody>(null);

  const vec = useRef(new THREE.Vector3()).current;
  const ang = useRef(new THREE.Vector3()).current;
  const rot = useRef(new THREE.Vector3()).current;
  const dir = useRef(new THREE.Vector3()).current;

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(CARD_GLB) as unknown as {
    nodes: CardNodes;
    materials: CardMaterials;
  };
  const frontTex = useTexture(frontImage);
  const backTex = useTexture(backImage);

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    if (!baseMap?.image || !frontTex.image || !backTex.image) {
      return baseMap ?? null;
    }

    const baseImg = baseMap.image as CanvasImageSource & {
      width: number;
      height: number;
    };
    const canvas = document.createElement("canvas");
    canvas.width = baseImg.width;
    canvas.height = baseImg.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return baseMap;

    ctx.drawImage(baseImg, 0, 0, baseImg.width, baseImg.height);

    const drawFitted = (
      img: CanvasImageSource & { width: number; height: number },
      rect: typeof FRONT_UV_RECT,
    ) => {
      const rx = rect.x * baseImg.width;
      const ry = rect.y * baseImg.height;
      const rw = rect.w * baseImg.width;
      const rh = rect.h * baseImg.height;
      const pick = imageFit === "cover" ? Math.max : Math.min;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.fillStyle = "#fec700";
      ctx.fillRect(rx, ry, rw, rh);
      ctx.drawImage(img, rx + (rw - dw) / 2, ry + (rh - dh) / 2, dw, dh);
      ctx.restore();
    };

    drawFitted(
      frontTex.image as CanvasImageSource & { width: number; height: number },
      FRONT_UV_RECT,
    );
    drawFitted(
      backTex.image as CanvasImageSource & { width: number; height: number },
      BACK_UV_RECT,
    );

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [backTex.image, frontTex.image, imageFit, materials.base.map]);

  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(
    fixed as RefObject<RapierRigidBody>,
    j1 as RefObject<RapierRigidBody>,
    [[0, 0, 0], [0, 0, 0], 1],
  );
  useRopeJoint(
    j1 as RefObject<RapierRigidBody>,
    j2 as RefObject<RapierRigidBody>,
    [[0, 0, 0], [0, 0, 0], 1],
  );
  useRopeJoint(
    j2 as RefObject<RapierRigidBody>,
    j3 as RefObject<RapierRigidBody>,
    [[0, 0, 0], [0, 0, 0], 1],
  );
  useSphericalJoint(
    j3 as RefObject<RapierRigidBody>,
    card as RefObject<RapierRigidBody>,
    [
      [0, 0, 0],
      [0, 1.5, 0],
    ],
  );

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (
      !fixed.current ||
      !j1.current ||
      !j2.current ||
      !j3.current ||
      !card.current
    ) {
      return;
    }

    [j1, j2, j3].forEach((ref) => {
      const body = ref.current;
      if (!body) return;
      if (!body.lerped) {
        body.lerped = new THREE.Vector3().copy(body.translation());
      }
      const clampedDistance = Math.max(
        0.1,
        Math.min(1, body.lerped.distanceTo(body.translation())),
      );
      body.lerped.lerp(
        body.translation(),
        delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
      );
    });

    const a = fixed.current.translation();
    const b = j1.current.lerped!;
    const c = j2.current.lerped!;
    const d = j3.current.lerped!;
    alignStrap(strap1.current, a, b);
    alignStrap(strap2.current, b, c);
    alignStrap(strap3.current, c, d);

    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel(
      { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
      true,
    );
  });

  return (
    <>
      <group position={[0, 3.7, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={1.9}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (
                e.target as unknown as {
                  releasePointerCapture: (id: number) => void;
                }
              ).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (
                e.target as unknown as {
                  setPointerCapture: (id: number) => void;
                }
              ).setPointerCapture(e.pointerId);
              if (!card.current) return;
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation())),
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshStandardMaterial
                map={cardMap ?? materials.base.map}
                roughness={0.85}
                metalness={0.35}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <StrapMesh ref={strap1} />
      <StrapMesh ref={strap2} />
      <StrapMesh ref={strap3} />
    </>
  );
}

const StrapMesh = forwardRef<THREE.Mesh>(function StrapMesh(_, ref) {
  return (
    <mesh ref={ref} frustumCulled={false} castShadow={false}>
      <boxGeometry args={[STRAP_WIDTH, 1, STRAP_THICKNESS]} />
      <meshStandardMaterial
        color={STRAP_COLOR}
        roughness={0.62}
        metalness={0.05}
        depthWrite
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </mesh>
  );
});

useGLTF.preload(CARD_GLB);
