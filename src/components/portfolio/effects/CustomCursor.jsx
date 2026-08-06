import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor — Replaces the native cursor with:
 *  - A small precision dot
 *  - A trailing ring that lags behind
 *  - Magnetic snap effect toward interactive elements (buttons, links)
 *  - State changes: default, hover (grow), text (blink), pointer
 * Native cursor is hidden on desktop (fine pointer) only.
 */
export default function CustomCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [enabled, setEnabled] = useState(false);
    const [state, setState] = useState('default');

    // Detect fine pointer on mount; enable after first paint so refs exist
    useEffect(() => {
        const mq = window.matchMedia('(pointer: fine)');
        if (!mq.matches) return;
        setEnabled(true);
        document.documentElement.classList.add('custom-cursor-active');

        // Hide native cursor when over the page (we re-enable for text inputs/textarea)
        const style = document.createElement('style');
        style.textContent = `
            html.custom-cursor-active,
            html.custom-cursor-active * {
                cursor: none !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.documentElement.classList.remove('custom-cursor-active');
            document.head.removeChild(style);
        };
    }, []);

    // Start animation loop only when refs are mounted (enabled === true)
    useEffect(() => {
        if (!enabled) return;
        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;
        let rafId;

        /** @param {MouseEvent} e */
        const onMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

            // Magnetic effect: snap ring toward interactive elements when close
            const target = e.target.closest('a, button, [role="button"], input, textarea, select, [data-magnetic]');
            if (target) {
                const rect = target.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dist = Math.hypot(mouseX - cx, mouseY - cy);
                if (dist < 120) {
                    const strength = (1 - dist / 120) * 0.14;
                    ringX += (cx - ringX) * strength;
                    ringY += (cy - ringY) * strength;
                }
            }
        };

        /** @param {MouseEvent} e */
        const onMouseOver = (e) => {
            const target = /** @type {Element|null} */ (e.target);
            if (!target) return;
            const interactive = target.closest('a, button, [role="button"], [data-magnetic]');
            if (interactive) {
                setState('hover');
                return;
            }
            const textEl = target.closest('input, textarea, select');
            if (textEl) {
                setState('text');
                return;
            }
            setState('default');
        };

        /** @param {MouseEvent} e */
        const onMouseDown = () => setState('pressed');
        const onMouseUp = (e) => onMouseOver({ target: /** @type {Element} */ (e.target) });

        const animate = () => {
            // Ring follows with lerp
            ringX += (mouseX - ringX) * 0.16;
            ringY += (mouseY - ringY) * 0.16;
            ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            rafId = requestAnimationFrame(animate);
        };
        animate();

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseover', onMouseOver);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseover', onMouseOver);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [enabled]);

    if (!enabled) return null;

    const sizeMap = {
        default: { dot: 5, ring: 36, ringBg: 'rgba(103,232,249,0.08)', ringBorder: 'rgba(103,232,249,0.5)' },
        hover: { dot: 7, ring: 56, ringBg: 'rgba(192,132,252,0.12)', ringBorder: 'rgba(192,132,252,0.6)' },
        text: { dot: 3, ring: 26, ringBg: 'rgba(34,197,94,0.1)', ringBorder: 'rgba(34,197,94,0.6)' },
        pressed: { dot: 12, ring: 32, ringBg: 'rgba(103,232,249,0.2)', ringBorder: 'rgba(103,232,249,0.9)' },
    };
    const s = sizeMap[state] || sizeMap.default;

    return (
        <>
            {/* Precision dot */}
            <div
                ref={dotRef}
                className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full transition-[width,height,background] duration-200"
                style={{
                    width: s.dot,
                    height: s.dot,
                    background: state === 'text' ? 'rgba(34,197,94,0.8)' : '#67e8f9',
                    boxShadow: '0 0 10px rgba(103,232,249,0.8)',
                    transform: 'translate(-100px, -100px)',
                }}
            />
            {/* Trailing ring */}
            <div
                ref={ringRef}
                className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border transition-[width,height,background,border-color] duration-200"
                style={{
                    width: s.ring,
                    height: s.ring,
                    background: s.ringBg,
                    border: `1px solid ${s.ringBorder}`,
                    transform: 'translate(-100px, -100px)',
                    backdropFilter: 'blur(1px)',
                }}
            />
        </>
    );
}