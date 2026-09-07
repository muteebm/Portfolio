import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Github, Linkedin, Briefcase, Send, Copy, Check, FileText, Command } from 'lucide-react';
import { profile, links, education } from '@/data/site';
import { openCommandPalette } from './Navbar';

const contactLinks = [
    { icon: Linkedin, label: 'LinkedIn', value: 'in/muteebm', href: links.linkedin, color: '#818cf8' },
    { icon: Github, label: 'GitHub', value: '@muteebm', href: links.github, color: '#c084fc' },
    { icon: Briefcase, label: 'Upwork', value: 'Hire me for a project', href: links.upwork, color: '#34d399' },
    { icon: Phone, label: 'Phone', value: profile.phone, href: profile.phoneHref, color: '#fbbf24' },
];

export default function ContactSection() {
    const [copied, setCopied] = useState(false);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* clipboard unavailable */ }
    };

    return (
        <section id="contact" className="relative py-28 bg-transparent overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.15), transparent)' }} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(99,179,237,0.05),transparent)]" />

            <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <motion.div className="lg:col-span-5"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <p className="text-xs uppercase tracking-[0.3em] font-mono mb-4" style={{ color: '#67e8f9' }}>// contact</p>
                    <h2 className="font-display text-5xl sm:text-7xl font-bold text-white tracking-tight leading-[0.95] mb-6">
                        Let&apos;s build<br />
                        <span className="text-slate-400">something that ships.</span>
                    </h2>
                    <p className="text-slate-300 text-base leading-relaxed max-w-md mb-8">
                        Senior roles, agentic-AI consulting and well-scoped freelance builds. Remote-friendly, {profile.timezone}.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-white text-[#030712] hover:bg-cyan-200 transition-colors">
                            <FileText className="w-4 h-4" /> Download resume
                        </a>
                        <button onClick={openCommandPalette}
                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono text-slate-400 hover:text-white transition-colors"
                            style={{ border: '1px solid rgba(148,163,184,0.15)' }}>
                            <Command className="w-3.5 h-3.5" /> Ctrl / ⌘ K
                        </button>
                    </div>
                </motion.div>

                <div className="lg:col-span-7 space-y-4">
                    {/* Email card */}
                    <motion.div className="relative"
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
                        <div className="absolute -inset-px rounded-2xl opacity-70 pointer-events-none animate-borderAngle"
                            style={{
                                background: 'conic-gradient(from var(--border-angle), transparent 0%, rgba(99,179,237,0.5) 10%, transparent 25%, rgba(192,132,252,0.5) 40%, transparent 55%, rgba(103,232,249,0.5) 70%, transparent 85%)',
                            }} />
                        <div className="group relative rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden"
                            style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(3,7,18,0.9)' }}>
                            <div className="text-center sm:text-left">
                                <p className="text-xs text-slate-600 font-mono uppercase tracking-widest mb-1">Primary contact</p>
                                <p className="text-lg sm:text-2xl font-bold text-white break-all">{profile.email}</p>
                            </div>
                            <div className="flex gap-3 shrink-0">
                                <button onClick={copyEmail}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-mono transition-all"
                                    style={{ background: 'rgba(99,179,237,0.1)', color: '#67e8f9', border: '1px solid rgba(99,179,237,0.2)' }}>
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <a href={links.email}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                                    style={{ background: 'linear-gradient(135deg, #0891b2, #7c3aed)' }}>
                                    <Send className="w-4 h-4" /> Email
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {contactLinks.map(({ icon: Icon, label, value, href, color }, i) => (
                            <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                                className="group relative rounded-2xl p-5 flex items-center gap-4 overflow-hidden glass-card"
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                transition={{ delay: 0.08 * i + 0.25 }}
                                whileHover={{ y: -3 }}>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                    style={{ background: `radial-gradient(circle at 0% 50%, ${color}12, transparent 70%)` }} />
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: color + '12', border: `1px solid ${color}25` }}>
                                    <Icon className="w-5 h-5" style={{ color }} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">{label}</p>
                                    <p className="text-slate-200 text-sm font-medium truncate">{value}</p>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
                <p>🎓 {education.degree} · {education.shortSchool} · {education.location} · {education.period}</p>
                <p>Designed & built by {profile.name} · {new Date().getFullYear()}</p>
            </div>
        </section>
    );
}
