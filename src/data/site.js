/**
 * site.js — Single source of truth for all portfolio copy, links and metrics.
 *
 * Canonical source: github.com/muteebm/Resume (LaTeX) + LinkedIn + public repos.
 * Every section, the hidden terminal, the command palette and the JSON-LD read
 * from here so numbers cannot drift between surfaces.
 */

export const profile = {
    name: 'Muteeb Matloob',
    firstName: 'Muteeb',
    handle: 'muteebm',
    title: 'Senior Software Engineer · Team Lead',
    company: 'Sofy.ai',
    headline: 'AI & agentic systems engineer building autonomous, production-grade software.',
    oneLiner:
        'Senior Software Engineer & Team Lead at Sofy.ai. I design LLM-powered agents, event-driven microservices and the cloud infrastructure that keeps them reliable — Python, Node.js, TypeScript, Angular, Azure.',
    vision:
        'Bridge robust, scalable microservices with autonomous agentic workflows — and lead teams that ship LLM-powered systems which remove real operational bottlenecks.',
    location: 'Karachi, Pakistan',
    timezone: 'UTC+5',
    availability: 'Open to remote roles & relocation (EU / AUS)',
    yearsExperience: 6,
    email: 'muteebmatloobm@gmail.com',
    phone: '+92 311 1080422',
    phoneHref: 'tel:+923111080422',
    website: 'https://muteeb.space',
    resumeUrl: '/Muteeb-Matloob-Resume.pdf',
    roles: [
        'Senior Software Engineer',
        'Agentic Systems Architect',
        'LLM Workflow Engineer',
        'Microservices Lead',
        'Full-Stack Engineer',
    ],
};

export const links = {
    github: 'https://github.com/muteebm',
    linkedin: 'https://www.linkedin.com/in/muteebm/',
    upwork: 'https://www.upwork.com/freelancers/~016382fb8ba7ea9971',
    email: `mailto:${profile.email}`,
    sofy: 'https://sofy.ai',
    resumeRepo: 'https://github.com/muteebm/Resume',
};

/** Headline numbers — all traceable to the resume. */
export const stats = [
    { label: 'Years engineering', value: 6, suffix: '+', note: 'Full-stack → agentic systems' },
    { label: 'Daily events on Service Bus', value: 100, suffix: 'k+', note: 'Push-based, replaced polling' },
    { label: 'Faster deployments', value: 80, suffix: '%', note: 'Monolith → microservices' },
    { label: 'Client systems delivered', value: 15, suffix: '+', note: 'As Skynners co-founder' },
];

export const experience = [
    {
        company: 'Sofy.ai',
        url: links.sofy,
        location: 'Karachi · Remote',
        summary: 'AI testing platform — autonomous agents for web, mobile, API and enterprise ERP.',
        color: '#67e8f9',
        roles: [
            {
                title: 'Senior Software Engineer – Team Lead',
                period: 'Jul 2022 → Present',
                tag: 'Current',
                bullets: [
                    'Spearheaded Sofy Web Agent — an autonomous LLM system for intelligent web task automation built with Python, LangChain and Playwright: semantic routing, dynamic tool calling and structured output parsing.',
                    'Pioneered domain-specific agents configured with deep business logic, sharply reducing hallucinations and improving decision accuracy on complex, domain-heavy tasks.',
                    'Developed and deployed an MCP server for the Web Agent so its capabilities are available to every compatible autonomous agent system.',
                    'Led the Web Agentic Framework and domain-specific agents behind Sofy\'s autonomous testing-agent launch (2026).',
                    'Architected the monolith → microservices transition (Strangler Fig, Node.js + TypeScript), improving modularity and cutting deployment time by ~80%.',
                    'Implemented Azure Service Bus event-driven messaging, replacing legacy polling with a push-based mechanism handling 100k+ daily events.',
                    'Migrated core data modules to MongoDB; established TDD workflows and code-review standards across all microservices.',
                ],
            },
            {
                title: 'Software Engineer',
                period: 'Sep 2020 → Jul 2022',
                tag: '',
                bullets: [
                    'Led the front-end migration from Angular 6 to Angular 11, improving code structure and UI performance.',
                    'Built custom UI components and integrated state management, reducing reliance on third-party libraries.',
                    'Built middleware APIs and microservices with Node.js, TypeScript and Flask, integrating MS SQL and Redis for caching and fast data retrieval.',
                    'Collaborated on sprint planning and conducted code reviews to keep quality and alignment high.',
                ],
            },
        ],
    },
    {
        company: 'Skynners (Pvt.) Ltd.',
        url: null,
        location: 'Karachi',
        summary: 'Software house I co-founded — custom systems for enterprise clients plus an in-house startup.',
        color: '#c084fc',
        roles: [
            {
                title: 'Co-Founder',
                period: '2017 → 2020',
                tag: 'Founder',
                bullets: [
                    'Architected and delivered 15+ custom software solutions for enterprise clients, owning the full SDLC from requirements to cloud deployment.',
                    'Implemented scalable, event-driven backends in Node.js and Python, deployed on AWS via Docker with 99.9% uptime.',
                    'Introduced CI/CD pipelines that cut manual deployment errors by 80% and accelerated delivery across all client projects.',
                    'Led AAB end-to-end: React Native app with 1,000+ early users in three months, Angular admin portal and a Node.js/PostgreSQL API on Supabase — pitched the architecture at regional conferences and secured seed funding.',
                ],
            },
        ],
    },
];

