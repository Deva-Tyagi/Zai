// src/components/3d/Performance/PerformanceBudget.jsx
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export default function PerformanceBudget({ onDegrade }) {
  const regress = useThree((s) => s.performance.regress);
  const current = useThree((s) => s.performance.current);

  useEffect(() => {
    // Regress temporarily on interaction spikes
    const onPointerDown = () => regress();
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [regress]);

  useEffect(() => {
    if (current < 1 && onDegrade) onDegrade(current);
  }, [current, onDegrade]);

  return null;
}
