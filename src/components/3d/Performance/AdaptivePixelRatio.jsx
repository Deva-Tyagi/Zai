// src/components/3d/Performance/AdaptivePixelRatio.jsx
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export default function AdaptivePixelRatio() {
  const current = useThree((s) => s.performance.current);
  const setDpr = useThree((s) => s.setDpr);

  useEffect(() => {
    const base = window.devicePixelRatio || 1;
    setDpr(Math.max(0.75, Math.min(1.5, base * current)));
  }, [current, setDpr]);

  return null;
}
