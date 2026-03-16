import React from 'react';
import { motion } from 'framer-motion';

const categories = [
    {
        title: "AI & Agentic",
        icon: "🤖",
        color: "#67e8f9",
        skills: ["LLMs", "LangChain", "Agentic Workflows", "Playwright", "Prompt Engineering", "MCP Server"],
    },
    {
        title: "Backend & APIs",
        icon: "⚙️",
        color: "#34d399",
        skills: ["Python", "Flask", "Node.js", "Express", "TypeScript", "RESTful APIs", "Redis"],
    },
    {
        title: "Cloud & Infra",
        icon: "☁️",
        color: "#818cf8",
        skills: ["Azure", "AWS", "GCP", "Docker", "Microservices", "CI/CD", "Service Bus"],
    },
    {
        title: "Frontend",
        icon: "🎨",
        color: "#c084fc",
        skills: ["React", "Angular", "React Native", "TypeScript", "State Management"],
    },
    {
        title: "Databases",
        icon: "🗄️",
        color: "#fbbf24",
        skills: ["PostgreSQL", "MongoDB", "Redis", "MS SQL", "Supabase"],
    },
    {
        title: "Practices",
        icon: "🔬",
        color: "#f87171",
        skills: ["TDD", "Jest", "Pytest", "Azure DevOps", "Git", "Code Review", "Jira"],
    },
];

export default function SkillsSection() {
    return (
        <section id="skills" className="relative py-32 bg-[#030712]">
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.15), transparent)' }} />

            <div className="max-w-6xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <p className="text-xs uppercase tracking-[0.3em] font-mono mb-3" style={{ color: '#67e8f9' }}>// skills</p>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-16 tracking-tight">
                        The <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #34d399, #67e8f9)' }}>stack.</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.title}
                            className="group relative rounded-2xl p-6 overflow-hidden cursor-default"
                            style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(148,163,184,0.06)' }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.07 }}
                            whileHover={{ y: -4 }}
                        >
                            {/* Hover glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{ background: `radial-gradient(circle at 50% 0%, ${cat.color}10, transparent 60%)` }} />
                            <div className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ background: `linear-gradient(90deg, transparent, ${cat.color}60, transparent)` }} />

                            <div className="flex items-center gap-3 mb-5">
                                <span className="text-2xl">{cat.icon}</span>
                                <h3 className="text-white font-bold">{cat.title}</h3>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {cat.skills.map(skill => (
                                    <motion.span
                                        key={skill}
                                        className="px-3 py-1 text-xs font-mono rounded-lg transition-all"
                                        style={{ color: cat.color + 'cc', background: cat.color + '0d', border: `1px solid ${cat.color}20` }}
                                        whileHover={{ scale: 1.05, backgroundColor: cat.color + '18' }}
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}