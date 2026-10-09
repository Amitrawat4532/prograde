/** Which LUT pack is selected — shared by the comparator and the 3D LUT cube without re-rendering either. */
let current = 0;
const listeners = new Set<(i: number) => void>();

export const lutSelection = {
  get: () => current,
  set(i: number) {
    if (i === current) return;
    current = i;
    listeners.forEach((l) => l(i));
  },
  subscribe(l: (i: number) => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
