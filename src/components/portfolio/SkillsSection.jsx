import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

const categories = [
    {
        title: "AI & Agentic",
        icon: "🤖",
        color: "#67e8f9",
        skills: ["LLMs", "LangChain", "Agentic Workflows", "Playwright", "Prompt Engineering", "MCP Server"],
        level: 95,
    },
    {
        title: "Backend & APIs",
        icon: "⚙️",
        color: "#34d399",
        skills: ["Python", "Flask", "FastAPI", "Node.js", "Express", "TypeScript", "RESTful APIs", "Redis"],
        level: 92,
    },
    {
        title: "Cloud & Infra",
        icon: "☁️",
        color: "#818cf8",
        skills: ["Azure", "AWS", "GCP", "Docker", "Microservices", "CI/CD", "Service Bus"],
        level: 85,
    },
    {
        title: "Frontend",
        icon: "🎨",
        color: "#c084fc",
        skills: ["React", "Angular", "React Native", "TypeScript", "State Management"],
        level: 82,
    },
    {
        title: "Databases",
        icon: "🗄️",
        color: "#fbbf24",
        skills: ["PostgreSQL", "MongoDB", "Redis", "MS SQL", "Supabase"],
        level: 88,
    },
    {
        title: "Practices",
        icon: "🔬",
        color: "#f87171",
        skills: ["TDD", "Jest", "Pytest", "Azure DevOps", "Git", "Code Review", "Jira"],
        level: 90,
    },
];

// Data for radar chart
const radarData = categories.map(c => ({
    category: c.title,
    expertise: c.level,
    fullMark: 100,
}));

const TOOLTIP_STYLE = {
    background: 'rgba(15,23,42,0.95)',
    border: '1px solid rgba(99,179,237,0.2)',
    borderRadius: '12px',
    fontFamily: 'monospace, monospace',
    fontSize: '12px',
    color: '#e2e8f0',
};

function SkillBar({ label, level, color, inView, delay }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-mono text-slate-400">{label}</span>
                <span className="text-xs font-mono" style={{ color: `${color}cc` }}>{level}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.08)' }}>
                <motion.div
                    className="h-full rounded-full"
                    style={{
                        background: `linear-gradient(90deg, ${color}55, ${color})`,
                        boxShadow: `0 0 8px ${color}40`,
                    }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${level}%` } : {}}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
                />
            </div>
        </div>
    );
}

export default function SkillsSection() {
    const radarRef = useRef(null);
    const radarInView = useInView(radarRef, { once: true, margin: '-100px' });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Top 5 skill bars shown alongside the radar
    const topSkills = [...categories].sort((a, b) => b.level - a.level).slice(0, 5);

    return (
        <section id="skills" className="relative py-32 bg-transparent">
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.15), transparent)' }} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(129,140,248,0.03),transparent)]" />

            <div className="max-w-6xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <p className="text-xs uppercase tracking-[0.3em] font-mono mb-3" style={{ color: '#67e8f9' }}>// skills</p>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-16 tracking-tight">
                        The <span className="text-slate-400">stack.</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
                    {/* Radar chart */}
                    <motion.div
                        ref={radarRef}
                        className="rounded-2xl p-6"
                        style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.06)' }}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-bold text-sm font-mono tracking-wider">// expertise-radar</h3>
                            <span className="text-xs text-slate-500 font-mono">hover to inspect</span>
                        </div>
                        <div className="h-[320px] w-full">
                            {mounted && radarInView && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={radarData} outerRadius="72%">
                                        <PolarGrid stroke="rgba(99,179,237,0.15)" />
                                        <PolarAngleAxis
                                            dataKey="category"
                                            tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                                        />
                                        <PolarRadiusAxis
                                            angle={90}
                                            domain={[0, 100]}
                                            tick={{ fill: '#334155', fontSize: 9, fontFamily: 'monospace' }}
                                            axisLine={false}
                                        />
                                        <Radar
                                            name="Expertise"
                                            dataKey="expertise"
                                            stroke="#67e8f9"
                                            fill="#0891b2"
                                            fillOpacity={0.25}
                                            strokeWidth={2}
                                            animationDuration={1800}
                                            animationEasing="ease-out"
                                        />
                                        <Radar
                                            name="Comfort"
                                            dataKey="fullMark"
                                            stroke="rgba(148,163,184,0.15)"
                                            fill="none"
                                            strokeDasharray="4 4"
                                            animationDuration={1800}
                                        />
                                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </motion.div>

                    {/* Skill bars */}
                    <motion.div
                        className="flex flex-col justify-center gap-5"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <h3 className="text-white font-bold text-sm font-mono tracking-wider mb-2">// proficiency</h3>
                        {topSkills.map((cat, i) => (
                            <SkillBar
                                key={cat.title}
                                label={cat.title}
                                level={cat.level}
                                color={cat.color}
                                inView
                                delay={i * 0.12}
                            />
                        ))}
                        <p className="text-xs text-slate-600 font-mono mt-4">
                            // {new Date().getFullYear()} · continuously expanding
                        </p>
                    </motion.div>
                </div>

                {/* Category cards */}
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
                                <span className="ml-auto text-xs font-mono" style={{ color: `${cat.color}aa` }}>{cat.level}%</span>
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