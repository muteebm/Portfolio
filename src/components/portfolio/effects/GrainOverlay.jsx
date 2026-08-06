import React, { memo, useEffect, useState } from 'react';

/**
 * GrainOverlay — Film-grain texture overlay across the entire page.
 * Uses an SVG feTurbulence filter for subtle noise that animates
 * like film grain. Sits above content but below UI elements (pointer-events none).
 */
function GrainOverlay() {
    const [seed, setSeed] = useState(1);

    // Periodically re-seed the noise to create an animated grain effect
    useEffect(() => {
        const id = setInterval(() => {
            setSeed(s => s + 1);
        }, 120);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035] mix-blend-screen" aria-hidden="true">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <filter id="grainFilter">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.9"
                        numOctaves="2"
                        stitchTiles="stitch"
                        seed={seed}
                        result="noise"
                    />
                    <feColorMatrix
                        in="noise"
                        type="matrix"
                        values="0 0 0 0 0.5  0 0 0 0 0.7  0 0 0 0 1  0 0 0 0.6 0"
                    />
                </filter>
                <rect width="100%" height="100%" filter="url(#grainFilter)" />
            </svg>
        </div>
    );
}

export default memo(GrainOverlay);