export const awards = [
    { name: 'IdeaCom\'19', detail: 'Winner — FAST-NUCES Karachi, with AAB' },
    { name: 'TechCup\'19', detail: 'Winner — database design competition, FAST-NUCES' },
    { name: 'DICE\'20', detail: 'Winner — DICE Shark startup competition; raised funding for AAB' },
];

export const education = {
    degree: 'B.Sc. Computer Science',
    school: 'FAST – National University of Computer and Emerging Sciences',
    shortSchool: 'FAST-NUCES',
    location: 'Karachi',
    period: '2016 – 2020',
};

/**
 * Project types (honest labels):
 *  professional — built at Sofy (private code)
 *  product      — my own shipped products (public source)
 *  founder      — Skynners / AAB era
 *  freelance    — client work
 */
export const projectTypes = {
    professional: { label: 'Professional', color: '#67e8f9' },
    product: { label: 'Product', color: '#fbbf24' },
    founder: { label: 'Founder', color: '#c084fc' },
    freelance: { label: 'Freelance', color: '#34d399' },
};

export const featured = [
    {
        id: 'sofy-web-agent',
        eyebrow: 'Sofy.ai · 2023 → 2026',
        title: 'Sofy Web Agent & Autonomous Testing Agents',
        type: 'professional',
        problem:
            'Traditional test automation breaks on every UI change. Sofy needed agents that understand intent, navigate dynamic web apps and self-heal.',
        solution:
            'Designed the agentic workflow (Python, LangChain, Playwright) with semantic routing, dynamic tool calling and structured outputs. Introduced domain-specific agents with deep business logic to cut hallucinations, and exposed the agent through an MCP server so other agent systems can call it.',
        outcome:
            'Powers Sofy\'s 2026 autonomous testing-agent launch across web, mobile and ERP flows, coordinated through a shared MCP hub.',
        stack: ['Python', 'LangChain', 'Playwright', 'MCP', 'Azure OpenAI', 'Node.js', 'TypeScript'],
        links: [{ label: 'sofy.ai', href: links.sofy, kind: 'live' }],
        accent: '#67e8f9',
        size: 'large',
    },
    {
        id: 'headroom',
        eyebrow: 'Open source · 2026',
        title: 'Headroom',
        type: 'product',
        problem: 'Windows caps volume at 100%, and Equalizer APO hides its power inside a config.txt.',
        solution:
            'A Windows tray app built with Electron + React 19: master volume via Core Audio, APO preamp past 100% with clip detection, EQ presets, per-app mixing, hotkeys, OSD and auto-updates from GitHub Releases.',
        outcome: 'Shipped as an NSIS installer with an unattended Equalizer APO first-run flow.',
        stack: ['Electron', 'React 19', 'Vite', 'Core Audio', 'Equalizer APO', 'electron-builder'],
        links: [
            { label: 'Source', href: 'https://github.com/muteebm/VolBooster', kind: 'github' },
            { label: 'Releases', href: 'https://github.com/muteebm/VolBooster/releases/latest', kind: 'live' },
        ],
        accent: '#fbbf24',
        size: 'small',
    },
    {
        id: 'why-blame',
        eyebrow: 'Open source · 2026',
        title: 'Why Blame',
        type: 'product',
        problem: 'Task Manager shows what is using your PC now — never what spiked it an hour ago.',
        solution:
            'A Windows tray utility that continuously samples CPU and RAM into SQLite (48h window), lets you brush a time range and produces a shareable report as image or markdown — including processes that already exited.',
        outcome: 'TypeScript sampler service + React UI packaged with Electron; "Blame last 15 minutes" from the tray.',
        stack: ['TypeScript', 'Electron', 'React 19', 'SQLite', 'systeminformation', 'esbuild'],
        links: [{ label: 'Source', href: 'https://github.com/muteebm/why-blame', kind: 'github' }],
        accent: '#c084fc',
        size: 'small',
    },
];

