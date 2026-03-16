import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, PenLine, ArrowRight } from 'lucide-react';
import BlogPostCard from '../components/blog/BlogPostCard';
import Navbar from '../components/portfolio/Navbar';
import { getBlogPosts } from '@/lib/blogStore';

const CATEGORIES = ['All', 'AI & LLMs', 'Microservices', 'Backend', 'Frontend', 'DevOps', 'Career', 'Open Source', 'Tutorials'];

export default function Blog() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['blog-posts-public'],
        queryFn: () => getBlogPosts().filter(p => p.status === 'published'),
    });

    const filtered = posts.filter(p => {
        const matchCat = activeCategory === 'All' || p.category === activeCategory;
        const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const featured = filtered[0];
    const rest = filtered.slice(1);

    return (
        <div className="bg-[#030712] min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-36 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(99,179,237,0.07),transparent)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,179,237,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(99,179,237,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <p className="text-xs uppercase tracking-[0.3em] font-mono mb-3" style={{ color: '#67e8f9' }}>// blog</p>
                        <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight mb-4">
                            Technical<br />
                            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #67e8f9, #818cf8, #c084fc)' }}>
                                Writing.
                            </span>
                        </h1>
                        <p className="text-slate-500 text-lg font-mono max-w-lg">
                            Deep dives on AI systems, microservices patterns, and the craft of building at scale.
                        </p>
                    </motion.div>

                    {/* Search + admin link */}
                    <motion.div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-mono text-slate-300 placeholder-slate-700 bg-transparent focus:outline-none"
                                style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.1)' }} />
                        </div>
                        <Link to="/BlogAdmin"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all"
                            style={{ background: 'rgba(192,132,252,0.08)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.2)' }}>
                            <PenLine className="w-3.5 h-3.5" /> Manage Posts
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Category filters */}
            <div className="max-w-6xl mx-auto px-6 pb-8">
                <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                            className="px-3.5 py-1.5 rounded-full text-xs font-mono transition-all"
                            style={activeCategory === cat
                                ? { background: 'rgba(99,179,237,0.15)', color: '#67e8f9', border: '1px solid rgba(99,179,237,0.3)' }
                                : { background: 'transparent', color: '#475569', border: '1px solid rgba(148,163,184,0.08)' }
                            }>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Posts */}
            <div className="max-w-6xl mx-auto px-6 pb-32">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: 'rgba(15,23,42,0.5)' }} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-32">
                        <PenLine className="w-10 h-10 mx-auto mb-4 text-slate-800" />
                        <p className="text-slate-600 font-mono text-sm">// no articles here yet</p>
                        <Link to="/BlogAdmin" className="mt-6 inline-flex items-center gap-2 text-sm text-cyan-500 hover:text-cyan-400 font-mono transition-colors">
                            Write your first article <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Featured post */}
                        {featured && (
                            <div className="mb-6">
                                <BlogPostCard post={featured} index={0} featured />
                            </div>
                        )}
                        {/* Grid */}
                        {rest.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {rest.map((post, i) => (
                                    <BlogPostCard key={post.id} post={post} index={i + 1} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}