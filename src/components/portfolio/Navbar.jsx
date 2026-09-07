import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Command, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { navSections, profile, links } from '@/data/site';

// Smooth-scroll to a section without triggering route navigation / refresh
const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${id}`);
    }
};

export const openCommandPalette = () => window.dispatchEvent(new CustomEvent('open-command-palette'));

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const location = useLocation();
    const isBlog = location.pathname.startsWith('/Blog');
    const navLinks = isBlog ? [] : navSections;

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 60);
            const sections = document.querySelectorAll('section[id]');
            let current = '';
            sections.forEach((sec) => {
                if (sec.getBoundingClientRect().top <= 120) current = sec.id;
            });
            setActiveSection(current);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <motion.nav
                className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
                style={scrolled ? {
                    background: 'rgba(3,7,18,0.85)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(99,179,237,0.07)',
                } : {}}
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/Portfolio" className="font-display font-extrabold text-xl tracking-tighter text-white">
                        MM<span style={{ color: '#67e8f9' }}>.</span>
                    </Link>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((l) => (
                            <a key={l.id} href={`#${l.id}`} onClick={(e) => scrollToSection(e, l.id)}
                                className="text-sm font-mono text-slate-500 hover:text-white transition-colors tracking-wide"
                                style={activeSection === l.id ? { color: '#67e8f9' } : {}}>
                                <span style={{ color: '#67e8f9' }}>./</span>{l.label}
                            </a>
                        ))}
                        <Link to="/Blog"
                            className="text-sm font-mono transition-colors hover:text-white"
                            style={{ color: isBlog ? '#67e8f9' : '#64748b' }}>
                            <span style={{ color: '#67e8f9' }}>./</span>blog
                        </Link>
                        <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-mono text-slate-500 hover:text-white transition-colors">
                            <FileText className="w-3.5 h-3.5" /> resume
                        </a>
                        <button onClick={openCommandPalette}
                            className="hidden lg:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-500 hover:text-slate-200 transition-colors"
                            style={{ border: '1px solid rgba(148,163,184,0.15)' }}
                            aria-label="Open command palette">
                            <Command className="w-3.5 h-3.5" /> K
                        </button>
                        <a href={links.email}
                            className="px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all hover:brightness-125"
                            style={{ background: 'rgba(6,182,212,0.1)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.2)' }}>
                            hire_me()
                        </a>
                    </div>

                    {/* Mobile toggle */}
                    <button onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-slate-500 hover:text-white transition-colors"
                        aria-label="Toggle menu">
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </motion.nav>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7"
                        style={{ background: 'rgba(3,7,18,0.97)', backdropFilter: 'blur(20px)' }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {navLinks.map((l, i) => (
                            <motion.a key={l.id} href={`#${l.id}`}
                                onClick={(e) => { scrollToSection(e, l.id); setMobileOpen(false); }}
                                className="text-2xl font-mono text-slate-300 hover:text-white"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}>
                                <span style={{ color: '#67e8f9' }}>./</span>{l.label}
                            </motion.a>
                        ))}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: navLinks.length * 0.06 }} className="flex flex-col items-center gap-7">
                            <Link to="/Blog" onClick={() => setMobileOpen(false)}
                                className="text-2xl font-mono text-slate-300 hover:text-white">
                                <span style={{ color: '#67e8f9' }}>./</span>blog
                            </Link>
                            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"
                                className="text-2xl font-mono text-slate-300 hover:text-white">
                                <span style={{ color: '#67e8f9' }}>./</span>resume
                            </a>
                            <a href={links.email}
                                className="mt-2 px-6 py-3 rounded-full text-sm font-semibold bg-white text-[#030712]">
                                Hire me
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
