import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, Code2, Columns } from 'lucide-react';

const TOOLBAR = [
    { label: 'H1', insert: '# ', wrap: false },
    { label: 'H2', insert: '## ', wrap: false },
    { label: 'H3', insert: '### ', wrap: false },
    { label: 'B', insert: '**', wrap: true },
    { label: 'I', insert: '_', wrap: true },
    { label: '`', insert: '`', wrap: true },
    { label: '```', insert: '```\n', wrap: false },
    { label: '→', insert: '> ', wrap: false },
    { label: '—', insert: '---\n', wrap: false },
    { label: '• list', insert: '- ', wrap: false },
    { label: '1. list', insert: '1. ', wrap: false },
    { label: '[link]', insert: '[text](url)', wrap: false },
];

export default function MarkdownEditor({ value, onChange, placeholder = 'Write your article in markdown...' }) {
    const [mode, setMode] = useState('split'); // 'write' | 'preview' | 'split'

    const insertMarkdown = (item, textarea) => {
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = value.slice(start, end);
        let newText;
        if (item.wrap) {
            newText = value.slice(0, start) + item.insert + selected + item.insert + value.slice(end);
        } else {
            newText = value.slice(0, start) + item.insert + selected + value.slice(end);
        }
        onChange(newText);
        setTimeout(() => {
            textarea.focus();
            const pos = start + item.insert.length + (item.wrap ? selected.length + item.insert.length : selected.length);
            textarea.setSelectionRange(pos, pos);
        }, 0);
    };

    return (
        <div className="flex flex-col h-full rounded-2xl overflow-hidden"
            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,179,237,0.1)' }}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2.5 border-b flex-wrap"
                style={{ borderColor: 'rgba(99,179,237,0.08)', background: 'rgba(15,23,42,0.5)' }}>
                {/* Mode toggle */}
                <div className="flex rounded-lg overflow-hidden mr-3" style={{ border: '1px solid rgba(99,179,237,0.1)' }}>
                    {[
                        { id: 'write', icon: Code2 },
                        { id: 'split', icon: Columns },
                        { id: 'preview', icon: Eye },
                    ].map(({ id, icon: Icon }) => (
                        <button key={id} onClick={() => setMode(id)}
                            className="px-3 py-1.5 text-xs transition-all"
                            style={mode === id
                                ? { background: 'rgba(99,179,237,0.15)', color: '#67e8f9' }
                                : { color: '#475569' }}>
                            <Icon className="w-3.5 h-3.5" />
                        </button>
                    ))}
                </div>

                {TOOLBAR.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => insertMarkdown(item, document.getElementById('md-editor'))}
                        className="px-2 py-1 text-xs font-mono rounded transition-all text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/5"
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Editor / Preview */}
            <div className="flex flex-1 overflow-hidden min-h-[500px]">
                {/* Write pane */}
                {(mode === 'write' || mode === 'split') && (
                    <textarea
                        id="md-editor"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 p-5 bg-transparent text-slate-300 text-sm font-mono leading-7 resize-none focus:outline-none placeholder-slate-700"
                        style={{ borderRight: mode === 'split' ? '1px solid rgba(99,179,237,0.06)' : 'none' }}
                        spellCheck={false}
                    />
                )}

                {/* Preview pane */}
                {(mode === 'preview' || mode === 'split') && (
                    <div className="flex-1 p-5 overflow-y-auto">
                        <div className="prose prose-invert prose-sm max-w-none
              prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
              prose-h1:text-3xl prose-h2:text-xl prose-h3:text-lg
              prose-p:text-slate-400 prose-p:leading-7
              prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
              prose-code:text-cyan-300 prose-code:bg-cyan-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
              prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl
              prose-blockquote:border-l-cyan-500/40 prose-blockquote:text-slate-500 prose-blockquote:not-italic
              prose-strong:text-white prose-em:text-slate-300
              prose-li:text-slate-400 prose-li:marker:text-cyan-500
              prose-hr:border-slate-800
              prose-img:rounded-xl">
                            {value ? (
                                <ReactMarkdown>{value}</ReactMarkdown>
                            ) : (
                                <p className="text-slate-700 text-sm font-mono">// preview will appear here</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}