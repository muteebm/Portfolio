import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const COMMANDS = {
    whoami: [
        '> muteeb',
        '> Senior Software Engineer · LLM Systems Architect',
        '> Agentic Workflow Builder · Microservices Craftsman',
    ],
    ls: [
        './ai/          → llm-agentic-workflows/',
        './backend/     → python-node-microservices/',
        './cloud/       → azure-aws-docker/',
        './frontend/    → react-angular-rn/',
        './skills/      → see `cat skills.md`',
    ],
    cat: {
        'skills.md': [
            '# skills.md',
            '',
            '## AI & Agentic',
            '  LLMs · LangChain · Agentic Workflows · Playwright · MCP Server',
            '',
            '## Backend & APIs',
            '  Python · Flask · FastAPI · Node.js · Express · TypeScript · REST',
            '',
            '## Cloud & Infra',
            '  Azure · AWS · GCP · Docker · Microservices · CI/CD',
            '',
            '## Frontend',
            '  React · Angular · React Native · State Management',
            '',
            '## Databases',
            '  PostgreSQL · MongoDB · Redis · MS SQL · Supabase',
        ],
        'experience.md': [
            '# experience.md',
            '',
            '## Sofy.ai — Senior SWE / Team Lead (Jul 2022 → Present)',
            '  · Sofy Web Agent — autonomous LLM system (Python, LangChain, Playwright)',
            '  · MCP server for cross-agent capability sharing',
            '  · Monolith → microservices migration (Strangler Fig)',
            '  · Azure Service Bus — 1M+ daily events',
            '',
            '## Skynners — Co-Founder (2017 → 2020)',
            '  · 15+ enterprise software solutions',
            '  · AAB app — 10K+ users in 3 months',
            '  · AWS + Docker · 99.9% uptime',
        ],
        'contact.md': [
            '# contact.md',
            '',
            'email:    muteebmatloobm@gmail.com',
            'phone:    +92 311 1080422',
            'github:   github.com/muteebm',
            'linkedin: linkedin.com/in/muteebm',
            'website:  muteeb.space',
        ],
    },
    help: [
        'Available commands:',
        '  whoami          — who are you?',
        '  ls              — list directories',
        '  cat <file>      — view a file (skills.md, experience.md, contact.md)',
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
        '    ██  ████  ████    OS:      Immersive Portfolio v3.0',
        '    ██  ████  ████    Host:    Muteeb Matloob',
        '    ██    ██    ██    Uptime:  6+ years experience',
        '      ██  ██  ██      Shell:   zsh (web)',
        '        ████████      CPU:     Neural Network Co-processor',
        '                    GPU:     WebGL Wireframe Engine',
    ],
};

/**
 * HiddenTerminal — Interactive command-line interpreter.
 * Trigger with the ` (backtick / tilde) key. A true portfolio easter egg.
 */
export default function HiddenTerminal() {
    const [open, setOpen] = useState(false);
    const [history, setHistory] = useState([
        'MUTEEB OS v3.0 — immersive build',
        'Type `help` to see available commands. Press ESC or type `exit` to close.',
        '',
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const bodyRef = useRef(null);
    const openRef = useRef(open);

    // Keep open state in sync for the escape handler
    useEffect(() => {
        openRef.current = open;
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
    }, [open]);

    // Global backtick key to toggle
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === '`' || e.key === '~') {
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

    // Auto-scroll to bottom on history change
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
            case 'email':
                output = ['Try the contact section ↓'];
                break;
            case 'projects':
                output = ['Scroll down to #projects — real projects are on the way!'];
                break;
            case 'open':
            case 'start':
                output = [`Opening ${args[0] || 'nothing'}... (not implemented here)`];
                break;
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
                    {/* Backdrop blur */}
                    <div className="absolute inset-0" style={{ background: 'rgba(3,7,18,0.75)', backdropFilter: 'blur(12px)' }} />

                    {/* Terminal window */}
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
                        {/* Header */}
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

                        {/* Output */}
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
                                const isFileHeading = line.startsWith('# ');
                                return (
                                    <div
                                        key={i}
                                        className="whitespace-pre-wrap"
                                        style={{
                                            color: isCmd ? '#67e8f9' : isFileHeading ? '#c084fc' : '#94a3b8',
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        {line || '\u00A0'}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input line */}
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