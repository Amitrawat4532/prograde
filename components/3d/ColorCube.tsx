"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { lutPacks } from "@/lib/content";
import { makeGrader } from "@/lib/grading";
import { lutSelection } from "@/lib/lutSelection";

/**
 * A real 3D LUT, visualised. An N×N×N lattice of RGB colours sits at its own
 * coordinates (the identity cube); selecting a pack moves every point to where
 * that pack's grade sends it, and recolours it. One Points draw call.
 */

const vertex = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec3 aColFrom;
  attribute vec3 aColTo;
  uniform float uMix;
  uniform float uSize;
  uniform float uReveal;
  varying vec3 vCol;
  varying float vAlpha;
  void main() {
    float e = uMix * uMix * (3.0 - 2.0 * uMix);
    vec3 p = mix(aFrom, aTo, e) * uReveal;
    vCol = mix(aColFrom, aColTo, e);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize / -mv.z;
    vAlpha = smoothstep(9.0, 4.0, -mv.z); // depth fade
  }
`;

const fragment = /* glsl */ `
  varying vec3 vCol;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.2, d) * (0.55 + 0.45 * vAlpha);
    gl_FragColor = vec4(vCol, a);
  }
`;

function buildTargets(n: number) {
  const count = n * n * n;
  const identity = new Float32Array(count * 3);
  const colours = new Float32Array(count * 3);
  let k = 0;
  for (let r = 0; r < n; r++)
    for (let g = 0; g < n; g++)
      for (let b = 0; b < n; b++) {
        const c = [r / (n - 1), g / (n - 1), b / (n - 1)];
        colours.set(c, k);
        identity.set(c.map((v) => v * 2 - 1), k);
        k += 3;
      }
  // Per pack: graded colour + where it lands in the cube.
  const packs = lutPacks.map((p) => {
    const grade = makeGrader(p.grade);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const [R, G, B] = grade(colours[i], colours[i + 1], colours[i + 2]);
      col[i] = R;
      col[i + 1] = G;
      col[i + 2] = B;
      pos[i] = R * 2 - 1;
      pos[i + 1] = G * 2 - 1;
      pos[i + 2] = B * 2 - 1;
    }
    return { pos, col };
  });
  return { count, identity, colours, packs };
}

function Cube({ lite, active }: { lite: boolean; active: boolean }) {
  const n = lite ? 11 : 17;
  const data = useMemo(() => buildTargets(n), [n]);
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const drag = useRef({ on: false, x: 0, y: 0, vy: 0, vx: 0 });
  const mixState = useRef({ value: 0, target: 1 });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const first = data.packs[lutSelection.get()];
    g.setAttribute("position", new THREE.BufferAttribute(data.identity, 3));
    g.setAttribute("aFrom", new THREE.BufferAttribute(data.identity.slice(), 3));
    g.setAttribute("aTo", new THREE.BufferAttribute(first.pos.slice(), 3));
    g.setAttribute("aColFrom", new THREE.BufferAttribute(data.colours.slice(), 3));
    g.setAttribute("aColTo", new THREE.BufferAttribute(first.col.slice(), 3));
    return g;
  }, [data]);

  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2)), []);
  // Stable uniforms object — an inline one would be re-applied (and reset) on every React render.
  const uniforms = useMemo(() => ({ uMix: { value: 0 }, uSize: { value: 30 }, uReveal: { value: 0.2 } }), []);

  // Morph to the newly selected pack, starting from wherever the points are now.
  useEffect(
    () =>
      lutSelection.subscribe((i) => {
        const e = mixState.current.value;
        const s = e * e * (3 - 2 * e);
        const from = geo.getAttribute("aFrom") as THREE.BufferAttribute;
        const to = geo.getAttribute("aTo") as THREE.BufferAttribute;
        const cFrom = geo.getAttribute("aColFrom") as THREE.BufferAttribute;
        const cTo = geo.getAttribute("aColTo") as THREE.BufferAttribute;
        const f = from.array as Float32Array;
        const t = to.array as Float32Array;
        const cf = cFrom.array as Float32Array;
        const ct = cTo.array as Float32Array;
        for (let k = 0; k < f.length; k++) {
          f[k] += (t[k] - f[k]) * s;
          cf[k] += (ct[k] - cf[k]) * s;
        }
        t.set(data.packs[i].pos);
        ct.set(data.packs[i].col);
        from.needsUpdate = to.needsUpdate = cFrom.needsUpdate = cTo.needsUpdate = true;
        mixState.current.value = 0;
      }),
    [geo, data],
  );

  useFrame((state, dt) => {
    const m = mat.current;
    const g = group.current;
    if (!m || !g) return;
    const ms = mixState.current;
    ms.value = Math.min(1, ms.value + dt / 1.6);
    m.uniforms.uMix.value = ms.value;
    m.uniforms.uReveal.value = THREE.MathUtils.damp(m.uniforms.uReveal.value, active ? 1 : 0.2, 2.5, dt);
    m.uniforms.uSize.value = (lite ? 16 : 13) * state.viewport.dpr;

    const d = drag.current;
    if (!d.on) {
      d.vy = THREE.MathUtils.damp(d.vy, 0.18, 1.5, dt);
      d.vx = THREE.MathUtils.damp(d.vx, 0, 2, dt);
    }
    g.rotation.y += d.vy * dt;
    g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + d.vx * dt, -0.9, 0.9);
  });

  return (
    <group
      ref={group}
      rotation={[0.45, -0.6, 0]}
      onPointerDown={(e) => {
        drag.current.on = true;
        drag.current.x = e.clientX;
        drag.current.y = e.clientY;
        (e.target as Element).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d.on) return;
        d.vy = (e.clientX - d.x) * 0.08;
        d.vx = (e.clientY - d.y) * 0.06;
        d.x = e.clientX;
        d.y = e.clientY;
      }}
      onPointerUp={() => (drag.current.on = false)}
      onPointerLeave={() => (drag.current.on = false)}
    >
      <points geometry={geo}>
        <shaderMaterial
          ref={mat}
          vertexShader={vertex}
          fragmentShader={fragment}
          transparent
          depthWrite={false}
          uniforms={uniforms}
        />
      </points>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#ece8e1" transparent opacity={0.18} />
      </lineSegments>
      {/* invisible hit box so the cube can be dragged anywhere */}
      <mesh>
        <boxGeometry args={[2.6, 2.6, 2.6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function ColorCube({ lite, active }: { lite: boolean; active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lite ? 1 : [1, 1.5]}
      camera={{ fov: 32, position: [0, 0, 6.4] }}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
    >
      <Cube lite={lite} active={active} />
    </Canvas>
  );
}
