// src/hooks/useHeroObserver.js
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);

export default function useHeroObserver({
  active = true,
  sensitivity = 0.0016,
  ease = 0.10
} = {}) {
  const [progress, setProgress] = useState(0);
  const [anim, setAnim] = useState(0);

  // Smooth anim follows progress
  useEffect(() => {
    const tick = gsap.ticker.add(() => {
      setAnim((prev) => {
        const next = prev + (progress - prev) * ease;
        return Math.abs(next - prev) > 0.0001 ? next : prev;
      });
    });
    return () => gsap.ticker.remove(tick);
  }, [progress, ease]);

  // Create/enable/disable observer based on "active"
  useEffect(() => {
    if (!active) return; // do nothing if inactive

    const obs = Observer.create({
      type: 'wheel,touch,pointer',
      onChangeY: (self) => {
        setProgress((p) => Math.min(1, Math.max(0, p + self.deltaY * sensitivity)));
      },
      wheelSpeed: 1,
      preventDefault: true, // block native scroll while active
      tolerance: 4
    });

    return () => obs?.kill(); // kill when unmounting or deactivating
  }, [active, sensitivity]);

  return { progress, anim, setProgress };
}
