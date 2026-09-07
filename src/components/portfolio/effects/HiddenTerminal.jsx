import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { profile, links, stack, experience, featured, education } from '@/data/site';

// All terminal content derives from src/data/site.js so it can never drift from the page.
const COMMANDS = {
    whoami: [
        `> ${profile.name.toLowerCase().replace(' ', '')}`,
        `> ${profile.title} @ ${profile.company}`,
        `> ${profile.headline}`,
    ],
    ls: [
        './work/         → sofy-web-agent/  headroom/  why-blame/',
        './experience/   → sofy-ai/  skynners/',
        './stack/        → see `cat skills.md`',
        './contact/      → see `cat contact.md`',
    ],
    cat: {
        'skills.md': [
            '# skills.md',
            '',
            ...stack.flatMap(g => [`## ${g.title}`, `  ${g.items.join(' · ')}`, '']),
        ],
        'experience.md': [
            '# experience.md',
            '',
            ...experience.flatMap(exp => exp.roles.flatMap(role => [
                `## ${exp.company} — ${role.title} (${role.period})`,
                ...role.bullets.slice(0, 3).map(b => `  · ${b.length > 110 ? b.slice(0, 107) + '…' : b}`),
                '',
            ])),
            `## Education`,
            `  ${education.degree} · ${education.shortSchool} · ${education.period}`,
        ],
        'projects.md': [
            '# projects.md',
            '',
            ...featured.flatMap(f => [
                `## ${f.title}`,
                `  ${f.stack.join(' · ')}`,
                ...f.links.map(l => `  → ${l.href}`),
                '',
            ]),
        ],
        'contact.md': [
            '# contact.md',
            '',
            `email:    ${profile.email}`,
            `phone:    ${profile.phone}`,
            `github:   ${links.github.replace('https://', '')}`,
            `linkedin: ${links.linkedin.replace('https://www.', '')}`,
            `upwork:   ${links.upwork.replace('https://www.', '')}`,
            `resume:   ${window.location.origin}${profile.resumeUrl}`,
            `status:   ${profile.availability}`,
        ],
    },
    help: [
        'Available commands:',
        '  whoami          — who are you?',
        '  ls              — list directories',
        '  cat <file>      — view a file (skills.md, experience.md, projects.md, contact.md)',
        '  open <target>   — github | linkedin | upwork | resume | sofy',
        '  neofetch        — system info',
        '  date            — current date/time',
        '  echo <text>     — print text',
        '  clear           — clear terminal',
        '  help            — show this help',
        '  exit            — close terminal',
    ],
    neofetch: [
        '        ████████      muteeb@portfolio',
        '      ██        ██    ───────────────────',
        '    ██  ████  ████    OS:      Portfolio v4.0 (flagship)',
        `    ██  ████  ████    Host:    ${profile.name}`,
        `    ██    ██    ██    Uptime:  ${profile.yearsExperience}+ years engineering`,
        '      ██  ██  ██      Shell:   zsh (web)',
        '        ████████      CPU:     LangChain · MCP · Node.js',
        '                    GPU:     Three.js WebGL backdrop',
        `                    Locale:  ${profile.location} (${profile.timezone})`,
    ],
};

const OPEN_TARGETS = {
    github: links.github,
    linkedin: links.linkedin,
    upwork: links.upwork,
    resume: profile.resumeUrl,
    sofy: links.sofy,
    email: links.email,
};

/**
 * HiddenTerminal — Interactive command-line interpreter.
 * Trigger with the ` (backtick / tilde) key. A true portfolio easter egg.
 */
