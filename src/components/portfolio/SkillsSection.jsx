import React from 'react';
import { motion } from 'framer-motion';
import { stack } from '@/data/site';

/**
 * SkillsSection — the stack as grouped chips, each group anchored by one proof
 * line pointing at real shipped work. No invented percentages.
 */
export default function SkillsSection() {
    return (
        <section id="stack" className="relative py-28 bg-transparent">
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.15), transparent)' }} />

            <div className="max-w-7xl mx-auto px-6 sm:px-12">
                <motion.div
                    className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                >
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] font-mono mb-4" style={{ color: '#67e8f9' }}>// stack</p>
                        <h2 className="font-display text-4xl sm:text-6xl font-bold text-white tracking-tight leading-none">
                            Tools I <span className="text-slate-400">ship with.</span>
                        </h2>
                    </div>
                    <p className="text-slate-400 font-mono text-sm max-w-md">
                        Each group comes with the work that proves it — no percentage bars.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px rounded-3xl overflow-hidden"
                    style={{ background: 'rgba(148,163,184,0.08)' }}>
                    {stack.map((group, i) => (
                        <motion.div
                            key={group.title}
                            className="group relative p-7 flex flex-col"
                            style={{ background: 'rgba(3,7,18,0.88)' }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.06 }}
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{ background: `radial-gradient(circle at 20% 0%, ${group.color}12, transparent 60%)` }} />

                            <div className="flex items-center gap-3 mb-5">
                                <span className="w-2 h-2 rounded-full" style={{ background: group.color, boxShadow: `0 0 12px ${group.color}` }} />
                                <h3 className="font-display text-white font-bold text-lg">{group.title}</h3>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {group.items.map(skill => (
                                    <motion.span
                                        key={skill}
                                        className="px-3 py-1 text-xs font-mono rounded-lg"
                                        style={{ color: group.color + 'dd', background: group.color + '0d', border: `1px solid ${group.color}22` }}
                                        whileHover={{ scale: 1.05, backgroundColor: group.color + '1f' }}
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>

                            <p className="mt-auto text-xs text-slate-400 leading-relaxed font-mono">
                                <span style={{ color: group.color }}>proof → </span>{group.proof}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
