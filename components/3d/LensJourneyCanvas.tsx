"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Lens, type LensControls } from "./Lens";
import { StudioLight } from "./StudioLight";
import { journeyStage, easeInOut, range } from "@/lib/stage";

const { lerp, damp } = THREE.MathUtils;

/** One small dust field — the only particle system on the site, desktop only. */
function Dust({ count = 420 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (rand() - 0.5) * 14;
      p[i * 3 + 1] = (rand() - 0.5) * 9;
      p[i * 3 + 2] = (rand() - 0.5) * 18;
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, [count]);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.012;
      ref.current.position.y = Math.sin(performance.now() * 0.0001) * 0.3;
    }
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#e2b67a" size={0.022} sizeAttenuation transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Journey({ lite }: { lite: boolean }) {
  const group = useRef<THREE.Group>(null);
  const controls = useRef<LensControls>({ aperture: 0.3, focus: 0 });
  const p = useRef(0);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    p.current = damp(p.current, journeyStage.progress, 5, dt);
    const t = p.current;
    const cam = state.camera as THREE.PerspectiveCamera;

    const a = easeInOut(range(t, 0, 0.25)); // distant → closer
    const b = easeInOut(range(t, 0.25, 0.5)); // rotate
    const c = easeInOut(range(t, 0.5, 0.75)); // square up, open
    const d = easeInOut(range(t, 0.75, 0.95)); // through the glass

    // camera dolly
    const z = lerp(lerp(lerp(lerp(17, 8.5, a), 6.4, b), 2.6, c), -1.4, d);
    cam.position.z = z;
    cam.position.x = lerp(0, 0.9, b) * (1 - c);
    cam.position.y = lerp(0.6, 0, a);
    cam.fov = lerp(32, 62, d);
    cam.updateProjectionMatrix();
    cam.lookAt(0, 0, 0);

    // lens choreography
    const idle = state.clock.elapsedTime;
    g.rotation.y = lerp(lerp(lerp(-1.05, -0.55, a), 0.55, b), 0, c);
    g.rotation.x = lerp(lerp(0.32, 0.12, a), 0, c) + Math.sin(idle * 0.4) * 0.02 * (1 - c);
    g.rotation.z = idle * 0.03 * (1 - c);
    controls.current.aperture = t < 0.45 ? lerp(0.45, 0.08, range(t, 0.2, 0.45)) : lerp(0.08, 1, range(t, 0.5, 0.8));
    controls.current.focus = t * 5;
  });

  return (
    <group ref={group}>
      <Lens controls={controls} detail={lite ? "lite" : "full"} />
    </group>
  );
}

export default function LensJourneyCanvas({ active, lite }: { active: boolean; lite: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lite ? 1 : [1, 1.6]}
      camera={{ fov: 32, position: [0, 0.6, 17], near: 0.01, far: 60 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <StudioLight resolution={lite ? 128 : 256} />
      <Journey lite={lite} />
      {!lite && <Dust />}
    </Canvas>
  );
}
