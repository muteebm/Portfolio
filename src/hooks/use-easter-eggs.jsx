import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

/**
 * useEasterEggs — Global easter egg listeners:
 *  - Konami code (↑↑↓↓←→←→BA): triggers confetti explosion + golden message
 *  - Triple click anywhere: mini burst
 *  - Shift+$: "make it rain" — persistent confetti celebration
 */
export function useEasterEggs() {
    useEffect(() => {
        const keyBuffer = [];

        const showKonamiMessage = () => {
            const el = document.createElement('div');
            el.textContent = '🕹️ KONAMI CODE UNLOCKED — YOU ARE LEGENDARY';
            el.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                z-index: 10001; font-family: 'Inter', monospace; font-size: 1.1rem;
                font-weight: 800; letter-spacing: 0.05em; color: #fbbf24;
                background: rgba(3,7,18,0.9); border: 1px solid rgba(251,191,36,0.4);
                border-radius: 14px; padding: 16px 28px; pointer-events: none;
                box-shadow: 0 0 40px rgba(251,191,36,0.3), 0 0 80px rgba(99,179,237,0.2);
                animation: konamiFade 2.4s ease forwards;
            `;
            const style = document.createElement('style');
            style.textContent = `
                @keyframes konamiFade {
                    0% { opacity: 0; transform: translate(-50%, -40%); }
                    12% { opacity: 1; transform: translate(-50%, -50%); }
                    80% { opacity: 1; }
                    100% { opacity: 0; transform: translate(-50%, -60%); }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(el);
            setTimeout(() => {
                el.remove();
                style.remove();
            }, 2500);

            // Celebration confetti volley
            const colors = ['#67e8f9', '#c084fc', '#fbbf24', '#34d399', '#818cf8'];
            const end = Date.now() + 1800;
            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 70,
                    origin: { x: 0, y: 0.7 },
                    colors,
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 70,
                    origin: { x: 1, y: 0.7 },
                    colors,
                });
                if (Date.now() < end) requestAnimationFrame(frame);
            })();
        };

        /** @param {KeyboardEvent} e */
        const onKeyDown = (e) => {
            // Ignore when typing in form fields
            const target = /** @type {HTMLElement|null} */ (e.target);
            const isTyping = target && (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            );
            if (isTyping) return;

            // Konami code
            keyBuffer.push(e.key);
            if (keyBuffer.length > KONAMI.length) keyBuffer.shift();
            if (KONAMI.every((k, i) => keyBuffer[i] === k)) {
                keyBuffer.length = 0;
                showKonamiMessage();
            }

            // Secret money rain — Shift+$
            if (e.key === '$' && e.shiftKey) {
                const colors = ['#fbbf24', '#f59e0b', '#fcd34d', '#67e8f9'];
                const duration = 3000;
                const end = Date.now() + duration;
                (function frame() {
                    confetti({
                        particleCount: 3,
                        startVelocity: 30,
                        spread: 360,
                        ticks: 200,
                        origin: { x: Math.random(), y: -0.1 },
                        colors,
                        scalar: 1.2,
                        shapes: ['square', 'circle'],
                    });
                    if (Date.now() < end) requestAnimationFrame(frame);
                })();
            }
        };

        let clickCount = 0;
        /** @type {ReturnType<typeof setTimeout>|null} */
        let clickTimer = null;
        const onClick = () => {
            clickCount++;
            if (clickCount === 3) {
                clickCount = 0;
                clearTimeout(clickTimer);
                // Mini burst at cursor
                confetti({
                    particleCount: 40,
                    spread: 100,
                    origin: { x: 0.5, y: 0.5 },
                    colors: ['#67e8f9', '#c084fc', '#818cf8'],
                    disableForReducedMotion: true,
                });
            } else {
                clearTimeout(clickTimer);
                clickTimer = setTimeout(() => { clickCount = 0; }, 500);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('click', onClick);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('click', onClick);
        };
    }, []);
}