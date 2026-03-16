import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const portfolioLinks = [
    { label: 'about', href: '#about' },
    { label: 'experience', href: '#experience' },
    { label: 'projects', href: '#projects' },
    { label: 'skills', href: '#skills' },
    { label: 'contact', href: '#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const isBlog = location.pathname.startsWith('/Blog');
    const navLinks = isBlog ? [] : portfolioLinks;

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
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
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/Portfolio" className="font-black text-xl tracking-tighter text-white font-mono">
                        MM<span style={{ color: '#67e8f9' }}>_</span>
                    </Link>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((l) => (
                            <a key={l.label} href={l.href}
                                className="text-sm font-mono text-slate-500 hover:text-white transition-colors tracking-wide">
                                <span style={{ color: '#67e8f9' }}>./</span>{l.label}
                            </a>
                        ))}
                        <Link to="/Blog"
                            className="text-sm font-mono transition-colors"
                            style={{ color: isBlog ? '#67e8f9' : '#64748b' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
                            onMouseLeave={e => e.currentTarget.style.color = isBlog ? '#67e8f9' : '#64748b'}>
                            <span style={{ color: '#67e8f9' }}>./</span>blog
                        </Link>
                        <a href="mailto:muteebmatloobm@gmail.com"
                            className="px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all"
                            style={{ background: 'rgba(6,182,212,0.1)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.2)' }}>
                            hire_me()
                        </a>
                    </div>

                    {/* Mobile toggle */}
                    <button onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-slate-500 hover:text-white transition-colors">
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </motion.nav>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
                        style={{ background: 'rgba(3,7,18,0.97)', backdropFilter: 'blur(20px)' }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {navLinks.map((l, i) => (
                            <motion.a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                                className="text-2xl font-mono text-slate-300 hover:text-white"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}>
                                <span style={{ color: '#67e8f9' }}>./</span>{l.label}
                            </motion.a>
                        ))}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: navLinks.length * 0.06 }}>
                            <Link to="/Blog" onClick={() => setMobileOpen(false)}
                                className="text-2xl font-mono text-slate-300 hover:text-white">
                                <span style={{ color: '#67e8f9' }}>./</span>blog
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}