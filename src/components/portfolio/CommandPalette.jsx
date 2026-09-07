import React, { useEffect, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Home, Layers, Briefcase, Cpu, Mail, Copy, Github, Linkedin, FileText, PenLine, Terminal, ExternalLink,
} from 'lucide-react';
import { profile, links, navSections, featured } from '@/data/site';

const sectionIcons = { work: Layers, experience: Briefcase, stack: Cpu, contact: Mail };

/**
 * CommandPalette — Ctrl/⌘+K launcher. Jump to sections, open profiles,
 * copy the email address, download the resume or open a case study link.
 */
export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen(o => !o);
            } else if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        const onOpen = () => setOpen(true);
        window.addEventListener('keydown', onKey);
        window.addEventListener('open-command-palette', onOpen);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('open-command-palette', onOpen);
        };
    }, []);

    const flash = useCallback((msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 1800);
    }, []);

    const run = (fn) => () => { setOpen(false); fn(); };

    const goTo = (id) => {
        if (window.location.pathname !== '/Portfolio') {
            navigate('/Portfolio');
            setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 350);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const openUrl = (href) => window.open(href, '_blank', 'noopener,noreferrer');

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(profile.email);
            flash('Email copied to clipboard');
        } catch {
            flash(profile.email);
        }
    };

    const itemClass = 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 cursor-pointer aria-selected:bg-white/[0.06] aria-selected:text-white transition-colors';

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 z-[9995] flex items-start justify-center pt-[12vh] px-4"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
                    >
                        <div className="absolute inset-0" style={{ background: 'rgba(3,7,18,0.7)', backdropFilter: 'blur(10px)' }} />
                        <motion.div
                            className="relative w-full max-w-xl rounded-2xl overflow-hidden"
                            style={{
                                background: 'rgba(2,6,23,0.96)',
                                border: '1px solid rgba(99,179,237,0.2)',
                                boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(99,179,237,0.1)',
                            }}
                            initial={{ y: -12, scale: 0.98, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: -8, scale: 0.98, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Command label="Command palette" loop>
                                <div className="flex items-center gap-3 px-4 border-b" style={{ borderColor: 'rgba(99,179,237,0.12)' }}>
                                    <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                                    <Command.Input
                                        autoFocus
                                        placeholder="Jump to a section, copy email, open a link…"
                                        className="flex-1 py-4 bg-transparent text-sm text-slate-100 placeholder:text-slate-600 outline-none font-mono"
                                    />
                                    <kbd className="text-[10px] text-slate-600 border border-slate-800 rounded px-1.5 py-0.5 font-mono">ESC</kbd>
                                </div>
                                <Command.List className="max-h-[60vh] overflow-y-auto p-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-slate-600">
                                    <Command.Empty className="py-8 text-center text-sm text-slate-600 font-mono">No matches.</Command.Empty>

                                    <Command.Group heading="Navigate">
                                        <Command.Item className={itemClass} onSelect={run(() => goTo('hero'))} value="home top hero">
                                            <Home className="w-4 h-4 text-slate-500" /> Top
                                        </Command.Item>
                                        {navSections.map(s => {
                                            const Icon = sectionIcons[s.id] || Layers;
                                            return (
                                                <Command.Item key={s.id} className={itemClass} onSelect={run(() => goTo(s.id))} value={`${s.label} section`}>
                                                    <Icon className="w-4 h-4 text-slate-500" /> {s.label[0].toUpperCase() + s.label.slice(1)}
                                                </Command.Item>
                                            );
                                        })}
                                        <Command.Item className={itemClass} onSelect={run(() => navigate('/Blog'))} value="blog writing articles">
                                            <PenLine className="w-4 h-4 text-slate-500" /> Blog
                                        </Command.Item>
                                    </Command.Group>

                                    <Command.Group heading="Hire">
                                        <Command.Item className={itemClass} onSelect={run(() => { window.location.href = links.email; })} value="email hire me send">
                                            <Mail className="w-4 h-4 text-slate-500" /> Email {profile.firstName}
                                            <span className="ml-auto text-xs text-slate-600 font-mono">{profile.email}</span>
                                        </Command.Item>
                                        <Command.Item className={itemClass} onSelect={run(copyEmail)} value="copy email address clipboard">
                                            <Copy className="w-4 h-4 text-slate-500" /> Copy email address
                                        </Command.Item>
                                        <Command.Item className={itemClass} onSelect={run(() => openUrl(profile.resumeUrl))} value="resume cv download pdf">
                                            <FileText className="w-4 h-4 text-slate-500" /> Download resume (PDF)
                                        </Command.Item>
                                        <Command.Item className={itemClass} onSelect={run(() => openUrl(links.upwork))} value="upwork freelance hire">
                                            <Briefcase className="w-4 h-4 text-slate-500" /> Upwork profile
                                        </Command.Item>
                                    </Command.Group>

                                    <Command.Group heading="Profiles">
                                        <Command.Item className={itemClass} onSelect={run(() => openUrl(links.github))} value="github code repos">
                                            <Github className="w-4 h-4 text-slate-500" /> GitHub
                                        </Command.Item>
                                        <Command.Item className={itemClass} onSelect={run(() => openUrl(links.linkedin))} value="linkedin profile">
                                            <Linkedin className="w-4 h-4 text-slate-500" /> LinkedIn
                                        </Command.Item>
                                    </Command.Group>

                                    <Command.Group heading="Case studies">
                                        {featured.map(f => (
                                            <Command.Item key={f.id} className={itemClass}
                                                onSelect={run(() => f.links[0] ? openUrl(f.links[0].href) : goTo('work'))}
                                                value={`${f.title} ${f.stack.join(' ')}`}>
                                                <ExternalLink className="w-4 h-4 text-slate-500" /> {f.title}
                                                <span className="ml-auto text-xs text-slate-600 font-mono truncate max-w-[40%]">{f.links[0]?.label}</span>
                                            </Command.Item>
                                        ))}
                                    </Command.Group>
                                </Command.List>
                                <div className="flex items-center justify-between px-4 py-2 border-t text-[10px] font-mono text-slate-600"
                                    style={{ borderColor: 'rgba(99,179,237,0.12)' }}>
                                    <span>↑↓ navigate · ↵ select</span>
                                    <span>` opens the terminal</span>
                                </div>
                            </Command>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9997] px-4 py-2 rounded-full text-xs font-mono text-cyan-200"
                        style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,179,237,0.3)' }}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
