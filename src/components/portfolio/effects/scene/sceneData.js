/**
 * sceneData — what the backdrop actually depicts.
 *
 * Every node is a real part of the systems described on the page. `group` ties
 * a node to one of the six stack categories in src/data/site.js so the Stack
 * section can regroup and recolour the scene to match the cards.
 */
import { stack } from '@/data/site';

export const GROUP_COLORS = Object.fromEntries(
    stack.map(g => [g.title, g.color])
);

export const GROUP_KEYS = {
    ai: 'AI & Agentic Systems',
    backend: 'Backend & APIs',
    cloud: 'Cloud & Infrastructure',
    frontend: 'Frontend & Desktop',
    data: 'Data',
    practices: 'Practices',
};

/** Three rings: agent layer, platform services, data + infra. */
export const RINGS = [
    {
        id: 'agents',
        radius: 3.1,
        tilt: [0.55, 0.0, 0.25],
        color: 0x67e8f9,
        speed: 0.06,
        timeline: { label: 'Sofy.ai · Team Lead · 2022 →', from: 2022, to: 2026 },
        nodes: [
            { name: 'web-agent', group: 'ai' },
            { name: 'mcp-server', group: 'ai' },
            { name: 'planner', group: 'ai' },
            { name: 'tool-router', group: 'ai' },
            { name: 'playwright', group: 'ai' },
            { name: 'domain-agent:web', group: 'ai' },
            { name: 'domain-agent:erp', group: 'ai' },
            { name: 'failure-analysis', group: 'ai' },
            { name: 'test-authoring', group: 'ai' },
            { name: 'azure-openai', group: 'cloud' },
        ],
    },
    {
        id: 'platform',
        radius: 4.4,
        tilt: [-0.35, 0.4, -0.6],
        color: 0x818cf8,
        speed: -0.04,
        timeline: { label: 'Sofy.ai · Software Engineer · 2020 – 22', from: 2020, to: 2022 },
        nodes: [
            { name: 'api-gateway', group: 'backend' },
            { name: 'test-runner', group: 'backend' },
            { name: 'scheduler', group: 'backend' },
            { name: 'service-bus', group: 'cloud' },
            { name: 'auth', group: 'backend' },
            { name: 'device-farm', group: 'cloud' },
            { name: 'reporting', group: 'backend' },
            { name: 'angular-app', group: 'frontend' },
            { name: 'react-console', group: 'frontend' },
            { name: 'webhooks', group: 'backend' },
        ],
    },
    {
        id: 'infra',
        radius: 5.8,
        tilt: [1.15, -0.2, 0.15],
        color: 0x34d399,
        speed: 0.028,
        timeline: { label: 'Skynners · Co-Founder · 2017 – 20', from: 2017, to: 2020 },
        nodes: [
            { name: 'mongodb', group: 'data' },
            { name: 'postgres', group: 'data' },
            { name: 'redis', group: 'data' },
            { name: 'mssql', group: 'data' },
            { name: 'app-service', group: 'cloud' },
            { name: 'docker', group: 'cloud' },
            { name: 'ci-cd', group: 'practices' },
            { name: 'jest · pytest', group: 'practices' },
            { name: 'code-review', group: 'practices' },
        ],
    },
];

/** How many nodes per ring to keep on each device tier. */
export const TIER_COUNTS = {
    high: [10, 10, 9],
    medium: [8, 8, 7],
    low: [6, 6, 5],
};

/** The agent's reasoning loop, drawn as three beads circling the core. */
export const LOOP_STEPS = ['observe', 'plan', 'act'];

/** Tool calls the Web Agent makes — used as pulse labels on each `act`. */
export const TOOL_CALLS = [
    'tool_call: click', 'tool_call: type', 'tool_call: read_dom', 'tool_call: navigate',
    'tool_call: assert', 'tool_call: screenshot', 'mcp: run_test', 'mcp: list_tools',
    'route: domain-agent', 'parse: structured_output', 'event: TestRun.Completed',
    'event: StepFailed', 'query: mongodb', 'cache: redis.get',
];

/** Section id (from data-active-section) → scene state. */
export const SECTION_STATE = {
    hero: 'orbit',
    about: 'orbit',
    work: 'work',
    projects: 'work',
    experience: 'timeline',
    stack: 'stack',
    contact: 'contact',
};

/** Camera framing per state. azimuth keeps accumulating with scroll on top. */
export const CAMERA = {
    orbit: { dist: 15, elev: 0.3, aim: 4.2, fov: 50 },
    // Dense sections: push the system toward the right margin, where wide screens have room.
    work: { dist: 10, elev: 0.15, aim: 5.4, fov: 56 },
    timeline: { dist: 13, elev: 0.08, aim: 6.4, fov: 52 },
    stack: { dist: 11.5, elev: 0.12, aim: 5.8, fov: 56 },
    contact: { dist: 8, elev: 0.05, aim: 4.6, fov: 60 },
};

/** Timeline: three dated circles stacked top → bottom (oldest first), beside the core. */
export const TIMELINE_LAYOUT = { radius: 1.15, gap: 2.7, shiftRight: 2.2 };

/** Stack: six clusters in a 2 × 3 grid beside the core. */
export const STACK_LAYOUT = { colGap: 2.4, rowGap: 2.5, shiftRight: 1.5, spread: 0.65 };
