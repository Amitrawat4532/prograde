"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * A procedural cine lens. Built from primitives (no model download):
 *  - the anodised barrel is ONE merged geometry → one draw call
 *  - rubber focus ring with real ridges, an engraved scale, an amber index ring
 *  - two coated glass elements and a 9-blade iris that opens/closes
 * The lens is modelled along +Y and turned to face +Z.
 */

export type LensControls = {
  /** 0 = stopped down, 1 = wide open */
  aperture: number;
  /** radians — rotates the focus ring */
  focus: number;
};

type Props = {
  controls: RefObject<LensControls>;
  detail?: "full" | "lite";
};

const SEG_FULL = 96;
const SEG_LITE = 48;

function tube(r0: number, r1: number, y0: number, y1: number, seg: number) {
  const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, seg, 1, true);
  g.translate(0, (y0 + y1) / 2, 0);
  return g;
}

function annulus(inner: number, outer: number, y: number, up: boolean, seg: number) {
  const g = new THREE.RingGeometry(inner, outer, seg, 1);
  g.rotateX(up ? -Math.PI / 2 : Math.PI / 2);
  g.translate(0, y, 0);
  return g;
}

function buildBarrel(seg: number) {
  const parts = [
    annulus(0.7, 0.8, -1.7, false, seg),
    tube(0.8, 0.8, -1.7, -1.55, seg),
    annulus(0.8, 0.92, -1.55, false, seg),
    tube(0.92, 0.92, -1.55, -1.4, seg),
    annulus(0.92, 0.96, -1.4, false, seg),
    tube(0.96, 0.96, -1.4, -0.95, seg),
    annulus(0.96, 1.0, -0.95, false, seg),
    tube(1.0, 1.0, -0.95, -0.58, seg),
    annulus(0.97, 1.0, -0.58, true, seg),
    tube(0.97, 0.97, -0.58, 0.56, seg),
    annulus(0.97, 1.01, 0.56, false, seg),
    tube(1.01, 1.01, 0.56, 1.18, seg),
    tube(1.01, 1.1, 1.18, 1.3, seg),
    tube(1.1, 1.1, 1.3, 1.44, seg),
    annulus(0.9, 1.1, 1.44, true, seg),
  ];
  const merged = mergeGeometries(parts, false)!;
  parts.forEach((p) => p.dispose());
  return merged;
}

/** Rubber focus grip: alternate vertices pushed out to form ridges. */
function buildGrip(seg: number) {
  const ridges = seg === SEG_FULL ? 144 : 72;
  const g = new THREE.CylinderGeometry(1.06, 1.06, 0.88, ridges, 1, true);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const a = Math.atan2(z, x);
    const k = Math.round(((a + Math.PI) / (Math.PI * 2)) * ridges) % 2 === 0 ? 1 : 0.975;
    pos.setX(i, x * k);
    pos.setZ(i, z * k);
  }
  g.computeVertexNormals();
  g.translate(0, 0.1, 0);
  const caps = [annulus(0.97, 1.06, -0.34, false, seg), annulus(0.97, 1.06, 0.54, true, seg)];
  const merged = mergeGeometries([g.toNonIndexed(), ...caps.map((c) => c.toNonIndexed())], false)!;
  merged.computeVertexNormals();
  return merged;
}

