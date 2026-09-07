import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RINGS, TIER_COUNTS, LOOP_STEPS, TOOL_CALLS, SECTION_STATE, CAMERA, GROUP_COLORS, GROUP_KEYS, TIMELINE_LAYOUT, STACK_LAYOUT } from './scene/sceneData';
import { makeLabel, setLabelText, tickLabel, fitLabels } from './scene/labels';
import { fetchGithubActivity, ageLabel } from './scene/githubActivity';

/**
 * ThreeScene — the backdrop is a model of the systems described on the page.
 *
 *  Core          the LLM agent / MCP hub, with its reasoning loop (observe → plan → act)
 *  Three rings   agents · platform services · data + infra — every node is a real component
 *  Pulses        tool calls, Service Bus events and pushes travelling between them
 *  Satellites    repos with recent public GitHub activity (live, cached 30 min)
 *
 * The scene changes state with the section being read (data-active-section):
 *  orbit     hero/about    — the whole system in motion
 *  work      case studies  — close on the core; the agent loop and labelled tool calls
 *  timeline  experience    — rings become three dated circles: Skynners → Sofy SWE → Sofy lead
 *  stack     stack         — nodes regroup into the six stack categories, coloured to match the cards
 *  contact   contact       — everything converges on the core
 *
 * Click anywhere on the page: a request leaves the cursor, the core thinks, and dispatches tool calls.
 */

const CYAN = 0x67e8f9;
const VIOLET = 0xc084fc;
const INDIGO = 0x818cf8;
const EMERALD = 0x34d399;
const AMBER = 0xfbbf24;

const FIELD_VERT = /* glsl */`
    uniform float uTime; uniform float uPixelRatio; uniform float uWarp;
    attribute float aSize; attribute float aPhase;
    varying float vTwinkle;
    void main() {
        vec3 p = position;
        p.y += sin(uTime * 0.25 + aPhase) * 0.35;
        p.x += cos(uTime * 0.18 + aPhase * 1.7) * 0.25;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vTwinkle = (0.55 + 0.45 * sin(uTime * 1.4 + aPhase * 6.2831)) * min(uWarp, 1.6);
        gl_PointSize = min(aSize * uPixelRatio * uWarp * (95.0 / -mv.z), 16.0 * uPixelRatio);
        gl_Position = projectionMatrix * mv;
    }`;
const FIELD_FRAG = /* glsl */`
    uniform vec3 uColorA; uniform vec3 uColorB;
    varying float vTwinkle;
    void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(mix(uColorA, uColorB, vTwinkle), smoothstep(0.5, 0.0, d) * vTwinkle * 0.32);
    }`;

