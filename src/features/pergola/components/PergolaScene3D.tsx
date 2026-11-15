'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import { PANELS, type Slat } from '../rules';

export type CameraView = 'corner' | 'front' | 'top';

export interface SceneSide {
  id: 'back' | 'left' | 'right' | 'front';
  look: 'screen' | 'panels' | 'solid' | 'glass' | 'doors' | null;
  slats: Slat[];
}

export interface SceneProps {
  width: number;
  depth: number;
  wallMounted: boolean;
  sides: SceneSide[];
  led: boolean;
  heaters: number;
  evening: boolean;
  louvreAngle: number;
  view: CameraView;
  viewKey: number;
  photoMode: boolean;
  onCanvas: (canvas: HTMLCanvasElement) => void;
}

const FRAME = '#33373A';
const POST = 0.12;
const HEIGHT = 2.5;
const BEAM = 0.2;
const LIGHT = '#FFD58A';

export const lookOf = (name: string, kind: string): SceneSide['look'] => {
  if (kind === PANELS) return 'panels';
  const lower = name.toLowerCase();
  if (lower.includes('wind')) return 'screen';
  if (lower.includes('glass')) return 'glass';
  if (lower.includes('door')) return 'doors';
  return 'solid';
};

function Box({
  size,
  position,
  colour,
  opacity = 1,
  rough = 0.6,
}: {
  size: [number, number, number];
  position: [number, number, number];
  colour: string;
  opacity?: number;
  rough?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={colour}
        roughness={rough}
        metalness={0.2}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}

function Frame({
  width,
  depth,
  wallMounted,
}: {
  width: number;
  depth: number;
  wallMounted: boolean;
}) {
  const xs =
    width > 4.5
      ? [-width / 2 + POST / 2, 0, width / 2 - POST / 2]
      : [-width / 2 + POST / 2, width / 2 - POST / 2];
  const zs = wallMounted ? [depth / 2 - POST / 2] : [-depth / 2 + POST / 2, depth / 2 - POST / 2];
  const top = HEIGHT + BEAM / 2;
  return (
    <group>
      {xs.flatMap((x) =>
        zs.map((z) => (
          <Box
            key={`${x}:${z}`}
            size={[POST, HEIGHT, POST]}
            position={[x, HEIGHT / 2, z]}
            colour={FRAME}
          />
        )),
      )}
      {[-1, 1].map((s) => (
        <Box
          key={`x${s}`}
          size={[width, BEAM, POST]}
          position={[0, top, s * (depth / 2 - POST / 2)]}
          colour={FRAME}
        />
      ))}
      {[-1, 1].map((s) => (
        <Box
          key={`z${s}`}
          size={[POST, BEAM, depth]}
          position={[s * (width / 2 - POST / 2), top, 0]}
          colour={FRAME}
        />
      ))}
    </group>
  );
}

function Roof({ width, depth, angle }: { width: number; depth: number; angle: number }) {
  const gap = 0.2;
  const count = Math.floor((width - POST * 2) / gap);
  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          position={[-width / 2 + POST + gap / 2 + i * gap, HEIGHT + BEAM / 2, 0]}
          rotation={[0, 0, (angle * Math.PI) / 180]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.19, 0.02, depth - POST * 2]} />
          <meshStandardMaterial color={FRAME} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function SideFill({ side, width, depth }: { side: SceneSide; width: number; depth: number }) {
  if (!side.look) return null;
  const along = side.id === 'back' || side.id === 'front' ? width : depth;
  const inner = along - POST * 2;
  const offset = side.id === 'back' || side.id === 'left' ? -1 : 1;
  const across = side.id === 'back' || side.id === 'front';
  const place = (
    t: number,
    y: number,
    thickness = 0.03,
  ): {
    position: [number, number, number];
    size: (l: number, h: number) => [number, number, number];
  } => ({
    position: across
      ? [t, y, offset * (depth / 2 - POST / 2)]
      : [offset * (width / 2 - POST / 2), y, t],
    size: (l, h) => (across ? [l, h, thickness] : [thickness, h, l]),
  });

  if (side.look === 'panels') {
    const n = side.slats.length || 3;
    const panel = inner / n;
    return (
      <group>
        {side.slats.map((slat, m) => {
          const centre = -inner / 2 + panel * (m + 0.5);
          const slats = slat === 'horizontal' ? 16 : 8;
          return Array.from({ length: slats }, (_, k) => {
            if (slat === 'horizontal') {
              const spot = place(centre, 0.15 + (k * (HEIGHT - 0.3)) / slats, 0.04);
              return (
                <Box
                  key={`${m}-${k}`}
                  size={spot.size(panel - 0.04, 0.09)}
                  position={spot.position}
                  colour="#4B5155"
                />
              );
            }
            const spot = place(centre - panel / 2 + (panel * (k + 0.5)) / slats, HEIGHT / 2, 0.04);
            return (
              <Box
                key={`${m}-${k}`}
                size={spot.size(panel / slats - 0.03, HEIGHT - 0.1)}
                position={spot.position}
                colour="#4B5155"
              />
            );
          });
        })}
      </group>
    );
  }
  const spot = place(0, HEIGHT / 2);
  const looks = {
    screen: { colour: '#5E6360', opacity: 0.55 },
    glass: { colour: '#BFDDE8', opacity: 0.35 },
    doors: { colour: '#94663F', opacity: 1 },
    solid: { colour: '#4A514D', opacity: 1 },
  } as const;
  const { colour, opacity } = looks[side.look];
  return (
    <Box
      size={spot.size(inner, HEIGHT - 0.05)}
      position={spot.position}
      colour={colour}
      opacity={opacity}
      rough={1}
    />
  );
}

function Lights({ width, depth, evening }: { width: number; depth: number; evening: boolean }) {
  const strip = { color: LIGHT, emissive: LIGHT, emissiveIntensity: evening ? 4 : 0.8 };
  const y = HEIGHT - 0.02;
  return (
    <group>
      {[-1, 1].map((s) => (
        <mesh key={`x${s}`} position={[0, y, s * (depth / 2 - POST)]}>
          <boxGeometry args={[width - POST * 2, 0.02, 0.03]} />
          <meshStandardMaterial {...strip} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`z${s}`} position={[s * (width / 2 - POST), y, 0]}>
          <boxGeometry args={[0.03, 0.02, depth - POST * 2]} />
          <meshStandardMaterial {...strip} />
        </mesh>
      ))}
      {evening && (
        <pointLight position={[0, HEIGHT - 0.3, 0]} intensity={6} distance={7} color={LIGHT} />
      )}
    </group>
  );
}

