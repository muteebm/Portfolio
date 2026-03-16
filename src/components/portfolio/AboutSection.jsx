import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function CountUp({ target, suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef();
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [inView, target, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

const terminalLines = [
    { delay: 0, prompt: '$', cmd: 'whoami', out: 'Muteeb Matloob — Senior Software Engineer' },
    { delay: 0.6, prompt: '$', cmd: 'cat vision.txt', out: 'Architect intelligent systems bridging scalable microservices with autonomous LLM workflows.' },
    { delay: 1.3, prompt: '$', cmd: 'ls ./superpowers', out: 'agentic-ai/   microservices/   cloud-native/   full-stack/' },
    { delay: 2.0, prompt: '$', cmd: 'echo $STATUS', out: '🟢 Available · Open to Remote & Relocation' },
];

const stats = [
    { label: 'Years Experience', value: 6, suffix: '+' },
    { label: 'Projects Shipped', value: 15, suffix: '+' },
    { label: 'Daily Events Handled', value: 1, suffix: 'M+' },
    { label: 'Users Acquired', value: 10, suffix: 'K+' },
];

export default function AboutSection() {
    return (
        <section id="about" className="relative py-32 bg-[#030712] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(139,92,246,0.04),transparent)]" />

            <div className="max-w-6xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <p className="text-xs uppercase tracking-[0.3em] font-mono mb-3" style={{ color: '#67e8f9' }}>// about</p>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-16 tracking-tight">
                        I build things that<br />
                        <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #c084fc, #818cf8)' }}>think & scale.</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Terminal */}
                    <motion.div
                        className="rounded-2xl overflow-hidden"
                        style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,179,237,0.1)', backdropFilter: 'blur(12px)' }}
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        {/* Terminal header */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'rgba(99,179,237,0.08)', background: 'rgba(15,23,42,0.5)' }}>
                            <div className="w-3 h-3 rounded-full bg-red-500/70" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                            <div className="w-3 h-3 rounded-full bg-green-500/70" />
                            <span className="ml-3 text-xs text-slate-600 font-mono">muteeb@portfolio ~ zsh</span>
                        </div>
                        <div className="p-5 space-y-4 font-mono text-sm min-h-[280px]">
                            {terminalLines.map((line, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }} transition={{ delay: line.delay, duration: 0.4 }}>
                                    <div className="flex gap-2">
                                        <span style={{ color: '#10b981' }}>➜</span>
                                        <span style={{ color: '#67e8f9' }}>~</span>
                                        <span className="text-slate-300">{line.cmd}</span>
                                    </div>
                                    <div className="mt-1 ml-6 text-slate-500">{line.out}</div>
                                </motion.div>
                            ))}
                            <motion.div
                                className="flex gap-2 mt-2"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 2.6 }}
                            >
                                <span style={{ color: '#10b981' }}>➜</span>
                                <span style={{ color: '#67e8f9' }}>~</span>
                                <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-4 content-start">
                        {stats.map((s, i) => (
                            <motion.div
                                key={s.label}
                                className="rounded-2xl p-6 relative overflow-hidden group cursor-default"
                                style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.06)' }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ borderColor: 'rgba(99,179,237,0.2)', y: -2 }}
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ background: 'radial-gradient(circle at 50% 0%, rgba(99,179,237,0.05), transparent 70%)' }} />
                                <div className="text-4xl font-black text-white mb-1">
                                    <CountUp target={s.value} suffix={s.suffix} />
                                </div>
                                <div className="text-xs text-slate-500 font-mono uppercase tracking-widest">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}