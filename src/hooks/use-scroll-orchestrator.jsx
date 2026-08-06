import { useEffect, useRef } from 'react';

/**
 * useScrollOrchestrator — Centralized scroll-driven animation controller.
 * Tracks scroll progress, active section, and exposes morphing color theme
 * that shifts through cyan/violet/emerald/amber as the user scrolls.
 * Components can subscribe via data attributes:
 *   [data-parallax-speed="0.2"]  → element moves at 20% scroll speed
 *   [data-parallax-direction="y|x"]  → axis of movement
 */
export function useScrollOrchestrator() {
    const themeRef = useRef(null);

    useEffect(() => {
        // Build theme gradient element
        const themeEl = document.createElement('div');
        themeEl.id = 'portfolio-scroll-theme';
        themeEl.style.cssText = `
            position: fixed; inset: 0; z-index: 0; pointer-events: none;
            background: linear-gradient(180deg,
                rgba(3,7,18,0) 0%,
                rgba(99,179,237,0.025) 20%,
                rgba(129,140,248,0.025) 40%,
                rgba(192,132,252,0.025) 60%,
                rgba(52,211,153,0.02) 80%,
                rgba(251,191,36,0.015) 100%);
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(themeEl);
        themeRef.current = themeEl;

        let ticking = false;
        let scrollY = window.scrollY;

        const applyParallax = () => {
            const elements = document.querySelectorAll('[data-parallax]');
            elements.forEach((el) => {
                const speed = parseFloat(el.dataset.parallax || '0');
                const dir = el.dataset.parallaxDirection || 'y';
                const rect = el.getBoundingClientRect();
                const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
                const delta = centerOffset * -speed;
                if (dir === 'y') el.style.transform = `translate3d(0, ${delta}px, 0)`;
                else el.style.transform = `translate3d(${delta}px, 0, 0)`;
            });

            // Section glow intensity based on active section
            const sections = document.querySelectorAll('section[id]');
            let active = 'hero';
            let activeCenter = Infinity;
            sections.forEach((sec) => {
                const r = sec.getBoundingClientRect();
                const c = Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
                if (c < activeCenter) {
                    activeCenter = c;
                    active = sec.id;
                }
            });
            document.documentElement.setAttribute('data-active-section', active);

            // Update theme gradient position based on scroll ratio
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = docHeight > 0 ? scrollY / docHeight : 0;
            themeEl.style.backgroundPosition = `0px ${(-scrollY * 0.15).toFixed(2)}px`;
            themeEl.dataset.ratio = ratio.toFixed(3);
        };

        const onScroll = () => {
            scrollY = window.scrollY;
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    applyParallax();
                    ticking = false;
                });
            }
        };

        // Initial
        applyParallax();

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        // Also re-apply when sections mount (SPA route change)
        const observer = new MutationObserver(() => onScroll());
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            observer.disconnect();
            themeEl.remove();
        };
    }, []);

    return themeRef;
}