const hexCss = (hex) => '#' + hex.toString(16).padStart(6, '0');
const damp = (dt, k) => 1 - Math.exp(-dt * k);
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function ThreeScene() {
    /** @type {import('react').MutableRefObject<HTMLDivElement|null>} */
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const probe = document.createElement('canvas');
        if (!(probe.getContext('webgl') || probe.getContext('experimental-webgl'))) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const tier = window.innerWidth < 480 ? 'low' : window.innerWidth < 900 ? 'medium' : 'high';
        const fieldCount = { high: 2600, medium: 1400, low: 700 }[tier];
        const bgPulseCount = { high: 26, medium: 16, low: 10 }[tier];
        const ringCounts = TIER_COUNTS[tier];

        // ── Renderer / scene / camera ─────────────────────────────────────
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x030712, 0.04);
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === 'high' ? 2 : 1.5));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        container.appendChild(renderer.domElement);
        Object.assign(renderer.domElement.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });

        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.45, 0.8, 0.82);
        composer.addPass(bloomPass);
        composer.addPass(new OutputPass());

        const system = new THREE.Group();
        system.position.set(3.2, 0.6, -2);
        scene.add(system);

        // ── Core ──────────────────────────────────────────────────────────
        const coreOuter = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.15, 1)),
            new THREE.LineBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.45 }));
        const coreMid = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.72, 0)),
            new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.55 }));
        const coreGlow = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24),
            new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.85 }));
        const coreHalo = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 24),
            new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false }));
        system.add(coreOuter, coreMid, coreGlow, coreHalo);
        const coreLabel = makeLabel('web-agent core · mcp hub', hexCss(CYAN), 0.046);
        coreLabel.position.set(0.9, 1.1, 0);
        system.add(coreLabel);

        // ── Agent loop beads ──────────────────────────────────────────────
        const loop = LOOP_STEPS.map((step, k) => {
            const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12),
                new THREE.MeshBasicMaterial({ color: k === 2 ? AMBER : CYAN, transparent: true, opacity: 0.9 }));
            const label = makeLabel(step, hexCss(k === 2 ? AMBER : CYAN), 0.038);
            system.add(mesh, label);
            return { mesh, label, k };
        });
        const loopRing = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(Array.from({ length: 65 }, (_, i) => {
                const a = (i / 64) * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * 1.6, 0, Math.sin(a) * 1.6);
            })),
            new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0 }));
        loopRing.rotation.set(0.9, 0, 0.3);
        system.add(loopRing);
        const loopEuler = loopRing.rotation.clone();

        // ── Rings + nodes ─────────────────────────────────────────────────
        const nodeGeos = [new THREE.OctahedronGeometry(0.16, 0), new THREE.BoxGeometry(0.22, 0.22, 0.22), new THREE.TetrahedronGeometry(0.18, 0)];
        const nodes = [];
        const ringAngles = [0, 0, 0];
        const rings = RINGS.map((def, ri) => {
            const tilt = new THREE.Euler(...def.tilt);
            const orbit = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(Array.from({ length: 129 }, (_, i) => {
                    const a = (i / 128) * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * def.radius, 0, Math.sin(a) * def.radius);
                })),
                new THREE.LineBasicMaterial({ color: def.color, transparent: true, opacity: 0.12 }));
            orbit.rotation.copy(tilt);
            system.add(orbit);

            // timeline circle for this ring (positioned every frame in the camera plane)
            const tl = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(Array.from({ length: 65 }, (_, i) => {
                    const a = (i / 64) * Math.PI * 2; return new THREE.Vector3(Math.cos(a), Math.sin(a), 0);
                })),
                new THREE.LineBasicMaterial({ color: def.color, transparent: true, opacity: 0 }));
                tl.scale.setScalar(TIMELINE_LAYOUT.radius);
            system.add(tl);
            const tlLabel = makeLabel(def.timeline.label, hexCss(def.color), 0.04, 'right');
            system.add(tlLabel);

            const n = Math.min(ringCounts[ri], def.nodes.length);
            for (let i = 0; i < n; i++) {
                const spec = def.nodes[i];
                const color = new THREE.Color(def.color);
                const mesh = new THREE.Mesh(nodeGeos[ri],
                    new THREE.MeshBasicMaterial({ color: color.clone(), wireframe: true, transparent: true, opacity: 0.6 }));
                system.add(mesh);
                const label = makeLabel(spec.name, hexCss(def.color), 0.034);
                system.add(label);
                nodes.push({
                    mesh, label, ring: ri, ringColor: color, group: spec.group, name: spec.name,
                    baseAngle: (i / n) * Math.PI * 2,
                    jitter: new THREE.Vector3(rand(-0.9, 0.9), rand(-0.7, 0.7), rand(-0.5, 0.5)),
                    shell: rand(1.6, 2.3),
                    target: new THREE.Vector3(),
                    hot: 0,
                    bright: 1,
                });
            }
            return { def, tilt, orbit, tl, tlLabel };
        });
        // start nodes on their orbits so the first frame isn't a burst from the origin
        const tmp = new THREE.Vector3();
        nodes.forEach(nd => {
            const r = RINGS[nd.ring].radius;
            tmp.set(Math.cos(nd.baseAngle) * r, 0, Math.sin(nd.baseAngle) * r).applyEuler(rings[nd.ring].tilt);
            nd.mesh.position.copy(tmp);
        });

        // stack cluster labels
        const groupKeys = Object.keys(GROUP_KEYS);
        const clusters = groupKeys.map((key) => {
            const title = GROUP_KEYS[key];
            const color = GROUP_COLORS[title] || '#67e8f9';
            const label = makeLabel(title, color, 0.04, 'center');
            system.add(label);
            return { key, color: new THREE.Color(color), label, center: new THREE.Vector3() };
        });

        // spokes node → core
        const spokeGeo = new THREE.BufferGeometry();
        spokeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nodes.length * 6), 3));
        const spokes = new THREE.LineSegments(spokeGeo, new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.07 }));
        system.add(spokes);
        const spokeArr = spokeGeo.attributes.position.array;

        // ── Pulses ────────────────────────────────────────────────────────
        const pulseGeo = new THREE.SphereGeometry(0.055, 8, 8);
        const pulseColors = [CYAN, EMERALD, VIOLET, AMBER];
        const coreWorld = new THREE.Vector3();
        const wTmp = new THREE.Vector3();
        const nodeWorld = (nd, out) => system.localToWorld(out.copy(nd.mesh.position));

        const makeCurve = (from, to) => {
            const mid = from.clone().add(to).multiplyScalar(0.5);
            const bulge = from.distanceTo(to) * 0.35;
            mid.add(new THREE.Vector3(rand(-0.5, 0.5) * bulge, rand(-0.5, 0.5) * bulge + bulge * 0.4, rand(-0.5, 0.5) * bulge));
            return new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone());
        };

        /** @type {any[]} */
        const pulses = [];
        const newPulse = (color, size = 1, labelled = false) => {
            const mesh = new THREE.Mesh(pulseGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 }));
            mesh.scale.setScalar(size);
            scene.add(mesh);
            const label = labelled ? makeLabel('', hexCss(color), 0.032) : null;
            if (label) scene.add(label);
            return { mesh, label, size, t: 0, speed: 0.3, curve: null, fromNode: null, toNode: null, toCore: false, active: false, onArrive: null };
        };
        // background traffic: node ⇄ core
        const bgPulses = Array.from({ length: bgPulseCount }, () => newPulse(pick(pulseColors)));
        const launchBg = (p, tStart = 0) => {
            const nd = pick(nodes);
            p.toCore = Math.random() > 0.5;
            p.fromNode = p.toCore ? nd : null;
            p.toNode = p.toCore ? null : nd;
            nodeWorld(nd, wTmp);
            p.curve = makeCurve(p.toCore ? wTmp : coreWorld, p.toCore ? coreWorld : wTmp);
            p.speed = rand(0.25, 0.6);
            p.t = tStart;
            p.active = true;
            p.onArrive = () => launchBg(p);
        };
        // labelled traffic pool (tool calls, requests, pushes)
        const labelled = Array.from({ length: 14 }, () => newPulse(CYAN, 1.3, true));
        pulses.push(...bgPulses, ...labelled);

        const fire = ({ from, to, toNode = null, text, color, speed = 0.55, size = 1.3, onArrive = null }) => {
            const p = labelled.find(x => !x.active) || labelled.reduce((a, b) => (a.t > b.t ? a : b));
            p.mesh.material.color.set(color);
            p.mesh.scale.setScalar(size);
            p.size = size;
            p.fromNode = null;
            p.toNode = toNode;
            p.toCore = !toNode;
            p.curve = makeCurve(from, to);
            p.speed = speed;
            p.t = 0;
            p.active = true;
            p.onArrive = onArrive;
            if (p.label) { setLabelText(p.label, text, hexCss(color)); p.label.userData.target = 0.95; p.label.material.opacity = 0; }
        };

        // ── Data field + horizon ──────────────────────────────────────────
        const fPos = new Float32Array(fieldCount * 3), fSize = new Float32Array(fieldCount), fPhase = new Float32Array(fieldCount);
        for (let i = 0; i < fieldCount; i++) {
            const r = 4 + Math.pow(Math.random(), 0.6) * 26, a = Math.random() * Math.PI * 2;
            fPos[i * 3] = Math.cos(a) * r; fPos[i * 3 + 1] = rand(-4.5, 4.5) - 1.5; fPos[i * 3 + 2] = Math.sin(a) * r * 0.7 - 4;
            fSize[i] = rand(0.35, 1.45); fPhase[i] = Math.random();
        }
        const fieldGeo = new THREE.BufferGeometry();
        fieldGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
        fieldGeo.setAttribute('aSize', new THREE.BufferAttribute(fSize, 1));
        fieldGeo.setAttribute('aPhase', new THREE.BufferAttribute(fPhase, 1));
        const fieldMat = new THREE.ShaderMaterial({
            vertexShader: FIELD_VERT, fragmentShader: FIELD_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
            uniforms: { uTime: { value: 0 }, uPixelRatio: { value: renderer.getPixelRatio() }, uWarp: { value: 1 }, uColorA: { value: new THREE.Color(INDIGO) }, uColorB: { value: new THREE.Color(CYAN) } },
        });
        const field = new THREE.Points(fieldGeo, fieldMat);
        scene.add(field);
        const grid = new THREE.GridHelper(80, 40, 0x1e3a5f, 0x0f172a);
        grid.material.transparent = true; grid.material.opacity = 0.18; grid.material.depthWrite = false;
        grid.position.y = -7.5;
        scene.add(grid);

        // ── Live GitHub satellites ────────────────────────────────────────
        /** @type {{mesh: THREE.Mesh, label: THREE.Sprite, line: THREE.Line, repo: string, fresh: number}[]} */
        const satellites = [];
        let disposed = false;
        fetchGithubActivity('muteebm', 5).then((repos) => {
            if (disposed || !repos.length) return;
            repos.forEach((r, i) => {
                const ageDays = (Date.now() - r.lastAt) / 8.64e7;
                const fresh = THREE.MathUtils.clamp(1 - ageDays / 30, 0.15, 1);
                const a = 0.35 + i * (Math.PI * 1.25 / Math.max(1, repos.length - 1));
                // beyond the outer ring, kept low so labels never sit under the navbar
                const pos = new THREE.Vector3(Math.cos(a) * 7.6, -1.2 + Math.sin(a * 2.1) * 1.2, Math.sin(a) * 7.6);
                const color = fresh > 0.6 ? CYAN : fresh > 0.3 ? INDIGO : 0x64748b;
                const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12),
                    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4 + fresh * 0.6 }));
                mesh.position.copy(pos);
                const label = makeLabel(`${r.repo} · ${ageLabel(r.lastAt)} · ${r.count} commit${r.count === 1 ? '' : 's'}`, hexCss(color), 0.036);
                label.position.copy(pos).add(new THREE.Vector3(0.22, 0.14, 0));
                const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([pos, new THREE.Vector3()]),
                    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.05 + fresh * 0.08 }));
                system.add(mesh, label, line);
                satellites.push({ mesh, label, line, repo: r.repo, fresh });
            });
        });
        let nextPush = 4;

        // ── Interaction ───────────────────────────────────────────────────
        let mouseX = 0, mouseY = 0, smX = 0, smY = 0;
        const onMouseMove = (e) => { mouseX = (e.clientX / window.innerWidth - 0.5) * 2; mouseY = (e.clientY / window.innerHeight - 0.5) * 2; };
        window.addEventListener('mousemove', onMouseMove);

        let scrollRatio = 0, velocity = 0;
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const next = max > 0 ? window.scrollY / max : 0;
            velocity += Math.abs(next - scrollRatio) * 18;
            scrollRatio = next;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight); composer.setSize(window.innerWidth, window.innerHeight);
            fieldMat.uniforms.uPixelRatio.value = renderer.getPixelRatio();
            fitLabels(scene, camera.aspect);
        };
        window.addEventListener('resize', onResize);

        // click anywhere on the content → a request travels from the cursor to the core
        const raycaster = new THREE.Raycaster();
        const plane = new THREE.Plane();
        const camForward = new THREE.Vector3();
        let flash = 0, loopBoost = 0, requestUntil = 0;
        const onClick = (e) => {
            const el = /** @type {HTMLElement} */ (e.target);
            if (!el || !el.closest || !el.closest('main') || el.closest('a,button,input,textarea,select,label,[role="button"],[data-no-scene]')) return;
            camera.getWorldDirection(camForward);
            plane.setFromNormalAndCoplanarPoint(camForward, coreWorld);
            raycaster.setFromCamera(new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1), camera);
            const hit = new THREE.Vector3();
            if (!raycaster.ray.intersectPlane(plane, hit)) return;
            requestUntil = clock.elapsedTime + 4;
            fire({
                from: hit, to: coreWorld, text: 'request', color: 0xffffff, speed: 0.9, size: 1.7,
                onArrive: () => {
                    flash = 1; loopBoost = 1;
                    const targets = [...nodes].sort(() => Math.random() - 0.5).slice(0, 3);
                    targets.forEach((nd, i) => setTimeout(() => {
                        if (disposed) return;
                        nodeWorld(nd, wTmp);
                        fire({ from: coreWorld, to: wTmp, toNode: nd, text: pick(TOOL_CALLS), color: i === 0 ? AMBER : CYAN, speed: 0.7, onArrive: () => { nd.hot = 1; } });
                    }, 220 + i * 260));
                },
            });
        };
        window.addEventListener('click', onClick);

        // ── Per-frame state ───────────────────────────────────────────────
        const clock = new THREE.Clock();
        let animId = 0, smoothScroll = 0;
        let state = 'orbit';
        const cam = { ...CAMERA.orbit };
        const camRight = new THREE.Vector3(1, 0, 0), camUp = new THREE.Vector3(0, 1, 0);
        const target = new THREE.Vector3();
        const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3();
        const colTmp = new THREE.Color();
        const WHITE = new THREE.Color(0xffffff);
        let loopStep = -1, expProgress = 0, coreScale = 1;
        const tlSlot = [1, 0, -1]; // ring index → vertical slot (agents bottom, infra/Skynners top)
        const tlCenter = (ri, out) => out.copy(camRight).multiplyScalar(TIMELINE_LAYOUT.shiftRight)
            .addScaledVector(camUp, tlSlot[ri] * -TIMELINE_LAYOUT.gap);
        const expEl = () => document.getElementById('experience');

        const readSection = () => {
            const id = document.documentElement.getAttribute('data-active-section') || 'hero';
            state = SECTION_STATE[id] || 'orbit';
            if (state === 'timeline') {
                const r = expEl()?.getBoundingClientRect();
                if (r) expProgress = THREE.MathUtils.clamp((window.innerHeight * 0.5 - r.top) / r.height, 0, 1);
            }
        };

        const animate = () => {
            const dt = Math.min(clock.getDelta(), 0.05);
            const t = clock.elapsedTime;
            readSection();
            velocity *= 0.9;
            const energy = Math.min(velocity, 1);
            flash = Math.max(0, flash - dt * 1.6);
            loopBoost = Math.max(0, loopBoost - dt * 0.5);
            const isWork = state === 'work';
            const requesting = t < requestUntil;

            // camera basis from the previous frame (stable enough for layout)
            camera.matrixWorld.extractBasis(camRight, camUp, camForward);
            scene.updateMatrixWorld();
            coreGlow.getWorldPosition(coreWorld);

            // ── core (shrinks to a hub while the rings are laid out as diagrams) ──
            const compact = state === 'timeline' || state === 'stack';
            coreScale += ((compact ? 0.45 : 1) - coreScale) * damp(dt, 3);
            coreOuter.scale.setScalar(coreScale); coreMid.scale.setScalar(coreScale);
            coreOuter.rotation.y += dt * (0.12 + loopBoost * 0.6);
            coreOuter.rotation.x += dt * 0.05;
            coreMid.rotation.y -= dt * (0.2 + loopBoost * 1.2);
            coreMid.rotation.z += dt * 0.08;
            coreGlow.scale.setScalar((1 + Math.sin(t * 1.3) * 0.12 + flash * 0.7) * coreScale);
            coreHalo.scale.setScalar((1 + Math.sin(t * 1.3 + 0.6) * 0.25 + flash * 1.2) * coreScale);
            coreHalo.material.opacity = 0.06 + Math.sin(t * 1.3) * 0.03 + flash * 0.3;
            coreLabel.userData.target = isWork || requesting ? 0.9 : 0;

            // ── agent loop ──
            const stepNow = Math.floor(t / 1.1) % 3;
            const showLoop = isWork || requesting || state === 'contact';
            loopRing.material.opacity += ((showLoop ? 0.35 : 0) - loopRing.material.opacity) * damp(dt, 4);
            if (stepNow !== loopStep) {
                loopStep = stepNow;
                if (LOOP_STEPS[stepNow] === 'act' && (isWork || requesting)) {
                    const count = requesting ? 3 : 2;
                    [...nodes].sort(() => Math.random() - 0.5).slice(0, count).forEach((nd) => {
                        nodeWorld(nd, wTmp);
                        fire({ from: coreWorld, to: wTmp, toNode: nd, text: pick(TOOL_CALLS), color: nd.ring === 0 ? CYAN : EMERALD, speed: rand(0.5, 0.75), onArrive: () => { nd.hot = 1; } });
                    });
                }
            }
            loop.forEach(({ mesh, label, k }) => {
                const a = t * (0.9 + loopBoost * 1.5) + (k / 3) * Math.PI * 2;
                v1.set(Math.cos(a) * 1.6, 0, Math.sin(a) * 1.6).applyEuler(loopEuler);
                mesh.position.copy(v1);
                const active = k === stepNow;
                mesh.scale.setScalar(active ? 1.7 : 1);
                mesh.material.opacity = showLoop ? (active ? 1 : 0.55) : 0;
                label.position.copy(v1).add(v2.set(0.16, 0.1, 0));
                label.userData.target = showLoop ? (active ? 1 : 0.45) : 0;
            });

            // ── rings / nodes ──
            RINGS.forEach((def, ri) => { ringAngles[ri] += dt * def.speed; });
            const camDistToCore = camera.position.distanceTo(coreWorld);
            rings.forEach(({ orbit, tl, tlLabel }, ri) => {
                const orbitVis = state === 'orbit' || state === 'work' ? 0.12 : 0;
                orbit.material.opacity += (orbitVis - orbit.material.opacity) * damp(dt, 3);
                // timeline circle: stacked vertically, oldest on top
                tlCenter(ri, v1);
                tl.position.copy(v1);
                tl.quaternion.copy(camera.quaternion);
                const active = state === 'timeline' && ((ri < 2) === (expProgress < 0.55));
                tl.material.opacity += ((state === 'timeline' ? (active ? 0.55 : 0.16) : 0) - tl.material.opacity) * damp(dt, 3);
                tlLabel.position.copy(v1).addScaledVector(camRight, -(TIMELINE_LAYOUT.radius + 0.2)).addScaledVector(camUp, 0.05);
                tlLabel.userData.target = state === 'timeline' ? (active ? 0.95 : 0.4) : 0;
            });
            // cluster centres: 2 columns × 3 rows in the camera plane
            clusters.forEach((c, i) => {
                const col = i % 2, row = Math.floor(i / 2);
                c.center.copy(camRight).multiplyScalar(STACK_LAYOUT.shiftRight + (col - 0.5) * STACK_LAYOUT.colGap)
                    .addScaledVector(camUp, (1 - row) * STACK_LAYOUT.rowGap);
                c.label.position.copy(c.center).addScaledVector(camUp, -0.95);
                c.label.userData.target = state === 'stack' ? 0.95 : 0;
            });

            nodes.forEach((nd, i) => {
                const def = RINGS[nd.ring];
                const ring = rings[nd.ring];
                const a = nd.baseAngle + ringAngles[nd.ring];
                let bright = 1;
                if (state === 'timeline') {
                    const b = nd.baseAngle + ringAngles[nd.ring] * 0.6;
                    tlCenter(nd.ring, nd.target)
                        .addScaledVector(camRight, Math.cos(b) * TIMELINE_LAYOUT.radius)
                        .addScaledVector(camUp, Math.sin(b) * TIMELINE_LAYOUT.radius);
                    bright = ((nd.ring < 2) === (expProgress < 0.55)) ? 1 : 0.3;
                } else if (state === 'stack') {
                    const c = clusters.find(x => x.key === nd.group) || clusters[0];
                    nd.target.copy(c.center)
                        .addScaledVector(camRight, nd.jitter.x * STACK_LAYOUT.spread)
                        .addScaledVector(camUp, nd.jitter.y * STACK_LAYOUT.spread)
                        .addScaledVector(camForward, nd.jitter.z * 0.4);
                } else if (state === 'contact') {
                    nd.target.set(Math.cos(a * 1.3) * nd.shell, Math.sin(a * 0.7) * nd.shell * 0.6, Math.sin(a * 1.3) * nd.shell);
                } else {
                    nd.target.set(Math.cos(a) * def.radius, 0, Math.sin(a) * def.radius).applyEuler(ring.tilt);
                }
                nd.mesh.position.lerp(nd.target, damp(dt, 2.6));
                nd.mesh.rotation.x += dt * 0.4; nd.mesh.rotation.y += dt * 0.3;
                nd.hot = Math.max(0, nd.hot - dt * 0.7);
                nd.bright += (bright - nd.bright) * damp(dt, 4);
                nd.mesh.scale.setScalar((1 + Math.sin(t * 1.1 + i * 0.7) * 0.15) * (1 + nd.hot * 0.9));
                nd.mesh.material.opacity = (0.35 + 0.35 * nd.bright) + nd.hot * 0.3;
                // colour: stack groups vs ring identity
                const c = state === 'stack' ? (clusters.find(x => x.key === nd.group)?.color || nd.ringColor) : nd.ringColor;
                colTmp.copy(nd.mesh.material.color).lerp(c, damp(dt, 3));
                if (nd.hot > 0) colTmp.lerp(WHITE, nd.hot * 0.5);
                nd.mesh.material.color.copy(colTmp);
                // label
                nd.label.position.copy(nd.mesh.position).add(v2.set(0.2, 0.08, 0));
                const near = camDistToCore < 7.5 && camera.position.distanceTo(system.localToWorld(v1.copy(nd.mesh.position))) < 6.5;
                const show = tier !== 'low' && (nd.hot > 0.15 || (isWork && nd.ring === 0) || (state === 'orbit' && near) || (state === 'stack' && nd.jitter.x > 0.55));
                nd.label.userData.target = show ? 0.85 : 0;
                // spokes
                const o = i * 6;
                spokeArr[o] = nd.mesh.position.x; spokeArr[o + 1] = nd.mesh.position.y; spokeArr[o + 2] = nd.mesh.position.z;
                spokeArr[o + 3] = 0; spokeArr[o + 4] = 0; spokeArr[o + 5] = 0;
            });
            spokeGeo.attributes.position.needsUpdate = true;
            spokes.material.opacity += ((state === 'stack' || state === 'timeline' ? 0.03 : 0.07) - spokes.material.opacity) * damp(dt, 3);

            // ── satellites → occasional push into the core ──
            if (satellites.length && t > nextPush && (state === 'orbit' || state === 'work')) {
                nextPush = t + rand(5, 9);
                const s = pick(satellites);
                system.localToWorld(wTmp.copy(s.mesh.position));
                fire({ from: wTmp, to: coreWorld, text: `push: ${s.repo}`, color: EMERALD, speed: 0.45, onArrive: () => { flash = Math.max(flash, 0.5); } });
            }
            satellites.forEach((s) => {
                s.label.userData.target = tier !== 'low' && (state === 'orbit' || state === 'work') ? 0.85 : 0;
                s.mesh.material.opacity = (0.4 + s.fresh * 0.6) * (state === 'orbit' || state === 'work' ? 1 : 0.35);
                s.mesh.scale.setScalar(1 + Math.sin(t * 2 + s.fresh * 5) * 0.2 * s.fresh);
            });

            // ── pulses ──
            pulses.forEach((p) => {
                if (!p.active) { p.mesh.visible = false; if (p.label) p.label.userData.target = 0; return; }
                p.mesh.visible = true;
                p.t += dt * p.speed * (1 + energy * 3);
                if (p.fromNode) { nodeWorld(p.fromNode, wTmp); p.curve.v0.copy(wTmp); }
                if (p.toCore) p.curve.v2.copy(coreWorld);
                else if (p.toNode) { nodeWorld(p.toNode, wTmp); p.curve.v2.copy(wTmp); }
                if (p.t >= 1) {
                    p.active = false;
                    const cb = p.onArrive; p.onArrive = null;
                    if (cb) cb();
                    return;
                }
                p.curve.getPoint(p.t, p.mesh.position);
                const fade = Math.sin(p.t * Math.PI);
                p.mesh.scale.setScalar(p.size * (0.6 + fade * 0.8));
                p.mesh.material.opacity = 0.3 + fade * 0.7;
                if (p.label) { p.label.position.copy(p.mesh.position).add(v2.set(0.14, 0.12, 0)); p.label.userData.target = 0.95 * Math.min(1, fade * 2); }
            });

            // ── labels ──
            let labelsVisibleCount = 0;
            scene.traverse((o) => { if (o.isSprite) { tickLabel(o, dt); if (o.visible && o.material.opacity > 0.4) labelsVisibleCount++; } });

            // ── field ──
            fieldMat.uniforms.uTime.value = t;
            fieldMat.uniforms.uWarp.value += ((1 + energy * 1.6) - fieldMat.uniforms.uWarp.value) * 0.1;
            field.rotation.y = t * 0.008 + smoothScroll * 0.6;

            // ── camera ──
            smoothScroll += (scrollRatio - smoothScroll) * 0.05;
            smX += (mouseX - smX) * 0.03; smY += (mouseY - smY) * 0.03;
            const want = CAMERA[state];
            const k = damp(dt, 1.8);
            cam.dist += (want.dist - cam.dist) * k; cam.elev += (want.elev - cam.elev) * k;
            cam.aim += (want.aim - cam.aim) * k; cam.fov += (want.fov - cam.fov) * k;
            const azimuth = -0.3 + smoothScroll * 2.6 + smX * 0.15;
            const elevation = cam.elev - smY * 0.1;
            const dist = cam.dist - energy * 0.6;
            camera.position.set(
                system.position.x + Math.sin(azimuth) * Math.cos(elevation) * dist,
                system.position.y + Math.sin(elevation) * dist + 0.6,
                system.position.z + Math.cos(azimuth) * Math.cos(elevation) * dist);
            target.copy(system.position).addScaledVector(camRight, -cam.aim).add(v2.set(0, -0.3, 0));
            camera.lookAt(target);
            const fov = cam.fov + energy * 4;
            if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
            bloomPass.strength = 0.5 - Math.min(smoothScroll, 1) * 0.12 + energy * 0.25 + flash * 0.35;

            composer.render();
            if (import.meta.env.DEV) {
                v1.copy(coreWorld).project(camera);
                window.__sceneDebug = { state, core: { x: (v1.x + 1) / 2, y: (1 - v1.y) / 2 }, satellites: satellites.length, labelsVisible: labelsVisibleCount };
            }
            if (!prefersReducedMotion) animId = requestAnimationFrame(animate);
        };

        // prime background traffic and go
        scene.updateMatrixWorld(true);
        coreGlow.getWorldPosition(coreWorld);
        bgPulses.forEach(p => launchBg(p, Math.random()));
        animId = requestAnimationFrame(animate);
        if (prefersReducedMotion) composer.render();

        return () => {
            disposed = true;
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('click', onClick);
            scene.traverse((obj) => {
                /** @type {any} */ const o = obj;
                if (o.geometry) o.geometry.dispose();
                if (o.material) {
                    const mats = Array.isArray(o.material) ? o.material : [o.material];
                    mats.forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
                }
            });
            composer.dispose?.();
            renderer.dispose();
            if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}
