import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import ProjectCard from './ProjectCard';

const filters = [
    { key: 'all', label: 'All' },
    { key: 'professional', label: 'Professional' },
    { key: 'freelance', label: 'Freelance' },
    { key: 'personal', label: 'Personal' },
    { key: 'open_source', label: 'Open Source' },
];

// Local static projects — edit this array to add/update projects
const LOCAL_PROJECTS = [];

export default function ProjectsSection() {
    const [activeFilter, setActiveFilter] = useState('all');

    const projects = LOCAL_PROJECTS;
    const isLoading = false;

    const filtered = activeFilter === 'all' ? projects : projects.filter(p => p.type === activeFilter);

    return (
        <section id="projects" className="relative py-32 bg-[#030712]">
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.15), transparent)' }} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(99,179,237,0.03),transparent)]" />

            <div className="max-w-6xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <p className="text-xs uppercase tracking-[0.3em] font-mono mb-3" style={{ color: '#67e8f9' }}>// projects</p>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
                        Things I've <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #818cf8, #c084fc)' }}>built.</span>
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

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: 'rgba(15,23,42,0.5)' }} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <Layers className="w-10 h-10 mx-auto mb-4" style={{ color: '#1e293b' }} />
                        <p className="text-slate-600 font-mono text-sm">// no projects here yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}