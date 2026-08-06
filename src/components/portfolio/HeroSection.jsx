import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react';
import TypeWriter from './effects/TypeWriter';

const roles = [
    'Senior Software Engineer',
    'LLM Systems Architect',
    'Agentic Workflow Builder',
    'Microservices Craftsman',
    'Full-Stack Engineer',
];

/**
 * HeroSection — Minimal, elegant open layout.
 * Content is distributed across the viewport (top / center / bottom)
 * rather than stacked into a single block.
 */
export default function HeroSection() {
    return (
        <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden bg-transparent">
            {/* Top row — tiny intro label */}
            <div className="pt-32 px-6 sm:px-12 flex justify-between items-start">
                <motion.p
                    className="text-[11px] sm:text-xs font-mono text-slate-600 tracking-[0.2em] uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    Portfolio — 2026
                </motion.p>
                <motion.p
                    className="text-[11px] sm:text-xs font-mono text-slate-600 tracking-[0.2em] uppercase hidden sm:block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Karachi · Remote
                </motion.p>
            </div>

            {/* Center — the name */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                {/* Name — pure white, no effects */}
                <motion.h1
                    className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-white"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                >
                    Muteeb Matloob
                </motion.h1>

                {/* Typewriter role — subtle */}
                <motion.div
                    className="text-lg sm:text-xl font-mono text-slate-500 mt-6 h-7"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    <span className="text-slate-700">{'>_ '}</span>
                    <TypeWriter phrases={roles} speed={70} pause={2200} />
                </motion.div>

                {/* One-line tagline */}
                <motion.p
                    className="text-slate-600 text-sm sm:text-base font-mono mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                >
                    Building systems that think, scale, and ship. · LLMs · Microservices · Cloud
                </motion.p>
            </div>

            {/* Bottom row — CTAs + socials */}
            <div className="pb-20 px-6 flex flex-col items-center gap-8">
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                >
                    <a href="mailto:muteebmatloobm@gmail.com"
                        className="px-8 py-3 rounded-full text-sm bg-white text-[#030712] font-semibold hover:bg-slate-200 transition-colors">
                        Hire Me
                    </a>
                    <a href="#projects"
                        onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="px-8 py-3 rounded-full text-sm border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
                        View Projects ↓
                    </a>
                </motion.div>

                <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                >
                    {[
                        { icon: Github, href: "https://github.com/muteebm", label: "GitHub" },
                        { icon: Linkedin, href: "https://linkedin.com/in/muteebm", label: "LinkedIn" },
                        { icon: Mail, href: "mailto:muteebmatloobm@gmail.com", label: "Email" },
                    ].map(({ icon: Icon, href, label }) => (
                        <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                            className="group w-10 h-10 rounded-full flex items-center justify-center border border-slate-800 text-slate-600 hover:text-cyan-400 hover:border-slate-600 transition-all"
                            aria-label={label}>
                            <Icon className="w-4 h-4" />
                        </a>
                    ))}
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    style={{ opacity: 0.4 }}
                >
                    <span className="text-[10px] text-slate-700 font-mono tracking-widest">SCROLL</span>
                    <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                </motion.div>
            </div>
        </section>
    );
}