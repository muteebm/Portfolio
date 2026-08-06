import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Sparkles } from 'lucide-react';
import ProjectCard from './ProjectCard';

const filters = [
    { key: 'all', label: 'All' },
    { key: 'professional', label: 'Professional' },
    { key: 'freelance', label: 'Freelance' },
    { key: 'personal', label: 'Personal' },
    { key: 'open_source', label: 'Open Source' },
];

// Projects derived from resume + experience
const LOCAL_PROJECTS = [
    {
        id: 'sofya-web-agent',
        title: 'Sofy Web Agent',
        type: 'professional',
        description: 'Autonomous LLM system for complex web automation. Built with Python, LangChain & Playwright. Deployed MCP server enabling capability sharing across all compatible agent systems.',
        tech_stack: ['Python', 'LangChain', 'Playwright', 'MCP Server', 'LLMs'],
        github_url: 'https://github.com/muteebm',
        live_url: 'https://muteeb.space',
        image_url: null,
    },
    {
        id: 'mono-microservices',
        title: 'Monolith → Microservices Migration',
        type: 'professional',
        description: 'Architected Strangler Fig pattern migration with Node.js/TypeScript. Cut deployment time by 80% and improved modularity across the platform.',
        tech_stack: ['Node.js', 'TypeScript', 'Microservices', 'Azure', 'Docker'],
        github_url: 'https://github.com/muteebm',
        live_url: null,
        image_url: null,
    },
    {
        id: 'azure-service-bus',
        title: 'Event-Driven Messaging Platform',
        type: 'professional',
        description: 'Implemented Azure Service Bus handling 100k+ daily events, replacing legacy polling with push-based messaging. Engineered domain-specific agents with deep business logic reducing LLM hallucinations.',
        tech_stack: ['Azure Service Bus', 'Python', 'Event-Driven', 'Agents'],
        github_url: null,
        live_url: null,
        image_url: null,
    },
    {
        id: 'mcp-integration',
        title: 'MCP Server for Agentic Systems',
        type: 'open_source',
        description: 'Developed and deployed an MCP server written in Python, enabling seamless integration of internal capabilities with external compatible agentic systems.',
        tech_stack: ['MCP', 'Python', 'Agents', 'API'],
        github_url: 'https://github.com/muteebm',
        live_url: null,
        image_url: null,
    },
    {
        id: 'aab-app',
        title: 'AAB — React Native Startup App',
        type: 'freelance',
        description: 'Led technical architecture and backend engineering for an in-house startup. High-throughput Node.js/PostgreSQL REST API on Supabase with React Native client — acquired 10K+ users in 3 months, secured seed funding.',
        tech_stack: ['React Native', 'Node.js', 'PostgreSQL', 'Supabase', 'Docker', 'AWS'],
        github_url: 'https://github.com/muteebm',
        live_url: null,
        image_url: null,
    },
    {
        id: 'enterprise-solutions',
        title: '15+ Enterprise Solutions',
        type: 'freelance',
        description: 'Architected and delivered 15+ scalable backend systems and custom software solutions for enterprise clients, overseeing the full SDLC with 99.9% uptime.',
        tech_stack: ['Python', 'Node.js', 'AWS', 'Docker', 'CI/CD'],
        github_url: null,
        live_url: null,
        image_url: null,
    },
];

const enhanced = LOCAL_PROJECTS.map(p => ({
    ...p,
    gradient: {
        professional: 'linear-gradient(135deg, #0891b2, #7c3aed)',
        freelance: 'linear-gradient(135deg, #059669, #0891b2)',
        personal: 'linear-gradient(135deg, #7c3aed, #db2777)',
        open_source: 'linear-gradient(135deg, #d97706, #dc2626)',
    }[p.type] || 'linear-gradient(135deg, #0891b2, #7c3aed)',
}));

export default function ProjectsSection() {
    const [activeFilter, setActiveFilter] = useState('all');

    const filtered = activeFilter === 'all'
        ? enhanced
        : enhanced.filter(p => p.type === activeFilter);

    return (
        <section id="projects" className="relative py-32 bg-transparent">
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.15), transparent)' }} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(99,179,237,0.03),transparent)]" />

            <div className="max-w-6xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <p className="text-xs uppercase tracking-[0.3em] font-mono mb-3" style={{ color: '#67e8f9' }}>// projects</p>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
                        Things I've <span className="text-slate-400">built.</span>
                    </h2>
                    <p className="text-slate-500 font-mono text-sm mb-10 max-w-lg">
                        Professional work, freelance gigs, and passion projects that keep me sharp.
                    </p>
                </motion.div>

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {filters.map(f => (
                        <button key={f.key} onClick={() => setActiveFilter(f.key)}
                            className="px-4 py-1.5 rounded-full text-sm font-mono transition-all"
                            style={activeFilter === f.key
                                ? { background: 'rgba(99,179,237,0.15)', color: '#67e8f9', border: '1px solid rgba(99,179,237,0.3)' }
                                : { background: 'transparent', color: '#475569', border: '1px solid rgba(148,163,184,0.1)' }
                            }
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <Layers className="w-10 h-10 mx-auto mb-4" style={{ color: '#1e293b' }} />
                        <p className="text-slate-600 font-mono text-sm">// no projects here yet</p>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        layout
                    >
                        {filtered.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </motion.div>
                )}

                {/* CTA note */}
                <motion.div
                    className="mt-14 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <p className="text-xs font-mono text-slate-600 flex items-center justify-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-violet-500/60" />
                        More projects shipping soon — follow on GitHub
                    </p>
                </motion.div>
            </div>
        </section>
    );
}