import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { projectTypes } from '@/data/site';

export default function ProjectCard({ project }) {
    const cardRef = useRef(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
    const [hovered, setHovered] = useState(false);
    const type = projectTypes[project.type] || projectTypes.product;
    const accent = type.color;

    const onMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        setRotate({ x: ((y - cy) / cy) * -6, y: ((x - cx) / cx) * 6 });
        setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    };

    const onMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
        setHovered(false);
    };

    return (
        <motion.article
            ref={cardRef}
            layout
            className="relative rounded-2xl overflow-hidden cursor-default select-none group flex flex-col glass-card"
            style={{
                transformStyle: 'preserve-3d',
                perspective: 800,
            }}
            onMouseMove={onMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onMouseLeave}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
            animate={{
                rotateX: rotate.x,
                rotateY: rotate.y,
                transition: { duration: hovered ? 0.1 : 0.5, ease: [0.16, 1, 0.3, 1] },
            }}
        >
            <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
                <div className="h-full w-full"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                        backgroundSize: '200% 100%',
                        animation: hovered ? 'borderSlide 2s linear infinite' : 'none',
                        opacity: hovered ? 1 : 0.35,
                    }} />
            </div>

            {hovered && (
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(circle 220px at ${glowPos.x}% ${glowPos.y}%, ${accent}14, transparent)` }} />
            )}

            <div className="p-6 flex flex-col flex-1" style={{ transform: 'translateZ(20px)' }}>
                <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono"
                        style={{ color: accent, background: `${accent}14`, border: `1px solid ${accent}30` }}>
                        {type.label}
                    </span>
                    <span className="font-mono text-[11px] text-slate-600">{project.year}</span>
                </div>

                <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-display text-lg font-bold text-white leading-tight">{project.title}</h3>
                    {project.links?.length > 0 && (
                        <div className="flex gap-1.5 shrink-0">
                            {project.links.map(l => {
                                const Icon = l.kind === 'github' ? Github : ExternalLink;
                                return (
                                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                                        style={{ background: 'rgba(255,255,255,0.05)' }}
                                        aria-label={l.label} title={l.label}>
                                        <Icon className="w-4 h-4" />
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-5">{project.description}</p>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.stack.map(t => (
                        <span key={t} className="px-2 py-0.5 text-[11px] rounded-md font-mono text-slate-500"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </motion.article>
    );
}
