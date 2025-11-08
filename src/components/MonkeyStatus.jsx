import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MonkeyFace = ({ mood = 'neutral' }) => {
  // Render a simple illustrated monkey face using SVG with mood variants
  const mouthVariants = {
    neutral: { d: 'M20 34 Q32 36 44 34', transition: { duration: 0.3 } },
    happy: { d: 'M18 34 Q32 46 46 34', transition: { duration: 0.3 } },
    joyful: { d: 'M16 32 Q32 52 48 32', transition: { duration: 0.3 } },
  };

  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 64 64"
      initial={false}
      animate={{ rotate: mood === 'joyful' ? [0, -2, 2, 0] : 0 }}
      transition={{ duration: 0.8, repeat: mood === 'joyful' ? Infinity : 0, repeatDelay: 1.6 }}
    >
      {/* Face */}
      <circle cx="32" cy="32" r="24" fill="#8B5E3C" />
      {/* Ears */}
      <circle cx="12" cy="28" r="10" fill="#8B5E3C" />
      <circle cx="52" cy="28" r="10" fill="#8B5E3C" />
      {/* Inner face */}
      <ellipse cx="32" cy="38" rx="18" ry="14" fill="#F6D2A2" />
      {/* Eyes */}
      <circle cx="24" cy="28" r="3" fill="#3B2F2F" />
      <circle cx="40" cy="28" r="3" fill="#3B2F2F" />
      {/* Cheeks glow */}
      <motion.circle cx="20" cy="36" r="3.5" fill="#FFA7A7" initial={{ opacity: 0 }} animate={{ opacity: mood === 'neutral' ? 0.2 : mood === 'happy' ? 0.6 : 0.9 }} transition={{ duration: 0.4 }} />
      <motion.circle cx="44" cy="36" r="3.5" fill="#FFA7A7" initial={{ opacity: 0 }} animate={{ opacity: mood === 'neutral' ? 0.2 : mood === 'happy' ? 0.6 : 0.9 }} transition={{ duration: 0.4 }} />
      {/* Mouth */}
      <motion.path
        fill="transparent"
        stroke="#3B2F2F"
        strokeWidth="3"
        variants={mouthVariants}
        animate={mood}
        d="M20 34 Q32 36 44 34"
      />
    </motion.svg>
  );
};

const Sparkles = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="absolute -top-2 -right-2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.2, 1], opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
          <div className="w-2 h-2 rounded-full bg-purple-400" />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const MonkeyStatus = ({ bananas }) => {
  let mood = 'neutral';
  if (bananas >= 5) mood = 'joyful';
  else if (bananas >= 2) mood = 'happy';

  return (
    <div className="relative flex items-center gap-3">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: mood !== 'neutral' ? [-2, 0, -1, 0] : 0 }}
        transition={{ duration: 0.8, repeat: mood !== 'neutral' ? 1 : 0 }}
      >
        <MonkeyFace mood={mood} />
      </motion.div>
      <Sparkles show={bananas >= 3} />
      <div className="flex items-center gap-2">
        <img src="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxiYW5hbmF8ZW58MHwwfHx8MTc2MjYwNzQ2M3ww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" alt="banana" className="w-7 h-7" />
        <span className="font-semibold text-yellow-700 text-lg">{bananas}</span>
      </div>
    </div>
  );
};

export default MonkeyStatus;
