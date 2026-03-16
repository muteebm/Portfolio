import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const typeColors = {
    professional: { text: '#67e8f9', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)' },
    freelance: { text: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
    personal: { text: '#c084fc', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.2)' },
    open_source: { text: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
};

const typeLabels = {
    professional: 'Professional',
    freelance: 'Freelance',
    personal: 'Personal',
    open_source: 'Open Source',
};

export default function ProjectCard({ project }) {
    const cardRef = useRef(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
    const [hovered, setHovered] = useState(false);
    const colors = typeColors[project.type] || typeColors.personal;

    const onMouseMove = (e) => {
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        setRotate({ x: ((y - cy) / cy) * -8, y: ((x - cx) / cx) * 8 });
        setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    };

    const onMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
        setHovered(false);
    };

    return (
        <motion.div
            ref={cardRef}
            className="relative rounded-2xl overflow-hidden cursor-default select-none"
            style={{
                background: 'rgba(15,23,42,0.6)',
                border: `1px solid rgba(148,163,184,0.07)`,
                transformStyle: 'preserve-3d',
                transform: `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transition: hovered ? 'transform 0.1s' : 'transform 0.5s ease',
            }}
            onMouseMove={onMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onMouseLeave}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
        >
            {/* Dynamic glow spot */}
            {hovered && (
                <div className="absolute inset-0 pointer-events-none transition-opacity"
                    style={{
                        background: `radial-gradient(circle 200px at ${glowPos.x}% ${glowPos.y}%, ${colors.text}12, transparent)`,
                    }}
                />
            )}

            {/* Top accent line */}
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${colors.text}50, transparent)` }} />

            {/* Image */}
            {project.image_url && (
                <div className="h-44 overflow-hidden">
                    <img src={project.image_url} alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700"
                        style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/90" />
                </div>
            )}

            <div className="p-6">
                {/* Type badge */}
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono mb-3"
                    style={{ color: colors.text, background: colors.bg, border: `1px solid ${colors.border}` }}>
                    {typeLabels[project.type] || 'Project'}
                </span>

                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-white leading-tight pr-4">{project.title}</h3>
                    <div className="flex gap-2 shrink-0">
                        {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-white transition-colors"
                                style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <Github className="w-4 h-4" />
                            </a>
                        )}
                        {project.live_url && (
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-white transition-colors"
                                style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-4">{project.description}</p>

                {project.tech_stack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {project.tech_stack.map(t => (
                            <span key={t} className="px-2 py-0.5 text-xs rounded-md font-mono text-slate-500"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                {t}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}