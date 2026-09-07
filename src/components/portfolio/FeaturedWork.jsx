import React from 'react';
import { motion } from 'framer-motion';
import { Github, ArrowUpRight } from 'lucide-react';
import { featured, projectTypes } from '@/data/site';

const ease = [0.16, 1, 0.3, 1];

function LinkPill({ link, accent }) {
    const Icon = link.kind === 'github' ? Github : ArrowUpRight;
    return (
        <a href={link.href} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all hover:brightness-125"
            style={{ color: accent, background: `${accent}12`, border: `1px solid ${accent}30` }}
            onClick={(e) => e.stopPropagation()}>
            <Icon className="w-3.5 h-3.5" />
            {link.label}
        </a>
    );
}

function CaseStudy({ item, index }) {
    const large = item.size === 'large';
    const type = projectTypes[item.type];
    return (
        <motion.article
            className={`group relative rounded-3xl overflow-hidden flex flex-col glass-card ${large ? 'lg:col-span-2 lg:row-span-2' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: index * 0.1, ease }}
            whileHover={{ y: -4 }}
        >
            {/* accent wash */}
            <div className="absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: `radial-gradient(ellipse 70% 50% at ${large ? '85% 0%' : '100% 0%'}, ${item.accent}1f, transparent 60%)` }} />
            <div className="absolute top-0 inset-x-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${item.accent}80, transparent)` }} />

            <div className={`relative flex flex-col h-full ${large ? 'p-7 sm:p-10' : 'p-6 sm:p-7'}`}>
                <div className="flex items-center justify-between gap-3 mb-6">
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-slate-500">{item.eyebrow}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono"
                        style={{ color: type.color, background: `${type.color}14`, border: `1px solid ${type.color}30` }}>
                        {type.label}
                    </span>
                </div>

                <h3 className={`font-display font-bold text-white tracking-tight leading-[1.05] ${large ? 'text-3xl sm:text-5xl mb-6' : 'text-2xl sm:text-3xl mb-4'}`}>
                    {item.title}
                </h3>

                <div className={`grid gap-5 ${large ? 'sm:grid-cols-3 mt-2' : 'grid-cols-1'}`}>
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600 mb-1.5">Problem</p>
                        <p className="text-sm text-slate-300 leading-relaxed">{item.problem}</p>
                    </div>
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600 mb-1.5">What I built</p>
                        <p className="text-sm text-slate-300 leading-relaxed">{item.solution}</p>
                    </div>
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600 mb-1.5">Outcome</p>
                        <p className="text-sm leading-relaxed" style={{ color: `${item.accent}dd` }}>{item.outcome}</p>
                    </div>
                </div>

                <div className="mt-auto pt-7 flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                        {item.stack.map(t => (
                            <span key={t} className="px-2 py-0.5 text-[11px] rounded-md font-mono text-slate-400"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                {t}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        {item.links.map(l => <LinkPill key={l.href} link={l} accent={item.accent} />)}
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

/**
 * FeaturedWork — bento grid of three case studies with problem / build / outcome.
 */
export default function FeaturedWork() {
    return (
        <section id="work" className="relative pt-28 pb-10 bg-transparent">
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.15), transparent)' }} />
            <div className="max-w-7xl mx-auto px-6 sm:px-12">
                <motion.div
                    className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                >
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] font-mono mb-4" style={{ color: '#67e8f9' }}>// selected work</p>
                        <h2 className="font-display text-4xl sm:text-6xl font-bold text-white tracking-tight leading-none">
                            Case <span className="text-slate-400">studies.</span>
                        </h2>
                    </div>
                    <p className="text-slate-400 font-mono text-sm max-w-md">
                        Three things I am proudest of: an agent platform in production, and two Windows utilities I shipped end-to-end.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:auto-rows-fr">
                    {featured.map((item, i) => <CaseStudy key={item.id} item={item} index={i} />)}
                </div>
            </div>
        </section>
    );
}
