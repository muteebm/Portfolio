import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ArrowUpRight } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { projects, projectTypes, links } from '@/data/site';

const filters = [
    { key: 'all', label: 'All' },
    ...Object.entries(projectTypes).map(([key, v]) => ({ key, label: v.label })),
];

export default function ProjectsSection() {
    const [activeFilter, setActiveFilter] = useState('all');

    const filtered = activeFilter === 'all'
        ? projects
        : projects.filter(p => p.type === activeFilter);

    return (
        <section id="projects" className="relative pt-16 pb-28 bg-transparent">
            <div className="max-w-7xl mx-auto px-6 sm:px-12">
                <motion.div
                    className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                >
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] font-mono mb-4" style={{ color: '#67e8f9' }}>// more work</p>
                        <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-none">
                            Platform, product <span className="text-slate-400">and client work.</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {filters.map(f => {
                            const active = activeFilter === f.key;
                            const color = projectTypes[f.key]?.color || '#67e8f9';
                            return (
                                <button key={f.key} onClick={() => setActiveFilter(f.key)}
                                    className="px-4 py-1.5 rounded-full text-xs font-mono transition-all"
                                    style={active
                                        ? { background: `${color}1f`, color, border: `1px solid ${color}55` }
                                        : { background: 'transparent', color: '#64748b', border: '1px solid rgba(148,163,184,0.12)' }
                                    }>
                                    {f.label}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AnimatePresence>
                        {filtered.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                <motion.div
                    className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl p-6 glass-card"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                >
                    <p className="text-sm text-slate-300 font-mono">
                        Professional entries are proprietary Sofy work — code is private, outcomes are on my resume.
                    </p>
                    <a href={links.github} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-mono text-cyan-300 hover:text-white transition-colors shrink-0">
                        <Github className="w-4 h-4" /> All public repos <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
