import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { profile, stats } from '@/data/site';

function CountUp({ target, suffix = '', duration = 1600 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        const start = performance.now();
        let raf;
        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setCount(Math.round(target * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, target, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

/**
 * AboutSection — a short editorial band: the vision statement on the left,
 * four resume-backed numbers on the right.
 */
export default function AboutSection() {
    return (
        <section id="about" className="relative py-24 sm:py-28 bg-transparent">
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.15), transparent)' }} />
            <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <motion.div
                    className="lg:col-span-6"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                >
                    <p className="text-xs uppercase tracking-[0.3em] font-mono mb-5" style={{ color: '#67e8f9' }}>// about</p>
                    <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-6">
                        I build systems that <span className="text-slate-400">reason, scale and ship.</span>
                    </h2>
                    <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl">
                        {profile.vision}
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xl mt-4 font-mono">
                        Currently leading the agentic side of Sofy&apos;s testing platform — from LangChain workflows and MCP
                        servers to the Node.js microservices and Azure messaging underneath them.
                    </p>
                </motion.div>

                <div className="lg:col-span-6 grid grid-cols-2 gap-px rounded-2xl overflow-hidden"
                    style={{ background: 'rgba(148,163,184,0.08)' }}>
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            className="p-6 sm:p-8 relative group"
                            style={{ background: 'rgba(3,7,18,0.85)' }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.5 }}
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                style={{ background: 'radial-gradient(circle at 30% 0%, rgba(99,179,237,0.08), transparent 70%)' }} />
                            <div className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2">
                                <CountUp target={s.value} suffix={s.suffix} />
                            </div>
                            <div className="text-xs text-slate-300 font-medium mb-1">{s.label}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{s.note}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
