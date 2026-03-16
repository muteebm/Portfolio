import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Github, Linkedin, Send, Copy, Check } from 'lucide-react';

const links = [
    { icon: Github, label: "GitHub", value: "muteebm", href: "https://github.com/muteebm", color: "#c084fc" },
    { icon: Linkedin, label: "LinkedIn", value: "muteebm", href: "https://linkedin.com/in/muteebm", color: "#818cf8" },
    { icon: Phone, label: "Phone", value: "+92 311 1080422", href: "tel:+923111080422", color: "#34d399" },
];

export default function ContactSection() {
    const [copied, setCopied] = useState(false);

    const copyEmail = () => {
        navigator.clipboard.writeText('muteebmatloobm@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="contact" className="relative py-32 bg-[#030712] overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.15), transparent)' }} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(99,179,237,0.04),transparent)]" />

            <div className="max-w-4xl mx-auto px-6">
                <motion.div className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <p className="text-xs uppercase tracking-[0.3em] font-mono mb-3" style={{ color: '#67e8f9' }}>// contact</p>
                    <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-4">
                        Let's build<br />
                        <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #67e8f9, #c084fc)' }}>
                            something great.
                        </span>
                    </h2>
                    <p className="text-slate-500 font-mono text-sm max-w-md mx-auto">
                        Open to senior roles, consulting, and interesting open-source collaborations.
                    </p>
                </motion.div>

                {/* Big email CTA */}
                <motion.div className="mb-8"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                    <div className="group relative rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden"
                        style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,179,237,0.1)' }}>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(6,182,212,0.06), transparent 60%)' }} />
                        <div className="text-center sm:text-left">
                            <p className="text-xs text-slate-600 font-mono uppercase tracking-widest mb-1">Primary contact</p>
                            <p className="text-xl sm:text-2xl font-bold text-white">muteebmatloobm@gmail.com</p>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <button onClick={copyEmail}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-mono transition-all"
                                style={{ background: 'rgba(99,179,237,0.1)', color: '#67e8f9', border: '1px solid rgba(99,179,237,0.2)' }}>
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <a href="mailto:muteebmatloobm@gmail.com"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all text-white"
                                style={{ background: 'linear-gradient(135deg, #0891b2, #7c3aed)' }}>
                                <Send className="w-4 h-4" />
                                Send Email
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Other links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {links.map(({ icon: Icon, label, value, href, color }, i) => (
                        <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                            className="group relative rounded-2xl p-5 flex items-center gap-4 overflow-hidden transition-all"
                            style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(148,163,184,0.06)' }}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: 0.1 * i + 0.3 }}
                            whileHover={{ y: -3 }}
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                style={{ background: `radial-gradient(circle at 0% 50%, ${color}0d, transparent 70%)` }} />
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: color + '12', border: `1px solid ${color}25` }}>
                                <Icon className="w-5 h-5" style={{ color }} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 font-mono uppercase tracking-wider">{label}</p>
                                <p className="text-slate-300 text-sm font-medium">{value}</p>
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Education note */}
                <motion.div className="mt-12 text-center p-6 rounded-2xl"
                    style={{ background: 'rgba(15,23,42,0.3)', border: '1px solid rgba(148,163,184,0.05)' }}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                    <p className="text-slate-600 text-sm font-mono">
                        🎓 B.Sc. Computer Science · FAST - NUCES · Karachi · 2016–2020
                    </p>
                </motion.div>

                <div className="mt-16 text-center">
                    <p className="text-slate-700 text-xs font-mono">
                        Designed & built by Muteeb Matloob · {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </section>
    );
}