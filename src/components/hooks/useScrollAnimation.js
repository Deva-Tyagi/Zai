// src/hooks/useScrollAnimation.js
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger); // required once [docs]

export default function useScrollAnimation({ pinSelector = 'section.hero', pinDistance = '120vh' } = {}) {
  const [progress, setProgress] = useState(0); // 0..1 reactive

  useEffect(() => {
    const el = document.querySelector(pinSelector);
    if (!el) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: `+=${pinDistance}`,
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => setProgress(self.progress), // update state
      }
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(s => s.kill());
    };
  }, [pinSelector, pinDistance]);

  return progress;
}
