import React, { useEffect, useRef } from 'react';

export default function GlowCursor() {
    const blobRef = useRef(null);

    useEffect(() => {
        const blob = blobRef.current;
        let x = 0, y = 0, cx = 0, cy = 0;
        let animId;

        const onMove = (e) => { x = e.clientX; y = e.clientY; };
        window.addEventListener('mousemove', onMove);

        const animate = () => {
            cx += (x - cx) * 0.08;
            cy += (y - cy) * 0.08;
            blob.style.transform = `translate(${cx - 250}px, ${cy - 250}px)`;
            animId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <div
            ref={blobRef}
            className="pointer-events-none fixed z-0 w-[500px] h-[500px] rounded-full"
            style={{
                background: 'radial-gradient(circle, rgba(99,179,237,0.06) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)',
                filter: 'blur(40px)',
                top: 0,
                left: 0,
            }}
        />
    );
}