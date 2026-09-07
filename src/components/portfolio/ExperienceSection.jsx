import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Trophy, ArrowUpRight } from 'lucide-react';
import { experience, awards, education } from '@/data/site';

export default function ExperienceSection() {
    const [expanded, setExpanded] = useState({ 0: true, 1: true });
    const timelineRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ['start 70%', 'end 60%'],
    });
    const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <section id="experience" className="relative py-28 bg-transparent">
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.15), transparent)' }} />

            <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Sticky heading column */}
                <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-28">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                            <p className="text-xs uppercase tracking-[0.3em] font-mono mb-4" style={{ color: '#67e8f9' }}>// experience</p>
                            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-none mb-6">
                                Where I&apos;ve <span className="text-slate-400">shipped.</span>
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed max-w-sm mb-10">
                                Six years from co-founding a software house to leading the agentic platform work at an AI testing company.
                            </p>
                        </motion.div>

                        {/* Achievements */}
                        <motion.div
                            className="rounded-2xl p-5 space-y-4 glass-card"
                            style={{ borderColor: 'rgba(251,191,36,0.2)' }}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
                        >
                            <div className="flex items-center gap-2 text-amber-300">
                                <Trophy className="w-4 h-4" />
                                <span className="font-mono text-xs uppercase tracking-[0.2em]">Achievements</span>
                            </div>
                            <ul className="space-y-3">
                                {awards.map(a => (
                                    <li key={a.name} className="text-sm">
                                        <span className="text-white font-semibold">{a.name}</span>
                                        <span className="text-slate-400"> — {a.detail}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-3 border-t border-white/5 text-xs font-mono text-slate-500">
                                🎓 {education.degree} · {education.shortSchool} · {education.period}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Timeline */}
                <div ref={timelineRef} className="lg:col-span-8 relative pl-8 sm:pl-10">
                    <div className="absolute left-0 sm:left-1 top-0 bottom-0 w-px" style={{ background: 'rgba(99,179,237,0.08)' }} />
                    <motion.div
                        className="absolute left-0 sm:left-1 top-0 w-px"
                        style={{
                            background: 'linear-gradient(180deg, #67e8f9, #818cf8, #c084fc)',
                            boxShadow: '0 0 12px rgba(99,179,237,0.4)',
                            scaleY: lineScale,
                            transformOrigin: 'top',
                            height: '100%',
                        }}
                    />

                    <div className="space-y-8">
                        {experience.map((exp, expIdx) => (
                            <motion.div
                                key={exp.company}
                                className="relative"
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.6, delay: expIdx * 0.1 }}
                            >
                                <div className="absolute -left-8 sm:-left-10 top-7 -translate-x-1/2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40" style={{ background: exp.color }} />
                                        <span className="relative inline-flex rounded-full h-3 w-3 border-2" style={{ background: '#030712', borderColor: exp.color }} />
                                    </span>
                                </div>

                                <div className="rounded-2xl overflow-hidden glass-card"
                                    style={{ borderColor: `${exp.color}33` }}>
                                    <button
                                        className="w-full text-left p-6 flex items-start justify-between gap-4 group"
                                        onClick={() => setExpanded(e => ({ ...e, [expIdx]: !e[expIdx] }))}
                                        aria-expanded={!!expanded[expIdx]}
                                    >
                                        <div>
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <h3 className="font-display text-xl font-bold text-white">{exp.company}</h3>
                                                {exp.url && (
                                                    <a href={exp.url} target="_blank" rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-slate-600 hover:text-white transition-colors" aria-label={`${exp.company} website`}>
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: exp.color }} />
                                                <span className="text-sm font-mono" style={{ color: exp.color + 'aa' }}>{exp.location}</span>
                                            </div>
                                            <p className="text-sm text-slate-400">{exp.summary}</p>
                                            <span className="text-xs font-mono text-slate-600 block mt-2">
                                                {exp.roles[exp.roles.length - 1].period.split(' → ')[0]} → {exp.roles[0].period.split(' → ')[1]}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            className="w-5 h-5 text-slate-600 mt-1 shrink-0 transition-transform"
                                            style={{ transform: expanded[expIdx] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                        />
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {expanded[expIdx] && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-6 space-y-6">
                                                    {exp.roles.map((role, ri) => (
                                                        <div key={ri} className={ri > 0 ? 'pt-6 border-t border-white/5' : ''}>
                                                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                                                <h4 className="text-white font-semibold">{role.title}</h4>
                                                                {role.tag && (
                                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono"
                                                                        style={{ color: exp.color, background: exp.color + '15', border: `1px solid ${exp.color}30` }}>
                                                                        {role.tag}
                                                                    </span>
                                                                )}
                                                                <span className="text-slate-600 text-sm font-mono ml-auto">{role.period}</span>
                                                            </div>
                                                            <ul className="space-y-3">
                                                                {role.bullets.map((b, bi) => (
                                                                    <motion.li
                                                                        key={bi}
                                                                        className="flex gap-3 text-slate-300 text-sm leading-relaxed"
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        whileInView={{ opacity: 1, x: 0 }}
                                                                        viewport={{ once: true }}
                                                                        transition={{ delay: bi * 0.05 }}
                                                                    >
                                                                        <span className="shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: exp.color + '80' }} />
                                                                        {b}
                                                                    </motion.li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
