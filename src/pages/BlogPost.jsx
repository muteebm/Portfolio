import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Eye, Calendar, Tag, PenLine } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '../components/portfolio/Navbar';

const categoryColors = {
    "AI & LLMs": '#67e8f9',
    "Microservices": '#818cf8',
    "Backend": '#34d399',
    "Frontend": '#c084fc',
    "DevOps": '#fbbf24',
    "Career": '#f87171',
    "Open Source": '#a3e635',
    "Tutorials": '#fb923c',
};

export default function BlogPost() {
    const { id } = useParams();
    const queryClient = useQueryClient();

    const { data: post, isLoading } = useQuery({
        queryKey: ['blog-post', id],
        queryFn: () => base44.entities.BlogPost.filter({ id }),
        select: data => Array.isArray(data) ? data[0] : data,
    });

    // Increment view count on load
    const viewMutation = useMutation({
        mutationFn: () => base44.entities.BlogPost.update(id, { views: (post?.views || 0) + 1 }),
    });

    useEffect(() => {
        if (post && !viewMutation.isSuccess) viewMutation.mutate();
    }, [post?.id]);

    const color = post?.category ? categoryColors[post.category] || '#67e8f9' : '#67e8f9';

    if (isLoading) return (
        <div className="bg-[#030712] min-h-screen flex items-center justify-center">
            <Navbar />
            <div className="w-7 h-7 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
    );

    if (!post) return (
        <div className="bg-[#030712] min-h-screen flex items-center justify-center">
            <Navbar />
            <div className="text-center">
                <p className="text-slate-500 font-mono">// post not found</p>
                <Link to="/Blog" className="mt-4 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to blog
                </Link>
            </div>
        </div>
    );

    return (
        <div className="bg-[#030712] min-h-screen">
            <Navbar />

            {/* Header */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 40% at 50% -5%, ${color}08, transparent)` }} />

                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Link to="/Blog"
                            className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 hover:text-slate-300 transition-colors mb-8">
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
                        </Link>

                        {post.category && (
                            <span className="block mb-4 text-xs font-mono" style={{ color }}>
                // {post.category}
                            </span>
                        )}

                        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-6">
                            {post.title}
                        </h1>

                        {post.excerpt && (
                            <p className="text-slate-400 text-lg leading-relaxed mb-8 border-l-2 pl-4"
                                style={{ borderColor: color + '50' }}>
                                {post.excerpt}
                            </p>
                        )}

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-5 text-xs font-mono text-slate-600 pb-8 border-b border-white/5">
                            {post.created_date && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(post.created_date), 'MMMM d, yyyy')}
                                </span>
                            )}
                            {post.read_time && (
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    {post.read_time} min read
                                </span>
                            )}
                            {post.views > 0 && (
                                <span className="flex items-center gap-1.5">
                                    <Eye className="w-3 h-3" />
                                    {post.views} views
                                </span>
                            )}
                            <Link to={`/BlogAdmin?edit=${post.id}`}
                                className="ml-auto flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                                <PenLine className="w-3 h-3" /> Edit post
                            </Link>
                        </div>

                        {/* Tags */}
                        {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-5">
                                {post.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg text-slate-500"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <Tag className="w-2.5 h-2.5" />{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Cover image */}
            {post.cover_image && (
                <div className="max-w-4xl mx-auto px-6 mb-12">
                    <img src={post.cover_image} alt={post.title} className="w-full rounded-2xl object-cover max-h-80" />
                </div>
            )}

            {/* Content */}
            <motion.article
                className="max-w-3xl mx-auto px-6 pb-32"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="prose prose-invert max-w-none
          prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight prose-headings:scroll-mt-24
          prose-h1:text-4xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-white/5
          prose-h3:text-xl prose-h3:mt-8 prose-h3:text-slate-200
          prose-p:text-slate-400 prose-p:leading-8 prose-p:text-base
          prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300 hover:prose-a:underline
          prose-strong:text-white prose-strong:font-bold
          prose-em:text-slate-300
          prose-code:text-cyan-300 prose-code:bg-cyan-950/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-slate-900/80 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-2xl prose-pre:p-5 prose-pre:overflow-x-auto
          prose-blockquote:border-l-2 prose-blockquote:border-cyan-500/30 prose-blockquote:bg-cyan-950/10 prose-blockquote:rounded-r-xl prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:text-slate-400
          prose-ul:text-slate-400 prose-ol:text-slate-400
          prose-li:text-slate-400 prose-li:leading-7 prose-li:marker:text-cyan-500
          prose-hr:border-slate-800 prose-hr:my-10
          prose-img:rounded-2xl prose-img:border prose-img:border-slate-800
          prose-table:text-sm prose-thead:border-slate-700 prose-th:text-slate-300 prose-td:text-slate-400 prose-td:border-slate-800">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
                    <Link to="/Blog"
                        className="flex items-center gap-2 text-sm font-mono text-slate-600 hover:text-slate-300 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> All articles
                    </Link>
                    <span className="text-xs text-slate-700 font-mono">Muteeb Matloob · {new Date().getFullYear()}</span>
                </div>
            </motion.article>
        </div>
    );
}