export default function HiddenTerminal() {
    const [open, setOpen] = useState(false);
    const [history, setHistory] = useState([
        'MUTEEB OS v4.0 — flagship build',
        'Type `help` to see available commands. Press ESC or type `exit` to close.',
        '',
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const bodyRef = useRef(null);
    const openRef = useRef(open);

    useEffect(() => {
        openRef.current = open;
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
    }, [open]);

    // Global backtick key to toggle — ignored while typing in any other field
    useEffect(() => {
        const onKey = (e) => {
            const t = e.target;
            const typingElsewhere = t && t !== inputRef.current && (
                t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable
            );
            if ((e.key === '`' || e.key === '~') && !typingElsewhere) {
                e.preventDefault();
                setOpen(o => !o);
            }
            if (e.key === 'Escape' && openRef.current) {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }, [history, open]);

    const runCommand = (raw) => {
        const cmd = raw.trim();
        const [name, ...args] = cmd.split(/\s+/);

        let output = [];

        switch (name) {
            case '':
                break;
            case 'help':
                output = COMMANDS.help;
                break;
            case 'whoami':
                output = COMMANDS.whoami;
                break;
            case 'ls':
                output = COMMANDS.ls;
                break;
            case 'cat': {
                const file = args[0];
                const content = COMMANDS.cat?.[file];
                if (!file || !content) {
                    output = [`No such file: ${file || '(empty)'}`, 'Available: ' + Object.keys(COMMANDS.cat).join(', ')];
                } else {
                    output = content;
                }
                break;
            }
            case 'neofetch':
                output = COMMANDS.neofetch;
                break;
            case 'date':
                output = [new Date().toString()];
                break;
            case 'echo':
                output = [args.join(' ') || ''];
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'exit':
                setOpen(false);
                return;
            case 'sudo':
                output = ['Nice try. Even in this fictional terminal, you are not root. 😏'];
                break;
            case 'github':
            case 'linkedin':
            case 'upwork':
            case 'resume':
            case 'email':
                window.open(OPEN_TARGETS[name], '_blank', 'noopener,noreferrer');
                output = [`Opening ${name}…`];
                break;
            case 'projects':
                output = COMMANDS.cat['projects.md'];
                break;
            case 'open':
            case 'start': {
                const target = OPEN_TARGETS[args[0]];
                if (target) {
                    window.open(target, '_blank', 'noopener,noreferrer');
                    output = [`Opening ${args[0]}…`];
                } else {
                    output = [`Unknown target: ${args[0] || '(empty)'}`, 'Available: ' + Object.keys(OPEN_TARGETS).join(', ')];
                }
                break;
            }
            default:
                output = [`command not found: ${name}`, 'Type `help` for available commands.'];
        }

        setHistory(h => [...h, `$ ${cmd}`, ...output, '']);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        runCommand(input);
        setInput('');
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[9996] flex items-center justify-center p-4 sm:p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
                >
                    <div className="absolute inset-0" style={{ background: 'rgba(3,7,18,0.75)', backdropFilter: 'blur(12px)' }} />

                    <motion.div
                        className="relative w-full max-w-2xl rounded-2xl overflow-hidden font-mono"
                        style={{
                            background: 'rgba(2,6,23,0.95)',
                            border: '1px solid rgba(99,179,237,0.2)',
                            boxShadow: '0 0 60px rgba(99,179,237,0.15), 0 0 20px rgba(192,132,252,0.1)',
                        }}
                        initial={{ y: 28, scale: 0.97, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 20, scale: 0.98, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="flex items-center gap-2 px-4 py-3 border-b"
                            style={{ background: 'rgba(15,23,42,0.6)', borderColor: 'rgba(99,179,237,0.1)' }}>
                            <div className="w-3 h-3 rounded-full bg-red-500/70" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                            <div className="w-3 h-3 rounded-full bg-green-500/70" />
                            <span className="ml-3 text-xs text-slate-500 shrink-0">muteeb@portfolio: ~/hidden-terminal</span>
                            <button
                                onClick={() => setOpen(false)}
                                className="ml-auto text-slate-600 hover:text-slate-300 transition-colors"
                                aria-label="Close terminal"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div
                            ref={bodyRef}
                            className="p-4 h-[320px] sm:h-[380px] overflow-y-auto text-xs sm:text-sm leading-relaxed"
                            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,179,237,0.3) transparent' }}
                            onClick={() => inputRef.current?.focus()}
                        >
                            {history.length === 0 && (
                                <div className="text-slate-700 mb-2">// terminal cleared</div>
                            )}
                            {history.map((line, i) => {
                                const isCmd = line.startsWith('$ ');
                                const isFileHeading = line.startsWith('# ') || line.startsWith('## ');
                                return (
                                    <div
                                        key={i}
                                        className="whitespace-pre-wrap"
                                        style={{ color: isCmd ? '#67e8f9' : isFileHeading ? '#c084fc' : '#94a3b8' }}
                                    >
                                        {line || '\u00A0'}
                                    </div>
                                );
                            })}
                        </div>

                        <form onSubmit={onSubmit} className="flex items-center gap-2 px-4 py-3 border-t"
                            style={{ borderColor: 'rgba(99,179,237,0.1)', background: 'rgba(15,23,42,0.4)' }}>
                            <span className="text-green-500 shrink-0">➜</span>
                            <span className="text-cyan-500 shrink-0">~</span>
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="flex-1 bg-transparent text-slate-200 text-sm font-mono focus:outline-none"
                                placeholder="type `help` to begin..."
                                spellCheck={false}
                                autoComplete="off"
                                autoCorrect="off"
                            />
                            <kbd className="hidden sm:inline text-[10px] text-slate-700 border border-slate-800 rounded px-1.5 py-0.5">ESC</kbd>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
