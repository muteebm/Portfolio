import React, { useState, useEffect } from 'react';

export default function TypeWriter({ phrases, speed = 80, pause = 2000 }) {
    const [displayed, setDisplayed] = useState('');
    const [phraseIdx, setPhraseIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = phrases[phraseIdx];
        let timeout;

        if (!deleting && charIdx < current.length) {
            timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
        } else if (!deleting && charIdx === current.length) {
            timeout = setTimeout(() => setDeleting(true), pause);
        } else if (deleting && charIdx > 0) {
            timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
        } else if (deleting && charIdx === 0) {
            setDeleting(false);
            setPhraseIdx(i => (i + 1) % phrases.length);
        }

        setDisplayed(current.slice(0, charIdx));
        return () => clearTimeout(timeout);
    }, [charIdx, deleting, phraseIdx, phrases, speed, pause]);

    return (
        <span>
            {displayed}
            <span className="inline-block w-0.5 h-6 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
        </span>
    );
}