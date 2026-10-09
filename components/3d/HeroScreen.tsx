"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { getImageProps } from "next/image";
import * as THREE from "three";
import type { Still } from "@/lib/content";
import { heroStage } from "@/lib/stage";

/**
 * The hero "cinema screen": one full-screen quad, one shader. Every effect —
 * focus-pull intro, film-burn transitions between frames, scroll push-in with
 * lens-style colour fringing, pointer parallax — is shader maths on a texture,
 * so nothing in the DOM is scaled or re-rasterised while scrolling.
 */

const SLIDE = 6; // seconds a frame holds
const FADE = 1.8; // seconds a transition takes

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uA;
  uniform sampler2D uB;
  uniform vec2 uResA;
  uniform vec2 uResB;
  uniform float uFocusA;
  uniform float uFocusB;
  uniform float uMix;
  uniform float uTime;
  uniform float uScroll;
  uniform float uIntro;
  uniform vec2 uMouse;
  uniform vec2 uRes;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  // object-fit: cover with a horizontal focal point, plus zoom
  vec2 cover(vec2 uv, vec2 res, float focus, float zoom) {
    float sa = uRes.x / uRes.y, ia = res.x / res.y;
    vec2 s = sa > ia ? vec2(1.0, ia / sa) : vec2(sa / ia, 1.0);
    s /= zoom;
    vec2 c = vec2(clamp(focus, s.x * 0.5, 1.0 - s.x * 0.5), 0.5);
    return c + (uv - 0.5) * s;
  }

  vec3 sampleRGB(sampler2D t, vec2 uv, vec2 dir, float ca, float bias) {
    return vec3(
      texture(t, uv + dir * ca, bias).r,
      texture(t, uv, bias).g,
      texture(t, uv - dir * ca, bias).b
    );
  }

  void main() {
    vec2 uv = vUv;
    vec2 fromC = uv - 0.5;
    float r = length(fromC);
    vec2 dir = r > 0.0 ? fromC / r : vec2(0.0);

    // scroll: push in, slight barrel bend, stronger fringing towards the edges
    float push = 1.0 + uScroll * 0.32 + (1.0 - uIntro) * 0.14;
    uv -= fromC * (r * r) * uScroll * 0.35;
    uv += uMouse * 0.012;
    float ca = (0.0018 + uScroll * 0.012) * r;
    float bias = (1.0 - uIntro) * 5.0; // focus pull via mip bias

    // film-burn transition between frames
    float n = fbm(vUv * 2.6 + uTime * 0.05);
    float edge = uMix * 1.35 - 0.15;
    float m = smoothstep(edge - 0.12, edge + 0.12, n + vUv.x * 0.25 - 0.12);
    float burn = (1.0 - abs(m * 2.0 - 1.0)) * sin(uMix * 3.14159);
    vec2 warp = (vec2(n) - 0.5) * 0.05 * sin(uMix * 3.14159);

    vec3 a = sampleRGB(uA, cover(uv + warp, uResA, uFocusA, push), dir, ca, bias);
    vec3 b = sampleRGB(uB, cover(uv - warp, uResB, uFocusB, push), dir, ca, bias);
    vec3 col = mix(b, a, m);
    col += vec3(1.0, 0.62, 0.28) * burn * 0.55; // tungsten light-leak along the burn edge

    // lens vignette
    col *= mix(1.0, smoothstep(0.95, 0.25, r * 1.25), 0.55);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function src(still: Still) {
  // Same-origin, optimised (AVIF/WebP) — the ~1280px candidate.
  return getImageProps({ src: still.src, alt: "", width: 640, height: 360, quality: 75 }).props.src;
}

function Screen({ frames, onReady, failed }: { frames: Still[]; onReady: () => void; failed: { current: boolean } }) {
  const size = useThree((s) => s.size);
  const health = useRef({ frames: 0, announced: false });
  const mat = useRef<THREE.ShaderMaterial>(null);
  const textures = useRef<(THREE.Texture<HTMLImageElement> | null)[]>(frames.map(() => null));
  const state = useRef({ cur: 0, next: 1, t: 0, mix: 0, mx: 0, my: 0 });

  const uniforms = useMemo(
    () => ({
      uA: { value: null as THREE.Texture | null },
      uB: { value: null as THREE.Texture | null },
      uResA: { value: new THREE.Vector2(16, 9) },
      uResB: { value: new THREE.Vector2(16, 9) },
      uFocusA: { value: 0.5 },
      uFocusB: { value: 0.5 },
      uMix: { value: 0 },
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uIntro: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  // Load the first frame first (it's what the intro reveals), the rest after.
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const loaded = textures.current;
    let cancelled = false;
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        loader.load(
          src(frames[i]),
          (t) => {
            if (cancelled) return t.dispose();
            t.colorSpace = THREE.NoColorSpace;
            t.minFilter = THREE.LinearMipmapLinearFilter;
            t.generateMipmaps = true;
            t.anisotropy = 4;
            loaded[i] = t;
            resolve();
          },
          undefined,
          () => resolve(),
        );
      });
    load(0).then(() => {
      if (cancelled) return;
      frames.slice(1).forEach((_, k) => load(k + 1));
    });
    return () => {
      cancelled = true;
      loaded.forEach((t) => t?.dispose());
    };
  }, [frames]);

  useFrame((_, dt) => {
    const m = mat.current;
    const tex = textures.current;
    if (!m || !tex[0]) return;
    const s = state.current;
    const u = m.uniforms;

    // Reveal only after a couple of successfully rendered frames.
    const h = health.current;
    if (!h.announced && !failed.current && ++h.frames > 2) {
      h.announced = true;
      onReady();
    }

    s.t += dt;
    // advance only when the next frame has loaded
    const nextReady = !!tex[s.next];
    if (s.t > SLIDE && nextReady) {
      s.mix = Math.min(1, s.mix + dt / FADE);
      if (s.mix >= 1) {
        s.cur = s.next;
        s.next = (s.next + 1) % frames.length;
        s.mix = 0;
        s.t = 0;
      }
    }
    const a = tex[s.cur]!;
    const b = tex[s.next] ?? a;
    u.uA.value = a;
    u.uB.value = b;
    const ia = a.image as HTMLImageElement;
    const ib = b.image as HTMLImageElement;
    u.uResA.value.set(ia.width, ia.height);
    u.uResB.value.set(ib.width, ib.height);
    u.uFocusA.value = (frames[s.cur].focus ?? 50) / 100;
    u.uFocusB.value = (frames[s.next].focus ?? 50) / 100;
    // ease the transition curve
    const e = s.mix < 0.5 ? 2 * s.mix * s.mix : 1 - Math.pow(-2 * s.mix + 2, 2) / 2;
    u.uMix.value = e; // 0 = frame A, 1 = frame B
    u.uTime.value += dt;

    // damped pointer + direct scroll/intro (scroll is already smoothed upstream)
    s.mx += (heroStage.mx - s.mx) * Math.min(1, dt * 3);
    s.my += (heroStage.my - s.my) * Math.min(1, dt * 3);
    u.uMouse.value.set(-s.mx, s.my);
    u.uScroll.value = heroStage.scroll;
    u.uIntro.value = heroStage.intro;
    u.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} depthTest={false} depthWrite={false} />
    </mesh>
  );
}

export default function HeroScreen(props: { frames: Still[]; active: boolean; lite: boolean; onReady: () => void }) {
  // If the shader fails to compile on some GPU, never reveal the canvas —
  // the plain image underneath stays on screen.
  const failed = useRef(false);
  return <HeroCanvas {...props} failed={failed} />;
}

function HeroCanvas({
  frames,
  active,
  lite,
  onReady,
  failed,
}: {
  frames: Still[];
  active: boolean;
  lite: boolean;
  onReady: () => void;
  failed: { current: boolean };
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lite ? [1, 1.25] : [1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false, depth: false }}
      orthographic
      camera={{ position: [0, 0, 1] }}
      aria-hidden
      onCreated={({ gl }) => {
        gl.debug.onShaderError = () => {
          failed.current = true;
        };
      }}
    >
      <Screen frames={frames} onReady={onReady} failed={failed} />
    </Canvas>
  );
}