function Heaters({
  count,
  width,
  depth,
  evening,
}: {
  count: number;
  width: number;
  depth: number;
  evening: boolean;
}) {
  const shown = Math.min(count, 6);
  return (
    <group>
      {Array.from({ length: shown }, (_, i) => (
        <group
          key={i}
          position={[
            -width / 2 + (width * (i + 0.5)) / shown,
            HEIGHT - 0.15,
            -depth / 2 + POST + 0.06,
          ]}
        >
          <mesh rotation={[0.5, 0, 0]}>
            <boxGeometry args={[0.6, 0.12, 0.08]} />
            <meshStandardMaterial
              color="#2A2A2A"
              emissive="#FF5A1F"
              emissiveIntensity={evening ? 1.2 : 0.1}
            />
          </mesh>
          {evening && (
            <pointLight position={[0, -0.4, 0.4]} intensity={2} distance={3} color="#FF8A4C" />
          )}
        </group>
      ))}
    </group>
  );
}

function paving() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#C9C1B4';
    context.fillRect(0, 0, 512, 512);
    for (const [x, y] of [
      [0, 0],
      [256, 0],
      [0, 256],
      [256, 256],
    ] as const) {
      context.fillStyle = '#E3DDD2';
      context.fillRect(x + 3, y + 3, 250, 250);
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function Ground({
  width,
  depth,
  evening,
  garden,
}: {
  width: number;
  depth: number;
  evening: boolean;
  garden: boolean;
}) {
  const w = width + 1.6;
  const d = depth + 1.6;
  const texture = useMemo(() => {
    const made = paving();
    made.repeat.set(w / 1.2, d / 1.2);
    return made;
  }, [w, d]);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial map={texture} roughness={0.85} />
      </mesh>
      {garden && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[14, 64]} />
          <meshStandardMaterial color={evening ? '#4E5C44' : '#A7BF8C'} roughness={1} />
        </mesh>
      )}
    </group>
  );
}

