import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animId;
        let mouse = { x: -9999, y: -9999 };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

        const words = ['LangChain', 'Python', 'async/await', 'Docker', 'GPT-4', 'Node.js', 'TypeScript', '{ }', 'Redis', 'LLM', 'async', 'MCP', '[]', 'await', 'microservice', 'Playwright', 'Azure', '🤖', 'API', 'POST', 'JWT', 'npm'];

        const particles = Array.from({ length: 60 }, (_, i) => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            label: words[i % words.length],
            opacity: Math.random() * 0.25 + 0.05,
            size: Math.random() * 3 + 1,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99,179,237,${0.06 * (1 - dist / 140)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // Mouse interaction
                const mx = particles[i].x - mouse.x;
                const my = particles[i].y - mouse.y;
                const md = Math.sqrt(mx * mx + my * my);
                if (md < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139,92,246,${0.2 * (1 - md / 120)})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            // Draw particles & labels
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99,179,237,${p.opacity * 2})`;
                ctx.fill();

                ctx.font = `${10 + p.size}px 'Courier New', monospace`;
                ctx.fillStyle = `rgba(148,163,184,${p.opacity})`;
                ctx.fillText(p.label, p.x + 6, p.y + 4);

                p.x += p.vx;
                p.y += p.vy;
                if (p.x < -50) p.x = canvas.width + 50;
                if (p.x > canvas.width + 50) p.x = -50;
                if (p.y < -50) p.y = canvas.height + 50;
                if (p.y > canvas.height + 50) p.y = -50;
            });

            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}