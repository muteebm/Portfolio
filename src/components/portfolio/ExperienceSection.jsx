import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const experiences = [
    {
        company: "Sofy.ai",
        location: "Karachi · Remote",
        color: "#67e8f9",
        bg: "rgba(6,182,212,0.05)",
        roles: [
            {
                title: "Senior Software Engineer – Team Lead",
                period: "Jul 2022 → Present",
                tag: "Current",
                tagColor: "#10b981",
                bullets: [
                    "Built Sofy Web Agent — an autonomous LLM system using Python, LangChain & Playwright. Deployed MCP server enabling capability sharing across all compatible agent systems.",
                    "Pioneered domain-specific agents with deep business logic, dramatically reducing LLM hallucinations on complex tasks.",
                    "Architected monolith → microservices migration using Strangler Fig pattern with Node.js/TypeScript. Cut deployment time by 40%.",
                    "Implemented Azure Service Bus handling 1M+ daily events, replacing legacy polling with push-based messaging.",
                ]
            },
            {
                title: "Software Engineer",
                period: "Sep 2020 → Jul 2022",
                tag: "",
                tagColor: "",
                bullets: [
                    "Led Angular 6 → 11 migration, improving structure and UI performance.",
                    "Built middleware APIs and microservices (Node.js, Flask) with MS SQL & Redis caching.",
                ]
            }
        ]
    },
    {
        company: "Skynners Private Limited",
        location: "Karachi",
        color: "#c084fc",
        bg: "rgba(192,132,252,0.05)",
        roles: [
            {
                title: "Co-Founder",
                period: "2017 → 2020",
                tag: "Founder",
                tagColor: "#c084fc",
                bullets: [
                    "Architected and shipped 15+ custom software solutions for enterprise clients across the full SDLC.",
                    "Deployed event-driven backends on AWS via Docker achieving 99.9% uptime. Pioneered CI/CD pipelines, reducing deployment errors by 80%.",
                    "Built AAB — a React Native app that acquired 10,000+ users in 3 months; secured seed funding at regional conferences.",
                ]
            }
        ]
    }
];

export default function ExperienceSection() {
    const [expanded, setExpanded] = useState({ 0: true, 1: true });
    const timelineRef = useRef(null);

    // Scroll-triggered timeline line fill
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start 70%", "end 60%"],
    });
    const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <section id="experience" className="relative py-32 bg-transparent">
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.15), transparent)' }} />

            <div className="max-w-4xl mx-auto px-6">
                {/* Sticky section header */}
                <div className="sticky top-16 z-10 bg-[#030712]/90 backdrop-blur-md py-2 mb-4 pointer-events-none">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                        <p className="text-xs uppercase tracking-[0.3em] font-mono mb-3" style={{ color: '#67e8f9' }}>// experience</p>
                        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Where I've <span className="text-slate-400">shipped.</span></h2>
                    </motion.div>
                </div>

                {/* Timeline container */}
                <div ref={timelineRef} className="relative pl-8 sm:pl-10 mt-10">
                    {/* Timeline base line */}
                    <div className="absolute left-0 sm:left-1 top-0 bottom-0 w-px"
                        style={{ background: 'rgba(99,179,237,0.08)' }} />
                    {/* Animated fill line */}
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

                    <div className="space-y-10">
                        {experiences.map((exp, expIdx) => (
                            <motion.div
                                key={exp.company}
                                className="relative"
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.6, delay: expIdx * 0.1 }}
                            >
                                {/* Timeline dot */}
                                <div className="absolute -left-8 sm:-left-10 top-6 -translate-x-1/2">
                                    <span
                                        className="relative flex h-3 w-3"
                                    >
                                        <span
                                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40"
                                            style={{ background: exp.color }}
                                        />
                                        <span
                                            className="relative inline-flex rounded-full h-3 w-3 border-2"
                                            style={{ background: '#030712', borderColor: exp.color }}
                                        />
                                    </span>
                                </div>

                                {/* Company card */}
                                <div className="rounded-2xl overflow-hidden"
                                    style={{ background: exp.bg, border: `1px solid ${exp.color}20` }}>
                                    {/* Header */}
                                    <button
                                        className="w-full text-left p-6 flex items-start justify-between gap-4 group"
                                        onClick={() => setExpanded(e => ({ ...e, [expIdx]: !e[expIdx] }))}
                                        data-magnetic
                                    >
                                        <div>
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <h3 className="text-xl font-bold text-white group-hover:brightness-125 transition-all">{exp.company}</h3>
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: exp.color }} />
                                                <span className="text-sm font-mono" style={{ color: exp.color + 'aa' }}>{exp.location}</span>
                                            </div>
                                            <span className="text-xs font-mono text-slate-600 hidden sm:block mt-1">
                                                {exp.roles[0].period}
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
                                                        <div key={ri} className={ri > 0 ? "pt-6 border-t border-white/5" : ""}>
                                                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                                                <h4 className="text-white font-semibold">{role.title}</h4>
                                                                {role.tag && (
                                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono"
                                                                        style={{ color: role.tagColor, background: role.tagColor + '15', border: `1px solid ${role.tagColor}30` }}>
                                                                        {role.tag}
                                                                    </span>
                                                                )}
                                                                <span className="text-slate-600 text-sm font-mono ml-auto">{role.period}</span>
                                                            </div>
                                                            <ul className="space-y-3">
                                                                {role.bullets.map((b, bi) => (
                                                                    <motion.li
                                                                        key={bi}
                                                                        className="flex gap-3 text-slate-400 text-sm leading-relaxed"
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        whileInView={{ opacity: 1, x: 0 }}
                                                                        viewport={{ once: true }}
                                                                        transition={{ delay: bi * 0.08 }}
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