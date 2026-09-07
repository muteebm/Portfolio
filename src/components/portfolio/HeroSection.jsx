import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Briefcase, ArrowDown, ArrowUpRight, FileText } from 'lucide-react';
import TypeWriter from './effects/TypeWriter';
import { profile, links, stack } from '@/data/site';

const ease = [0.16, 1, 0.3, 1];

const marqueeItems = stack.flatMap(g => g.items.slice(0, 4));

const scrollTo = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
};

/**
 * HeroSection — editorial hero. Availability + location on the top rail,
 * oversized display name in the middle, honest one-liner, three CTAs and
 * a stack marquee along the bottom edge.
 */
export default function HeroSection() {
    return (
        <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden bg-transparent">
            {/* Top rail */}
            <div className="pt-28 sm:pt-32 px-6 sm:px-12 flex justify-between items-start gap-4">
                <motion.p
                    className="text-[11px] sm:text-xs font-mono text-slate-400 tracking-[0.2em] uppercase pt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    Portfolio — {new Date().getFullYear()}
                </motion.p>
                <motion.p
                    className="text-[11px] sm:text-xs font-mono text-slate-400 tracking-[0.2em] uppercase hidden sm:block pt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {profile.location} · {profile.timezone}
                </motion.p>
            </div>

            {/* Center */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto w-full pt-10 pb-6">
                <motion.p
                    className="font-mono text-xs sm:text-sm text-cyan-300 tracking-[0.25em] uppercase mb-5"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.45, ease }}
                >
                    {profile.title} @ {profile.company}
                </motion.p>

                <h1 className="font-display font-bold tracking-[-0.045em] leading-[0.92] text-white text-[12vw] sm:text-[10vw] lg:text-[7.5rem] xl:text-[8.5rem]"
                    style={{ textShadow: '0 2px 40px rgba(3,7,18,0.9)' }}>
                    <motion.span
                        className="block"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.5, ease }}
                    >
                        Muteeb
                    </motion.span>
                    <motion.span
                        className="block"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.62, ease }}
                    >
                        Matloob<span style={{ color: '#67e8f9' }}>.</span>
                    </motion.span>
                </h1>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                    <motion.div
                        className="lg:col-span-7"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.85, ease }}
                    >
                        <div className="font-mono text-base sm:text-lg text-cyan-100 h-7 mb-4">
                            <span className="text-slate-600">{'>_ '}</span>
                            <TypeWriter phrases={profile.roles} speed={70} pause={2200} />
                        </div>
                        <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl">
                            {profile.oneLiner}
                        </p>
                    </motion.div>

                    <motion.div
                        className="lg:col-span-5 flex flex-col items-start lg:items-end gap-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.0, ease }}
                    >
                        <div className="flex flex-wrap items-center gap-3">
                            <a href={links.email}
                                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm bg-white text-[#030712] font-semibold hover:bg-cyan-200 transition-colors">
                                Hire me
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                            <a href="#work" onClick={(e) => scrollTo(e, 'work')}
                                className="px-6 py-3 rounded-full text-sm border border-slate-700 text-slate-300 hover:text-white hover:border-slate-400 transition-all">
                                View work
                            </a>
                            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-mono text-slate-400 hover:text-cyan-300 transition-colors">
                                <FileText className="w-4 h-4" />
                                Resume
                            </a>
                        </div>

                        <div className="flex items-center gap-3">
                            {[
                                { icon: Github, href: links.github, label: 'GitHub' },
                                { icon: Linkedin, href: links.linkedin, label: 'LinkedIn' },
                                { icon: Briefcase, href: links.upwork, label: 'Upwork' },
                            ].map(({ icon: Icon, href, label }) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 h-10 px-3.5 rounded-full border border-slate-800 text-slate-500 hover:text-cyan-300 hover:border-slate-600 transition-all text-xs font-mono"
                                    aria-label={label}>
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{label}</span>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom marquee */}
            <motion.div
                className="relative pb-14 pt-4 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 1 }}
            >
                <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, #030712, transparent)' }} />
                <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(270deg, #030712, transparent)' }} />
                <div className="flex w-max animate-marquee">
                    {[...marqueeItems, ...marqueeItems].map((item, i) => (
                        <span key={`${item}-${i}`} className="flex items-center font-mono text-xs uppercase tracking-[0.25em] text-slate-500 px-6">
                            {item}
                            <span className="ml-12 w-1 h-1 rounded-full bg-cyan-400/40" />
                        </span>
                    ))}
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
                    <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
                        <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
