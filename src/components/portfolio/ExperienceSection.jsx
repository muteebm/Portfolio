import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    return (
        <section id="experience" className="relative py-32 bg-[#030712]">
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.15), transparent)' }} />

            <div className="max-w-4xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <p className="text-xs uppercase tracking-[0.3em] font-mono mb-3" style={{ color: '#67e8f9' }}>// experience</p>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-16 tracking-tight">Where I've <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #67e8f9, #818cf8)' }}>shipped.</span></h2>
                </motion.div>

                <div className="space-y-6">
                    {experiences.map((exp, expIdx) => (
                        <motion.div
                            key={exp.company}
                            className="rounded-2xl overflow-hidden"
                            style={{ background: exp.bg, border: `1px solid ${exp.color}20` }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: expIdx * 0.15 }}
                        >
                            {/* Header */}
                            <button
                                className="w-full text-left p-6 flex items-start justify-between gap-4"
                                onClick={() => setExpanded(e => ({ ...e, [expIdx]: !e[expIdx] }))}
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-white">{exp.company}</h3>
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: exp.color }} />
                                        <span className="text-sm font-mono" style={{ color: exp.color + 'aa' }}>{exp.location}</span>
                                    </div>
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
                                                            <li key={bi} className="flex gap-3 text-slate-400 text-sm leading-relaxed">
                                                                <span className="shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: exp.color + '80' }} />
                                                                {b}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}