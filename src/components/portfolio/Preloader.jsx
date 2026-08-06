import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADER_LINES = [
    '> initializing portfolio...',
    '> loading modules [ok]',
    '> compiling shaders [ok]',
    '> warming up particle system [ok]',
    '> rendering 3D assets [ok]',
    '> ready.',
];

/**
 * Preloader — Cinematic code-compilation loader shown on first visit.
 * Plays once per session (sessionStorage) to avoid annoying repeat loads.
 */
export default function Preloader() {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [lineIdx, setLineIdx] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(() => {
        // Only show once per session
        try {
            if (sessionStorage.getItem('portfolio_preloader_seen') === '1') return;
        } catch { /* noop */ }

        setVisible(true);
        const start = Date.now();
        const duration = 2400; // total loader duration

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - start;
            const pct = Math.min(elapsed / duration, 1);
            setProgress(Math.floor(pct * 100));
            if (pct >= 1) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    setDone(true);
                    try { sessionStorage.setItem('portfolio_preloader_seen', '1'); } catch { /* noop */ }
                    setTimeout(() => setVisible(false), 600);
                }, 250);
            }
        }, 40);

        // Advance terminal lines
        const lineTimer = setInterval(() => {
            setLineIdx(i => {
                if (i < LOADER_LINES.length - 1) return i + 1;
                clearInterval(lineTimer);
                return i;
            });
        }, 340);

        return () => {
            clearInterval(progressInterval);
            clearInterval(lineTimer);
        };
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#030712]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    aria-hidden={done}
                >
                    <div className="w-full max-w-md px-6 font-mono">
                        {/* Logo */}
                        <motion.div
                            className="flex items-center gap-3 mb-10"
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="text-3xl font-black text-white tracking-tighter">
                                MM<span className="text-cyan-400">_</span>
                            </span>
                            <span className="text-xs text-slate-600 border border-slate-800 rounded px-2 py-0.5">
                                v3.0 · immersive
                            </span>
                        </motion.div>

                        {/* Terminal output */}
                        <div className="min-h-[180px] mb-6">
                            {LOADER_LINES.slice(0, lineIdx + 1).map((line, i) => (
                                <motion.p
                                    key={line}
                                    className="text-xs mb-1.5 leading-relaxed"
                                    style={{
                                        color: i === lineIdx ? '#67e8f9' : '#475569',
                                    }}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {line}
                                    {i === lineIdx && (
                                        <span className="inline-block w-2 h-3 bg-cyan-400 ml-1 animate-pulse" />
                                    )}
                                </motion.p>
                            ))}
                        </div>

                        {/* Progress bar */}
                        <div className="relative h-1 rounded-full overflow-hidden mb-2"
                            style={{ background: 'rgba(148,163,184,0.08)' }}>
                            <motion.div
                                className="absolute top-0 left-0 h-full rounded-full"
                                style={{
                                    background: 'linear-gradient(90deg, #0891b2, #7c3aed)',
                                    boxShadow: '0 0 12px rgba(103,232,249,0.5)',
                                }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: 'easeOut', duration: 0.1 }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-600">
                            <span>{done ? 'DONE' : 'LOADING'}</span>
                            <span>{progress}%</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}