export const projects = [
    {
        id: 'microservices-migration',
        title: 'Monolith → Microservices Migration',
        type: 'professional',
        description:
            'Strangler Fig migration of Sofy\'s core platform to Node.js/TypeScript microservices — modular deploys, isolated failure domains and ~80% faster deployment cycles.',
        stack: ['Node.js', 'TypeScript', 'Azure', 'Docker', 'Strangler Fig'],
        year: '2022 → 2024',
        links: [],
    },
    {
        id: 'service-bus',
        title: 'Event-Driven Messaging on Azure Service Bus',
        type: 'professional',
        description:
            'Replaced legacy polling with push-based messaging handling 100k+ events a day, alongside a MongoDB migration of core data modules.',
        stack: ['Azure Service Bus', 'Node.js', 'MongoDB', 'Redis'],
        year: '2023',
        links: [],
    },
    {
        id: 'angular-migration',
        title: 'Angular 6 → 11 Platform Migration',
        type: 'professional',
        description:
            'Led the front-end upgrade of the Sofy web app, rebuilt custom UI components and consolidated state management to drop third-party dependencies.',
        stack: ['Angular', 'TypeScript', 'RxJS'],
        year: '2021',
        links: [],
    },
    {
        id: 'aab',
        title: 'AAB — Drinking Water Delivery',
        type: 'founder',
        description:
            'In-house startup at Skynners: React Native app (1,000+ early users in 3 months), Angular admin portal and a Node.js/PostgreSQL API on Supabase. Won IdeaCom\'19 and DICE\'20, securing seed funding.',
        stack: ['React Native', 'Angular', 'Node.js', 'PostgreSQL', 'Supabase'],
        year: '2019 → 2020',
        links: [],
    },
    {
        id: 'upwork-proposal-pro',
        title: 'Upwork Proposal Pro',
        type: 'product',
        description:
            'Gemini-powered assistant that drafts tailored Upwork proposals from a job post and your profile. React + TypeScript on Vite.',
        stack: ['React', 'TypeScript', 'Gemini API', 'Vite'],
        year: '2026',
        links: [{ label: 'Source', href: 'https://github.com/muteebm/upwork-proposal-pro', kind: 'github' }],
    },
    {
        id: 'excel-manipulator',
        title: 'Excel Manipulator',
        type: 'product',
        description:
            'Desktop tool that merges worksheets from multiple Excel workbooks into one, with tweaking and export options. Angular 11 wrapped in Electron.',
        stack: ['Angular', 'Electron', 'TypeScript'],
        year: '2021',
        links: [{ label: 'Source', href: 'https://github.com/muteebm/excel-manipulator', kind: 'github' }],
    },
    {
        id: 'queensman',
        title: 'Queensman Spades — Property Maintenance',
        type: 'freelance',
        description:
            'Three React Native interfaces (admin, ops, client) for a Dubai property-maintenance company, with Node.js APIs and AWS Amplify auth.',
        stack: ['React Native', 'Node.js', 'AWS Amplify', 'Jest'],
        year: '2019',
        links: [{ label: 'queensman.com', href: 'https://www.queensman.com', kind: 'live' }],
    },
    {
        id: 'tareekh',
        title: 'Tareekh — Venue Discovery',
        type: 'freelance',
        description:
            'Two React Native apps (venue managers and public users) for exploring and booking halls in Islamabad, shipped to Android and iOS.',
        stack: ['React Native', 'Node.js', 'AWS Amplify'],
        year: '2019',
        links: [],
    },
    {
        id: 'investment-tracker',
        title: 'Investment Tracking System',
        type: 'freelance',
        description: 'Desktop investment-tracking application for Obaid Marketing, built in Java with JavaFX.',
        stack: ['Java', 'JavaFX'],
        year: '2018',
        links: [],
    },
];

/** Stack — grouped chips with one proof line each, instead of invented percentages. */
export const stack = [
    {
        title: 'AI & Agentic Systems',
        color: '#67e8f9',
        items: ['LLMs', 'LangChain', 'MCP', 'Agentic workflows', 'Playwright', 'Prompt engineering', 'Azure OpenAI', 'Gemini API'],
        proof: 'Sofy Web Agent, domain-specific agents and an MCP server in production.',
    },
    {
        title: 'Backend & APIs',
        color: '#34d399',
        items: ['Python', 'Flask', 'Node.js', 'Express', 'TypeScript', 'REST', 'Event-driven design'],
        proof: 'Strangler Fig microservices migration; Service Bus at 100k+ events/day.',
    },
    {
        title: 'Cloud & Infrastructure',
        color: '#818cf8',
        items: ['Azure Service Bus', 'Azure App Service', 'Azure DevOps', 'AWS', 'GCP', 'Docker', 'CI/CD'],
        proof: 'AWS + Docker deployments at 99.9% uptime; CI/CD that cut deploy errors 80%.',
    },
    {
        title: 'Frontend & Desktop',
        color: '#c084fc',
        items: ['React 19', 'Angular', 'React Native', 'Electron', 'Vite', 'Tailwind CSS', 'Three.js'],
        proof: 'Angular 6→11 migration; Headroom and Why Blame desktop apps.',
    },
    {
        title: 'Data',
        color: '#fbbf24',
        items: ['PostgreSQL', 'MongoDB', 'Redis', 'MS SQL', 'SQLite', 'Supabase'],
        proof: 'MongoDB migration of core modules; Redis caching layers.',
    },
    {
        title: 'Practices',
        color: '#f87171',
        items: ['TDD', 'Jest', 'Pytest', 'Code review', 'Git', 'Jira', 'Team leadership'],
        proof: 'Established TDD and review standards across every Sofy microservice.',
    },
];

export const navSections = [
    { id: 'work', label: 'work' },
    { id: 'experience', label: 'experience' },
    { id: 'stack', label: 'stack' },
    { id: 'contact', label: 'contact' },
];
