import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import TopHeader from './components/TopHeader';
import HeroScene from './components/HeroScene';
import AlphabetGame from './components/AlphabetGame';

function App() {
  const [bananas, setBananas] = useState(0); // display only; game owns true count
  const bananaTargetRef = useRef(null);

  // We mirror banana count from game via a callback event. Simple approach: observe DOM text updates
  // For clarity and separation, AlphabetGame will receive the ref and render the counter itself; TopHeader shows monkey and scene

  return (
    <div className="min-h-screen w-full bg-emerald-50 flex items-center justify-center">
      <div className="w-[1512px] h-[982px] max-w-full max-h-screen overflow-auto p-6">
        <TopHeader bananas={bananas} bananaTargetRef={bananaTargetRef} />
        <div className="my-6" />
        <HeroScene />
        <div className="my-6" />
        <AlphabetGame onBananaTargetRef={bananaTargetRef} />
        <motion.div
          className="sr-only"
          aria-hidden
          initial={false}
          animate={{}}
          onUpdate={() => {
            // noop placeholder to keep framer-motion import used
          }}
        />
      </div>
    </div>
  );
}

export default App;