function engravingTexture() {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 96;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = "rgba(236,232,225,0.92)";
  ctx.font = "600 34px ui-monospace, Menlo, monospace";
  ctx.textBaseline = "middle";
  const text = "PROGRADE   CINE 35 mm   T1.5      ∞    10    5    3    2    1.5    1 m";
  ctx.fillText(text, 40, 34);
  ctx.fillStyle = "rgba(217,164,91,0.95)";
  ctx.fillRect(40, 70, 1200, 2);
  for (let i = 0; i < 24; i++) ctx.fillRect(40 + i * 50, 62, 2, i % 4 === 0 ? 18 : 10);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function Lens({ controls, detail = "full" }: Props) {
  const seg = detail === "full" ? SEG_FULL : SEG_LITE;
  const grip = useRef<THREE.Mesh>(null);
  const blades = useRef<(THREE.Group | null)[]>([]);
  const ap = useRef(0.5);

  const geo = useMemo(() => {
    const capFront = new THREE.SphereGeometry(2.0, seg, 16, 0, Math.PI * 2, 0, Math.asin(0.9 / 2.0));
    capFront.translate(0, 1.22 - 2.0 * Math.cos(Math.asin(0.9 / 2.0)), 0);
    const capInner = new THREE.SphereGeometry(1.4, seg, 12, 0, Math.PI * 2, 0, Math.asin(0.8 / 1.4));
    capInner.translate(0, 0.7 - 1.4 * Math.cos(Math.asin(0.8 / 1.4)), 0);
    return {
      barrel: buildBarrel(seg),
      grip: buildGrip(seg),
      bore: tube(0.885, 0.885, -1.7, 1.44, seg),
      band: tube(1.0115, 1.0115, 0.7, 0.98, seg),
      index: new THREE.TorusGeometry(1.013, 0.008, 6, seg * 2),
      capFront,
      capInner,
      blade: new THREE.BoxGeometry(0.98, 0.42, 0.012),
    };
  }, [seg]);

  const mat = useMemo(() => {
    const tex = engravingTexture();
    tex.wrapS = THREE.RepeatWrapping;
    return {
      metal: new THREE.MeshStandardMaterial({ color: "#26262a", metalness: 0.92, roughness: 0.3, envMapIntensity: 1.5 }),
      rubber: new THREE.MeshStandardMaterial({ color: "#161616", metalness: 0.25, roughness: 0.7, envMapIntensity: 1.4 }),
      bore: new THREE.MeshStandardMaterial({ color: "#020202", metalness: 0, roughness: 1, side: THREE.BackSide }),
      band: new THREE.MeshStandardMaterial({ map: tex, transparent: true, metalness: 0.2, roughness: 0.5, depthWrite: false }),
      amber: new THREE.MeshStandardMaterial({ color: "#d9a45b", emissive: "#5a3510", metalness: 0.6, roughness: 0.3 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#05070a",
        metalness: 0.1,
        roughness: 0.04,
        transparent: true,
        opacity: 0.32,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        iridescence: detail === "full" ? 1 : 0.6,
        iridescenceIOR: 1.6,
        iridescenceThicknessRange: [180, 520],
        envMapIntensity: 2.4,
        depthWrite: false,
      }),
      blade: new THREE.MeshStandardMaterial({ color: "#2b2a2e", metalness: 0.85, roughness: 0.28, envMapIntensity: 2.2 }),
    };
  }, [detail]);

  useFrame((_, dt) => {
    const c = controls.current;
    if (!c) return;
    ap.current = THREE.MathUtils.damp(ap.current, c.aperture, 4, dt);
    // closed: blades swing toward centre; open: tuck behind the barrel
    const swing = THREE.MathUtils.lerp(0.42, 1.38, ap.current);
    for (let i = 0; i < blades.current.length; i++) {
      const b = blades.current[i];
      if (b) b.rotation.z = (i / 9) * Math.PI * 2 + Math.PI + swing;
    }
    if (grip.current) grip.current.rotation.y = THREE.MathUtils.damp(grip.current.rotation.y, c.focus, 3, dt);
  });

  return (
    <group rotation-x={Math.PI / 2}>
      <mesh geometry={geo.barrel} material={mat.metal} />
      <mesh ref={grip} geometry={geo.grip} material={mat.rubber} />
      <mesh geometry={geo.bore} material={mat.bore} />
      <mesh geometry={geo.band} material={mat.band} rotation-y={-0.6} />
      <mesh geometry={geo.index} material={mat.amber} position-y={1.16} rotation-x={Math.PI / 2} />

      {/* iris — built in XY, turned to sit across the bore */}
      <group position-y={0.25} rotation-x={-Math.PI / 2}>
        {Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2;
          return (
            <group
              key={i}
              ref={(g) => {
                blades.current[i] = g;
              }}
              position={[Math.cos(a) * 0.86, Math.sin(a) * 0.86, i * 0.0025]}
            >
              <mesh geometry={geo.blade} material={mat.blade} position-x={0.47} />
            </group>
          );
        })}
      </group>

      <mesh geometry={geo.capInner} material={mat.glass} renderOrder={1} />
      <mesh geometry={geo.capFront} material={mat.glass} renderOrder={2} />
    </group>
  );
}
// #?