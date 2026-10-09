"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Product-shot lighting baked into a small env map once (frames={1}).
 * No HDR download; reflections are what make the metal and glass read.
 */
export function StudioLight({ resolution = 256 }: { resolution?: number }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      {/* soft warm key from camera side so the iris blades read */}
      <pointLight position={[0.5, 0.8, 5]} intensity={14} distance={14} decay={2} color="#ffdcb0" />
      <Environment resolution={resolution} frames={1}>
        {/* warm overhead strip */}
        <Lightformer form="rect" intensity={9} color="#ffd9a8" position={[0, 4, 1]} rotation-x={Math.PI / 2} scale={[10, 0.7, 1]} />
        {/* cool side kicker */}
        <Lightformer form="rect" intensity={4} color="#bcd4ff" position={[-5, 0.5, 1]} rotation-y={Math.PI / 2} scale={[0.6, 7, 1]} />
        {/* ring catch-light — the classic lens-ad reflection */}
        <Lightformer form="ring" intensity={3} color="#ffffff" position={[2.5, 1.5, 5]} scale={1.1} />
        {/* tungsten floor bounce */}
        <Lightformer form="rect" intensity={2.5} color="#d9a45b" position={[0, -4, -1]} rotation-x={-Math.PI / 2} scale={[12, 1.2, 1]} />
      </Environment>
    </>
  );
}
