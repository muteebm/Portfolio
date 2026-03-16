import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Eye, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const categoryColors = {
    "AI & LLMs": { text: '#67e8f9', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)' },
    "Microservices": { text: '#818cf8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.2)' },
    "Backend": { text: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
    "Frontend": { text: '#c084fc', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.2)' },
    "DevOps": { text: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
    "Career": { text: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
    "Open Source": { text: '#a3e635', bg: 'rgba(163,230,53,0.08)', border: 'rgba(163,230,53,0.2)' },
    "Tutorials": { text: '#fb923c', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.2)' },
};

export default function BlogPostCard({ post, index = 0, featured = false }) {
    const colors = categoryColors[post.category] || { text: '#67e8f9', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)' };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
        >
            <Link to={`/BlogPost/${post.id}`} className="group block h-full">
                <div
                    className={`relative rounded-2xl overflow-hidden h-full transition-all duration-300 ${featured ? 'p-8' : 'p-6'}`}
                    style={{
                        background: 'rgba(15,23,42,0.5)',
                        border: '1px solid rgba(148,163,184,0.07)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = colors.border}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.07)'}
                >
                    {/* Top accent on hover */}
                    <div className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: `linear-gradient(90deg, transparent, ${colors.text}60, transparent)` }} />

                    {/* Cover image */}
                    {post.cover_image && (
                        <div className={`${featured ? '-mx-8 -mt-8 mb-8' : '-mx-6 -mt-6 mb-6'} overflow-hidden h-48`}>
                            <img src={post.cover_image} alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/60 pointer-events-none" />
                        </div>
                    )}

                    {/* Category */}
                    {post.category && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono mb-3"
                            style={{ color: colors.text, background: colors.bg, border: `1px solid ${colors.border}` }}>
                            {post.category}
                        </span>
                    )}

                    {/* Title */}
                    <h3 className={`font-bold text-white mb-3 leading-snug group-hover:text-cyan-300 transition-colors ${featured ? 'text-2xl' : 'text-lg'}`}>
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
                    )}

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                            {post.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono rounded-md text-slate-600"
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Tag className="w-2.5 h-2.5" />{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-slate-600 font-mono mt-auto pt-4 border-t border-white/5">
                        <span>{post.created_date ? format(new Date(post.created_date), 'MMM d, yyyy') : ''}</span>
                        {post.read_time && (
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.read_time} min read</span>
                        )}
                        {post.views > 0 && (
                            <span className="flex items-center gap-1 ml-auto"><Eye className="w-3 h-3" />{post.views}</span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}