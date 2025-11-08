import React from 'react';
import Spline from '@splinetool/react-spline';

const HeroScene = () => {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-[340px] rounded-2xl overflow-hidden shadow-lg">
      <Spline
        scene="https://prod.spline.design/95Gu7tsx2K-0F3oi/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Soft gradient overlay that doesn't block pointer events */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/60" />
    </div>
  );
};

export default HeroScene;
