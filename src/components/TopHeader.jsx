import React, { useRef } from 'react';
import Spline from '@splinetool/react-spline';
import MonkeyStatus from './MonkeyStatus';

const TopHeader = ({ bananas, bananaTargetRef }) => {
  return (
    <div className="w-full">
      <div className="relative w-full h-[300px] rounded-3xl overflow-hidden mb-4">
        <Spline scene="https://prod.spline.design/95Gu7tsx2K-0F3oi/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white" />
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-emerald-900">Alphabet Banana Quest</h1>
        <div ref={bananaTargetRef} className="flex items-center gap-3">
          <MonkeyStatus bananas={bananas} />
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