function HouseWall({ width, depth }: { width: number; depth: number }) {
  return (
    <Box
      size={[width + 4, 3.4, 0.3]}
      position={[0, 1.7, -depth / 2 - 0.15]}
      colour="#B8846A"
      rough={1}
    />
  );
}

function CameraRig({
  view,
  viewKey,
  width,
  depth,
}: {
  view: CameraView;
  viewKey: number;
  width: number;
  depth: number;
}) {
  const { camera, controls } = useThree();
  useEffect(() => {
    const positions: Record<CameraView, [number, number, number]> = {
      corner: [width * 0.95 + 3.4, 4.2, depth * 0.95 + 4.6],
      front: [0, 2.1, depth / 2 + 6.2],
      top: [0, width + depth + 4, 0.001],
    };
    camera.position.set(...positions[view]);
    const orbit = controls as unknown as {
      target: { set: (x: number, y: number, z: number) => void };
      update: () => void;
    } | null;
    orbit?.target.set(0, view === 'top' ? 0 : 1, 0);
    orbit?.update();
  }, [view, viewKey, width, depth, camera, controls]);
  return null;
}

function CanvasHandle({ onCanvas }: { onCanvas: (canvas: HTMLCanvasElement) => void }) {
  const { gl } = useThree();
  useEffect(() => onCanvas(gl.domElement), [gl, onCanvas]);
  return null;
}

// Tolu's design: the pergola in 3D, turned and zoomed with a finger or mouse.
export default function PergolaScene3D(props: SceneProps) {
  const {
    width,
    depth,
    wallMounted,
    sides,
    led,
    heaters,
    evening,
    louvreAngle,
    view,
    viewKey,
    photoMode,
    onCanvas,
  } = props;
  const sky = evening ? '#2B2F4A' : '#EEF1F2';
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [width * 0.95 + 3.4, 4.2, depth * 0.95 + 4.6], fov: 40 }}
      gl={{ alpha: true, preserveDrawingBuffer: true, antialias: true }}
    >
      {!photoMode && <color attach="background" args={[sky]} />}
      {!photoMode && <fog attach="fog" args={[sky, 14, 30]} />}
      <hemisphereLight
        args={[
          evening ? '#56608F' : '#FFFFFF',
          evening ? '#1B2018' : '#B9C7A6',
          evening ? 0.7 : 1.1,
        ]}
      />
      <directionalLight
        position={[5, 9, 6]}
        intensity={evening ? 0.45 : 2.2}
        color={evening ? '#9AA6D8' : '#FFF6E8'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.0004}
      />
      <Ground width={width} depth={depth} evening={evening} garden={!photoMode} />
      {wallMounted && <HouseWall width={width} depth={depth} />}
      <Frame width={width} depth={depth} wallMounted={wallMounted} />
      {view !== 'top' && <Roof width={width} depth={depth} angle={louvreAngle} />}
      {sides.map((side) => (
        <SideFill key={side.id} side={side} width={width} depth={depth} />
      ))}
      {led && <Lights width={width} depth={depth} evening={evening} />}
      {heaters > 0 && <Heaters count={heaters} width={width} depth={depth} evening={evening} />}
      <OrbitControls
        makeDefault
        enableDamping
        target={[0, 1, 0]}
        minDistance={3}
        maxDistance={22}
        maxPolarAngle={Math.PI / 2 - 0.08}
      />
      <CameraRig view={view} viewKey={viewKey} width={width} depth={depth} />
      <CanvasHandle onCanvas={onCanvas} />
    </Canvas>
  );
}
