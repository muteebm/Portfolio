import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, ArrowDown } from 'lucide-react';
import ParticleCanvas from './effects/ParticleCanvas';
import TypeWriter from './effects/TypeWriter';
import GlitchText from './effects/GlitchText';

const roles = [
  'Senior Software Engineer',
  'LLM Systems Architect',
  'Agentic Workflow Builder',
  'Microservices Craftsman',
  'Full-Stack Engineer',
];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030712]">
      <ParticleCanvas />

      {/* Deep radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,179,237,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_80%,rgba(139,92,246,0.06),transparent)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Status pill */}
        <motion.div
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10 text-sm font-mono"
          style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', color: '#67e8f9' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          &gt;_ Available for Remote &amp; Relocation (EU / AUS)
        </motion.div>

        {/* Main name */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            className="text-6xl sm:text-8xl lg:text-[112px] font-black tracking-tighter leading-none text-white"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <GlitchText text="Muteeb" className="block" />
            <span className="block relative">
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #67e8f9 0%, #818cf8 40%, #c084fc 100%)' }}
              >
                Matloob
              </span>
              {/* Glow under name */}
              <span className="absolute -bottom-2 left-0 right-0 h-px mx-auto w-3/4"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.5), transparent)' }} />
            </span>
          </motion.h1>
        </div>

        {/* Typewriter role */}
        <motion.div
          className="text-xl sm:text-2xl font-mono text-slate-400 mb-8 h-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="text-cyan-500/60">&gt; </span>
          <TypeWriter phrases={roles} speed={70} pause={2200} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto font-mono mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-violet-400/70">6+ years</span> building systems that think, scale, and ship.
          <br />LLMs · Microservices · Agentic Workflows · Cloud
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <a href="mailto:muteebmatloobm@gmail.com"
            className="group relative px-8 py-3.5 rounded-full text-sm font-semibold overflow-hidden transition-all"
            style={{ background: 'linear-gradient(135deg, #0891b2, #7c3aed)', color: '#fff' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Hire Me
            </span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }} />
          </a>
          <a href="#projects"
            className="px-8 py-3.5 rounded-full text-sm font-semibold border text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all"
            style={{ borderColor: 'rgba(148,163,184,0.2)', backdropFilter: 'blur(8px)' }}
          >
            View Projects ↓
          </a>
        </motion.div>

        {/* Social icons */}
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {[
            { icon: Github, href: "https://github.com/muteebm", label: "GitHub" },
            { icon: Linkedin, href: "https://linkedin.com/in/muteebm", label: "LinkedIn" },
            { icon: Phone, href: "tel:+923111080422", label: "Phone" },
            { icon: Mail, href: "mailto:muteebmatloobm@gmail.com", label: "Email" },
          ].map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="group w-11 h-11 rounded-xl flex items-center justify-center transition-all"
              style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.1)' }}
              aria-label={label}
            >
              <Icon className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
        <span className="text-xs text-slate-600 font-mono tracking-widest">SCROLL</span>
        <ArrowDown className="w-4 h-4 text-slate-700" />
      </motion.div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
    </section>
  );
}