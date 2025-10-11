// src/components/3d/Effects/PostFX.jsx
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';
import { KernelSize, Resolution, ToneMappingMode } from 'postprocessing';

export default function PostFX() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.9}
        kernelSize={KernelSize.MEDIUM}
        luminanceThreshold={1.0}
        luminanceSmoothing={0.02}
        mipmapBlur
        resolutionX={Resolution.AUTO_SIZE}
        resolutionY={Resolution.AUTO_SIZE}
      />
      <Vignette eskil={false} offset={0.1} darkness={0.8} />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
    </EffectComposer>
  );
}
