/**
 * Plain mutable objects shared between DOM-side GSAP and the WebGL render loop.
 * Writing here never re-renders React; useFrame reads them each frame.
 */
export const journeyStage = { progress: 0 };
/** Hero WebGL screen: intro (0→1), scroll progress (0→1), pointer (-1…1). */
export const heroStage = { intro: 0, scroll: 0, mx: 0, my: 0 };

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
/** Remaps t from [a, b] to [0, 1], clamped. */
export const range = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
