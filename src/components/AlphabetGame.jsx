import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const bananaSvg = (
  <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none">
    <path d="M53 9c-1 7-5 16-14 25S18 49 9 53c0 0 3 2 10 2 8 0 20-4 29-13S55 16 53 9z" fill="#F9D24A" stroke="#A87419" strokeWidth="2" />
  </svg>
);

const LetterButton = ({ letter, state, onClick }) => {
  const variants = {
    initial: { scale: 1, boxShadow: '0 0 0 0 rgba(0,0,0,0)' },
    hover: { scale: 1.05, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' },
    pressed: { scale: 0.95 },
    correct: { scale: [1, 1.1, 1], backgroundColor: '#22c55e', color: '#fff' },
    wrong: { x: [0, -8, 8, -6, 6, -3, 3, 0], backgroundColor: '#ef4444', color: '#fff' },
  };

  return (
    <motion.button
      type="button"
      className="relative select-none w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white text-gray-800 font-extrabold text-xl flex items-center justify-center border border-gray-200"
      whileHover="hover"
      whileTap="pressed"
      variants={variants}
      animate={state}
      initial="initial"
      onClick={onClick}
      aria-label={`Letter ${letter}`}
    >
      {letter}
      {/* green glow */}
      <AnimatePresence>
        {state === 'correct' && (
          <motion.span
            className="absolute inset-0 rounded-xl"
            initial={{ boxShadow: '0 0 0 0 rgba(34,197,94,0.0)' }}
            animate={{ boxShadow: ['0 0 0 0 rgba(34,197,94,0.0)', '0 0 0 12px rgba(34,197,94,0.15)', '0 0 0 0 rgba(34,197,94,0.0)'] }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const useQuestionFlow = () => {
  const [index, setIndex] = useState(0);
  const [bananas, setBananas] = useState(0);
  const [statusMap, setStatusMap] = useState({}); // letter -> 'correct' | 'wrong' | undefined
  const currentLetter = LETTERS[index];

  const resetStates = useCallback(() => setStatusMap({}), []);

  const onAnswer = useCallback(
    (letter) => {
      if (!currentLetter) return;
      if (letter === currentLetter) {
        setStatusMap((m) => ({ ...m, [letter]: 'correct' }));
        setBananas((b) => b + 1);
        // auto-advance after delay
        setTimeout(() => {
          setIndex((i) => Math.min(i + 1, LETTERS.length - 1));
          resetStates();
        }, 600);
      } else {
        setStatusMap((m) => ({ ...m, [letter]: 'wrong' }));
        setTimeout(() => setStatusMap((m) => ({ ...m, [letter]: undefined })), 450);
      }
    },
    [currentLetter, resetStates]
  );

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, LETTERS.length - 1));
    resetStates();
  }, [resetStates]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
    resetStates();
  }, [resetStates]);

  return { index, setIndex, bananas, onAnswer, next, prev, statusMap, currentLetter };
};

const BananaFly = ({ fromRef, toRef, triggerKey }) => {
  // Renders an animated banana flying from button to counter when triggerKey changes
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!fromRef?.current || !toRef?.current) return;
    const from = fromRef.current.getBoundingClientRect();
    const to = toRef.current.getBoundingClientRect();
    setCoords({
      x: from.left + from.width / 2,
      y: from.top + from.height / 2,
      tx: to.left + to.width / 2,
      ty: to.top + to.height / 2,
    });
  }, [fromRef, toRef, triggerKey]);

  if (!coords) return null;

  return (
    <motion.div
      className="fixed z-50"
      initial={{ x: coords.x, y: coords.y, scale: 0.9, opacity: 1 }}
      animate={{ x: coords.tx, y: coords.ty, scale: [0.9, 1.1, 1], opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div initial={{ scale: 1 }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.3 }}>
        {bananaSvg}
      </motion.div>
    </motion.div>
  );
};

const ProgressBar = ({ value, max }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full h-3 bg-yellow-100 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-yellow-400"
        initial={{ width: '0%' }}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'tween', duration: 0.4 }}
      />
    </div>
  );
};

const AlphabetGame = ({ onBananaTargetRef }) => {
  const { index, bananas, onAnswer, next, statusMap, currentLetter } = useQuestionFlow();
  const goal = 26;
  const bananaCounterRef = onBananaTargetRef; // ref provided from parent
  const activeButtonRef = useRef(null);
  const [flyKey, setFlyKey] = useState(0);

  const options = useMemo(() => LETTERS, []);

  const handleClick = (letter, ref) => {
    if (letter === currentLetter) {
      // set the button ref so banana flies from here
      activeButtonRef.current = ref.current;
      onAnswer(letter);
      setFlyKey((k) => k + 1);
    } else {
      onAnswer(letter);
    }
  };

  // Screen size wrapper 1512x982 center contained
  return (
    <div className="mx-auto w-[1512px] h-[982px] max-w-full bg-gradient-to-b from-emerald-50 via-white to-emerald-50 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-xl">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <div ref={bananaCounterRef} className="w-10 h-10 rounded-full bg-yellow-200 border border-yellow-300 flex items-center justify-center">
            {bananaSvg}
          </div>
          <div className="text-2xl font-extrabold text-yellow-700">{bananas}</div>
        </div>
      </div>

      {/* Question card */}
      <motion.div
        key={currentLetter}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-emerald-900">
            Find the letter: {currentLetter}
          </h2>
          <p className="text-emerald-800/80">Tap the matching letter to earn a banana!</p>
          <ProgressBar value={bananas} max={goal} />
        </div>

        <div className="rounded-2xl overflow-hidden">
          {/* Spline hero lives in parent App for layout composition */}
          <div className="w-full h-48 md:h-64 bg-emerald-100 rounded-xl flex items-center justify-center">
            <span className="text-emerald-700 font-semibold">Playful 3D blocks above</span>
          </div>
        </div>
      </motion.div>

      {/* Letters grid */}
      <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-3 md:gap-4 mt-2">
        {options.map((letter) => {
          const ref = React.createRef();
          const state = statusMap[letter];
          return (
            <div key={letter} ref={ref} className="flex items-center justify-center">
              <LetterButton
                letter={letter}
                state={state}
                onClick={() => handleClick(letter, ref)}
              />
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-auto flex items-center justify-between">
        <button onClick={next} className="text-emerald-700 font-semibold hover:underline">Next Question</button>
        <div className="text-emerald-700/70 text-sm">Auto-advance on correct answers</div>
      </div>

      {/* Flying banana animation */}
      <AnimatePresence>
        {flyKey > 0 && activeButtonRef.current && (
          <BananaFly fromRef={activeButtonRef} toRef={bananaCounterRef} triggerKey={flyKey} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlphabetGame;
