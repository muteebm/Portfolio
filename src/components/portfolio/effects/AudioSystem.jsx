import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * AudioSystem — Web Audio API engine for immersive sound:
 *  - Ambient drone: layered oscillators with slow LFO modulation
 *  - Hover tick: soft high blip on interactive elements
 *  - Click confirm: short pitch-down blip
 *  - Section-transition whoosh
 *  - Muted by default; persisted preference in localStorage
 */

/** @typedef {import('react').MutableRefObject<AudioContext|null>} AudioContextRef */
/** @typedef {import('react').MutableRefObject<GainNode|null>} GainNodeRef */
/** @typedef {import('react').MutableRefObject<Array<AudioNode|OscillatorNode|GainNode>>} AudioNodeArrayRef */

export default function AudioSystem() {
    const [enabled, setEnabled] = useState(false);
    /** @type {AudioContextRef} */
    const ctxRef = useRef(null);
    /** @type {GainNodeRef} */
    const masterRef = useRef(null);
    /** @type {AudioNodeArrayRef} */
    const droneNodesRef = useRef([]);
    /** @type {React.MutableRefObject<boolean>} */
    const enabledRef = useRef(false);

    const initAudio = useCallback(() => {
        if (ctxRef.current) return ctxRef.current;

        /** @type {any} */
        const w = window;
        const AudioCtx = w.AudioContext || w.webkitAudioContext;
        if (!AudioCtx) return null;

        const ctx = new AudioCtx();
        const master = ctx.createGain();
        master.gain.value = 0;
        master.connect(ctx.destination);

        // ---- Ambient drone: 3 detuned oscillators + breathing LFO ----
        const droneGain = ctx.createGain();
        droneGain.gain.value = 0;
        droneGain.connect(master);

        const freqs = [55, 55 * 1.01, 55 * 1.498]; // A1, detuned, C#2
        const oscillators = freqs.map((f, i) => {
            const osc = ctx.createOscillator();
            osc.type = i === 0 ? 'sine' : 'triangle';
            osc.frequency.value = f;
            osc.detune.value = (Math.random() - 0.5) * 12;

            const gain = ctx.createGain();
            gain.gain.value = i === 0 ? 0.05 : 0.022;
            osc.connect(gain);
            gain.connect(droneGain);
            osc.start();
            return osc;
        });

        // Slow LFO on drone volume for breathing feel
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.07;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.012;
        lfo.connect(lfoGain);
        lfoGain.connect(droneGain.gain);
        lfo.start();

        droneNodesRef.current = [droneGain, lfo, lfoGain, ...oscillators];
        ctxRef.current = ctx;
        masterRef.current = master;
        return ctx;
    }, []);

    const startAmbient = useCallback(() => {
        const ctx = ctxRef.current;
        if (!ctx || !masterRef.current) return;
        const now = ctx.currentTime;
        masterRef.current.gain.cancelScheduledValues(now);
        masterRef.current.gain.setTargetAtTime(0.14, now, 1.8);
        droneNodesRef.current[0].gain.setTargetAtTime(1, now, 2.5);
    }, []);

    const stopAmbient = useCallback(() => {
        const ctx = ctxRef.current;
        if (!ctx || !masterRef.current) return;
        const now = ctx.currentTime;
        masterRef.current.gain.cancelScheduledValues(now);
        masterRef.current.gain.setTargetAtTime(0, now, 0.4);
        droneNodesRef.current[0].gain.setTargetAtTime(0, now, 0.5);
    }, []);

    const playHover = useCallback(() => {
        const ctx = ctxRef.current;
        if (!ctx || !masterRef.current || !enabledRef.current) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.05);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.025, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.connect(g);
        g.connect(masterRef.current);
        osc.start(now);
        osc.stop(now + 0.1);
    }, []);

    const playClick = useCallback(() => {
        const ctx = ctxRef.current;
        if (!ctx || !masterRef.current || !enabledRef.current) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        osc.connect(g);
        g.connect(masterRef.current);
        osc.start(now);
        osc.stop(now + 0.25);

        // Harmonic ping
        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(880, now);
        osc2.frequency.exponentialRampToValueAtTime(440, now + 0.12);
        g2.gain.setValueAtTime(0.0001, now);
        g2.gain.exponentialRampToValueAtTime(0.02, now + 0.01);
        g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        osc2.connect(g2);
        g2.connect(masterRef.current);
        osc2.start(now);
        osc2.stop(now + 0.2);
    }, []);

    const playWhoosh = useCallback(() => {
        const ctx = ctxRef.current;
        if (!ctx || !masterRef.current || !enabledRef.current) return;
        const now = ctx.currentTime;

        // Noise burst with bandpass sweep
        const bufferSize = ctx.sampleRate * 0.6;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(2400, now + 0.3);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.55);
        filter.Q.value = 1.2;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.045, now + 0.12);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        noise.connect(filter);
        filter.connect(g);
        g.connect(masterRef.current);
        noise.start(now);
        noise.stop(now + 0.65);
    }, []);

    // Persist preference
    useEffect(() => {
        try {
            const saved = localStorage.getItem('portfolio_audio_enabled');
            if (saved === 'true') setEnabled(true);
        } catch { /* noop */ }
    }, []);

    useEffect(() => {
        enabledRef.current = enabled;

        if (enabled) {
            const ctx = initAudio();
            if (ctx && ctx.state === 'suspended') ctx.resume();
            startAmbient();
        } else if (ctxRef.current) {
            stopAmbient();
        }

        try {
            localStorage.setItem('portfolio_audio_enabled', String(enabled));
        } catch { /* noop */ }
    }, [enabled, initAudio, startAmbient, stopAmbient]);

    // Global event listeners for SFX
    useEffect(() => {
        if (!enabled) return;

        const onMouseOver = (e) => {
            const interactive = e.target.closest('a, button, [role="button"], select, [data-magnetic]');
            if (interactive) playHover();
        };
        const onClick = (e) => {
            const interactive = e.target.closest('a, button, [role="button"], select');
            if (interactive) playClick();
        };

        let lastWhoosh = 0;
        const onScrollTrigger = () => {
            const now = performance.now();
            if (now - lastWhoosh > 3000) {
                lastWhoosh = now;
                playWhoosh();
            }
        };

        window.addEventListener('mouseover', onMouseOver);
        window.addEventListener('click', onClick);
        window.addEventListener('wheel', onScrollTrigger, { passive: true });

        return () => {
            window.removeEventListener('mouseover', onMouseOver);
            window.removeEventListener('click', onClick);
            window.removeEventListener('wheel', onScrollTrigger);
        };
    }, [enabled, playHover, playClick, playWhoosh]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            try {
                ctxRef.current?.close?.();
            } catch { /* noop */ }
        };
    }, []);

    return (
        <button
            onClick={() => setEnabled(v => !v)}
            className="fixed bottom-5 right-5 z-[9997] group flex items-center gap-2 px-3.5 py-2.5 rounded-full font-mono text-xs transition-all duration-300"
            style={{
                background: enabled ? 'rgba(6,182,212,0.12)' : 'rgba(15,23,42,0.75)',
                border: `1px solid ${enabled ? 'rgba(6,182,212,0.35)' : 'rgba(148,163,184,0.15)'}`,
                color: enabled ? '#67e8f9' : '#64748b',
                backdropFilter: 'blur(12px)',
            }}
            aria-label={enabled ? 'Disable audio' : 'Enable audio'}
            title={enabled ? 'Disable sound' : 'Enable sound (ambient + sfx)'}
            data-magnetic
        >
            {/* Speaker icon */}
            <span className="relative flex items-center justify-center w-4 h-4">
                {enabled ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none" />
                        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                        <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none" />
                        <line x1="22" y1="9" x2="16" y2="15" />
                        <line x1="16" y1="9" x2="22" y2="15" />
                    </svg>
                )}
                {/* Equalizer bars when active */}
                {enabled && (
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
                        {[...Array(3)].map((_, i) => (
                            <span
                                key={i}
                                className="w-0.5 bg-cyan-400 rounded-full"
                                style={{
                                    height: `${6 + i * 2}px`,
                                    animation: `audioEq 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                                }}
                            />
                        ))}
                    </span>
                )}
            </span>
            <span className="hidden sm:inline">{enabled ? 'sound on' : 'sound off'}</span>
        </button>
    );
}