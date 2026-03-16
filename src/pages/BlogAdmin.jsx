import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/blogStore';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Plus, Save, Eye, Trash2, Globe, FileText,
    Clock, Tag, X, ChevronDown
} from 'lucide-react';
import MarkdownEditor from '../components/blog/MarkdownEditor';

const CATEGORIES = ['AI & LLMs', 'Microservices', 'Backend', 'Frontend', 'DevOps', 'Career', 'Open Source', 'Tutorials'];

const estimateReadTime = (content) => Math.max(1, Math.ceil((content || '').split(/\s+/).length / 200));

const emptyPost = { title: '', excerpt: '', content: '', category: '', tags: [], status: 'draft', cover_image: '', read_time: 1 };

export default function BlogAdmin() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [view, setView] = useState('list'); // 'list' | 'editor'
    const [form, setForm] = useState(emptyPost);
    const [editingId, setEditingId] = useState(null);
    const [tagInput, setTagInput] = useState('');
    const [saved, setSaved] = useState(false);

    // Check for ?edit= param
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const editId = params.get('edit');
        if (editId) openEditor(editId);
    }, []);

    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['blog-posts-admin'],
        queryFn: () => getBlogPosts(),
    });

    const saveMutation = useMutation({
        mutationFn: (data) => editingId
            ? updateBlogPost(editingId, data)
            : createBlogPost(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-posts-admin'] });
            queryClient.invalidateQueries({ queryKey: ['blog-posts-public'] });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteBlogPost(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog-posts-admin'] }),
    });

    const openEditor = (id) => {
        if (id === 'new') {
            setForm(emptyPost);
            setEditingId(null);
        } else {
            const post = posts.find(p => p.id === id);
            if (post) { setForm({ ...post }); setEditingId(id); }
        }
        setView('editor');
    };

    const openEditorById = async (id) => {
        if (id === 'new') { setForm(emptyPost); setEditingId(null); setView('editor'); return; }
        try {
            const all = getBlogPosts();
            const post = all.find(p => p.id === id);
            if (post) { setForm({ ...post }); setEditingId(id); setView('editor'); }
        } catch { }
    };

    const handleSave = () => {
        const data = { ...form, read_time: estimateReadTime(form.content) };
        saveMutation.mutate(data);
    };

    const addTag = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
            e.preventDefault();
            const t = tagInput.trim().replace(',', '');
            if (!form.tags?.includes(t)) setForm(f => ({ ...f, tags: [...(f.tags || []), t] }));
            setTagInput('');
        }
    };

    const removeTag = (t) => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }));

    const statusColor = { draft: '#fbbf24', published: '#34d399' };

    // ─── LIST VIEW ───────────────────────────────────────
    if (view === 'list') return (
        <div className="bg-[#030712] min-h-screen">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <Link to="/Blog" className="flex items-center gap-2 text-xs font-mono text-slate-600 hover:text-slate-400 transition-colors mb-3">
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
                        </Link>
                        <h1 className="text-3xl font-black text-white tracking-tight">Blog Admin</h1>
                        <p className="text-slate-600 font-mono text-sm mt-1">Manage your articles</p>
                    </div>
                    <button onClick={() => openEditor('new')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                        style={{ background: 'linear-gradient(135deg, #0891b2, #7c3aed)' }}>
                        <Plus className="w-4 h-4" /> New Article
                    </button>
                </div>

                {/* Posts table */}
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(15,23,42,0.5)' }} />)}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-24">
                        <FileText className="w-10 h-10 mx-auto mb-4 text-slate-800" />
                        <p className="text-slate-600 font-mono text-sm mb-6">// no articles yet</p>
                        <button onClick={() => openEditor('new')}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                            style={{ background: 'linear-gradient(135deg, #0891b2, #7c3aed)' }}>
                            <Plus className="w-4 h-4" /> Write your first article
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.map((post, i) => (
                            <motion.div key={post.id}
                                className="flex items-center gap-4 p-5 rounded-2xl group transition-all cursor-pointer"
                                style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(148,163,184,0.07)' }}
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,179,237,0.15)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.07)'}
                                onClick={() => { setForm({ ...post }); setEditingId(post.id); setView('editor'); }}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor[post.status] || '#fbbf24' }} />
                                        <h3 className="text-white font-semibold truncate">{post.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
                                        {post.category && <span style={{ color: '#67e8f9' + '99' }}>{post.category}</span>}
                                        {post.read_time && <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{post.read_time}m</span>}
                                        <span className="capitalize" style={{ color: statusColor[post.status] || '#fbbf24' }}>{post.status}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link to={`/BlogPost/${post.id}`} onClick={e => e.stopPropagation()}
                                        className="p-2 rounded-lg text-slate-600 hover:text-cyan-400 transition-colors"
                                        style={{ background: 'rgba(255,255,255,0.04)' }}>
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                    <button onClick={e => { e.stopPropagation(); if (confirm('Delete this post?')) deleteMutation.mutate(post.id); }}
                                        className="p-2 rounded-lg text-slate-600 hover:text-red-400 transition-colors"
                                        style={{ background: 'rgba(255,255,255,0.04)' }}>
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // ─── EDITOR VIEW ─────────────────────────────────────
    return (
        <div className="bg-[#030712] min-h-screen flex flex-col">
            {/* Editor top bar */}
            <div className="sticky top-0 z-50 flex items-center gap-3 px-5 py-3 border-b"
                style={{ background: 'rgba(3,7,18,0.95)', backdropFilter: 'blur(20px)', borderColor: 'rgba(99,179,237,0.07)' }}>
                <button onClick={() => setView('list')}
                    className="flex items-center gap-1.5 text-xs font-mono text-slate-600 hover:text-slate-300 transition-colors mr-2">
                    <ArrowLeft className="w-3.5 h-3.5" /> Posts
                </button>

                <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Article title..."
                    className="flex-1 bg-transparent text-white font-bold text-lg placeholder-slate-700 focus:outline-none"
                />

                <div className="flex items-center gap-2 shrink-0">
                    {/* Status toggle */}
                    <button
                        onClick={() => setForm(f => ({ ...f, status: f.status === 'published' ? 'draft' : 'published' }))}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all"
                        style={form.status === 'published'
                            ? { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }
                            : { background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }
                        }>
                        {form.status === 'published' ? <Globe className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        {form.status}
                    </button>

                    {/* Preview */}
                    {editingId && (
                        <Link to={`/BlogPost/${editingId}`} target="_blank"
                            className="p-2 rounded-xl text-slate-600 hover:text-cyan-400 transition-colors"
                            style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <Eye className="w-4 h-4" />
                        </Link>
                    )}

                    {/* Save */}
                    <button onClick={handleSave} disabled={saveMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                        style={{ background: saved ? 'rgba(52,211,153,0.2)' : 'linear-gradient(135deg, #0891b2, #7c3aed)', color: saved ? '#34d399' : 'white', border: saved ? '1px solid rgba(52,211,153,0.3)' : 'none' }}>
                        <Save className="w-4 h-4" />
                        {saved ? 'Saved!' : saveMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Main editor */}
                <div className="flex-1 flex flex-col overflow-auto p-4 lg:p-6">
                    {/* Excerpt */}
                    <textarea
                        value={form.excerpt}
                        onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                        placeholder="Short excerpt / summary (shown in listing)..."
                        rows={2}
                        className="w-full mb-4 px-4 py-3 rounded-xl text-sm text-slate-400 placeholder-slate-700 font-mono resize-none focus:outline-none"
                        style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(148,163,184,0.07)' }}
                    />
                    <div className="flex-1">
                        <MarkdownEditor value={form.content} onChange={v => setForm(f => ({ ...f, content: v }))} />
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="w-72 border-l p-5 space-y-6 overflow-y-auto hidden lg:block"
                    style={{ borderColor: 'rgba(99,179,237,0.06)', background: 'rgba(15,23,42,0.3)' }}>

                    {/* Category */}
                    <div>
                        <label className="text-xs font-mono text-slate-600 uppercase tracking-widest block mb-2">Category</label>
                        <div className="relative">
                            <select
                                value={form.category}
                                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                className="w-full appearance-none px-3 py-2.5 rounded-xl text-sm text-slate-300 focus:outline-none pr-8"
                                style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.1)' }}>
                                <option value="">Select category</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="text-xs font-mono text-slate-600 uppercase tracking-widest block mb-2">Tags</label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {form.tags?.map(t => (
                                <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono text-slate-400"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                    {t}
                                    <button onClick={() => removeTag(t)} className="text-slate-600 hover:text-red-400 transition-colors">
                                        <X className="w-2.5 h-2.5" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={addTag}
                            placeholder="Add tag, press Enter"
                            className="w-full px-3 py-2 rounded-xl text-xs font-mono text-slate-400 placeholder-slate-700 focus:outline-none"
                            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.08)' }}
                        />
                    </div>

                    {/* Cover image */}
                    <div>
                        <label className="text-xs font-mono text-slate-600 uppercase tracking-widest block mb-2">Cover Image URL</label>
                        <input
                            value={form.cover_image || ''}
                            onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-xl text-xs font-mono text-slate-400 placeholder-slate-700 focus:outline-none"
                            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.08)' }}
                        />
                        {form.cover_image && (
                            <img src={form.cover_image} alt="cover" className="mt-2 w-full h-28 object-cover rounded-xl" />
                        )}
                    </div>

                    {/* Read time */}
                    <div>
                        <label className="text-xs font-mono text-slate-600 uppercase tracking-widest block mb-2">
                            Est. Read Time
                        </label>
                        <div className="flex items-center gap-2 text-sm text-slate-400 font-mono px-3 py-2 rounded-xl"
                            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.08)' }}>
                            <Clock className="w-3.5 h-3.5 text-slate-600" />
                            {estimateReadTime(form.content)} min read
                        </div>
                    </div>

                    {/* Word count */}
                    <div>
                        <label className="text-xs font-mono text-slate-600 uppercase tracking-widest block mb-2">Word Count</label>
                        <p className="text-slate-400 text-sm font-mono px-3 py-2 rounded-xl"
                            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.08)' }}>
                            {(form.content || '').split(/\s+/).filter(Boolean).length} words
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}