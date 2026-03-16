import React, { useState } from 'react';

export default function GlitchText({ text, className = '' }) {
    const [glitching, setGlitching] = useState(false);

    const triggerGlitch = () => {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 600);
    };

    return (
        <span
            className={`relative inline-block cursor-default select-none ${className}`}
            onMouseEnter={triggerGlitch}
            style={{ '--glitch-text': `"${text}"` }}
        >
            <span
                className="relative"
                style={{
                    display: 'inline-block',
                    animation: glitching ? 'none' : 'none',
                }}
            >
                {glitching ? (
                    <>
                        <span className="absolute top-0 left-0 w-full" style={{
                            color: '#67e8f9',
                            clipPath: 'polygon(0 20%, 100% 20%, 100% 40%, 0 40%)',
                            transform: 'translateX(-3px)',
                            opacity: 0.8,
                        }}>{text}</span>
                        <span className="absolute top-0 left-0 w-full" style={{
                            color: '#c084fc',
                            clipPath: 'polygon(0 60%, 100% 60%, 100% 80%, 0 80%)',
                            transform: 'translateX(3px)',
                            opacity: 0.8,
                        }}>{text}</span>
                        {text}
                    </>
                ) : text}
            </span>
        </span>
    );
}