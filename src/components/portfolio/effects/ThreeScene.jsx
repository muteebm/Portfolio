import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/**
 * ThreeScene — one coherent, full-viewport WebGL backdrop: an agentic system in flight.
 *
 *  · Reasoning core   — a slowly turning icosahedron with a breathing inner glow
 *                       (the LLM agent / MCP hub).
 *  · Service rings    — three tilted orbits of service nodes linked to the core
 *                       (event-driven microservices around the agent).
 *  · Message pulses   — bright packets that travel node → core → node along
 *                       curved paths (Service Bus events, tool calls).
 *  · Data field       — a wide, slowly drifting point cloud with a soft twinkle
 *                       (the data layer everything sits on).
 *  · Horizon grid     — far below, fading into fog.
 *
 * The whole system sits deep behind the content and the camera orbits it as
 * the visitor scrolls, so every section sees the system from a new angle while
 * the centre of the screen stays quiet enough to read.
 */

const CYAN = 0x67e8f9;
const VIOLET = 0xc084fc;
const INDIGO = 0x818cf8;
const EMERALD = 0x34d399;
const AMBER = 0xfbbf24;

const DATA_FIELD_VERT = /* glsl */`
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uWarp;
    attribute float aSize;
    attribute float aPhase;
    varying float vTwinkle;
    void main() {
        vec3 p = position;
        p.y += sin(uTime * 0.25 + aPhase) * 0.35;
        p.x += cos(uTime * 0.18 + aPhase * 1.7) * 0.25;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vTwinkle = (0.55 + 0.45 * sin(uTime * 1.4 + aPhase * 6.2831)) * min(uWarp, 1.6);
        gl_PointSize = min(aSize * uPixelRatio * uWarp * (95.0 / -mv.z), 16.0 * uPixelRatio);
        gl_Position = projectionMatrix * mv;
    }
`;

const DATA_FIELD_FRAG = /* glsl */`
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying float vTwinkle;
    void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d) * vTwinkle * 0.32;
        vec3 col = mix(uColorA, uColorB, vTwinkle);
        gl_FragColor = vec4(col, alpha);
    }
`;

export default function ThreeScene() {
    /** @type {import('react').MutableRefObject<HTMLDivElement|null>} */
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const probe = document.createElement('canvas');
        const hasWebGL = !!(probe.getContext('webgl') || probe.getContext('experimental-webgl'));
        if (!hasWebGL) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const tier = window.innerWidth < 480 ? 'low' : window.innerWidth < 900 ? 'medium' : 'high';
        const counts = {
            high: { field: 2600, pulses: 34, ringNodes: [14, 11, 9] },
            medium: { field: 1400, pulses: 20, ringNodes: [11, 9, 7] },
            low: { field: 700, pulses: 12, ringNodes: [9, 7, 6] },
        }[tier];

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

        // The system lives here — right of centre and deep, so hero copy stays clear.
        const system = new THREE.Group();
        system.position.set(3.2, 0.6, -2);
        scene.add(system);

        // ── Reasoning core ────────────────────────────────────────────────
        const coreOuter = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.15, 1)),
            new THREE.LineBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.45 })
        );
        const coreMid = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.72, 0)),
            new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.55 })
        );
        const coreGlow = new THREE.Mesh(
            new THREE.SphereGeometry(0.32, 24, 24),
            new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.85 })
        );
        const coreHalo = new THREE.Mesh(
            new THREE.SphereGeometry(0.62, 24, 24),
            new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false })
        );
        system.add(coreOuter, coreMid, coreGlow, coreHalo);

        // ── Service rings ─────────────────────────────────────────────────
        /** @type {{mesh: THREE.Mesh, ring: THREE.Group, base: THREE.Vector3}[]} */
        const nodes = [];
        const ringDefs = [
            { radius: 3.1, tilt: new THREE.Euler(0.55, 0.0, 0.25), color: CYAN, speed: 0.06 },
            { radius: 4.4, tilt: new THREE.Euler(-0.35, 0.4, -0.6), color: INDIGO, speed: -0.04 },
            { radius: 5.8, tilt: new THREE.Euler(1.15, -0.2, 0.15), color: EMERALD, speed: 0.028 },
        ];
        const ringGroups = ringDefs.map((def, ri) => {
            const ring = new THREE.Group();
            ring.rotation.copy(def.tilt);
            system.add(ring);

            // orbit line
            const orbitPts = [];
            for (let i = 0; i <= 128; i++) {
                const a = (i / 128) * Math.PI * 2;
                orbitPts.push(new THREE.Vector3(Math.cos(a) * def.radius, 0, Math.sin(a) * def.radius));
            }
            ring.add(new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(orbitPts),
                new THREE.LineBasicMaterial({ color: def.color, transparent: true, opacity: 0.12 })
            ));

            const n = counts.ringNodes[ri];
            const nodeGeo = ri === 0
                ? new THREE.OctahedronGeometry(0.16, 0)
                : ri === 1 ? new THREE.BoxGeometry(0.22, 0.22, 0.22) : new THREE.TetrahedronGeometry(0.18, 0);
            for (let i = 0; i < n; i++) {
                const a = (i / n) * Math.PI * 2;
                const base = new THREE.Vector3(Math.cos(a) * def.radius, 0, Math.sin(a) * def.radius);
                const mesh = new THREE.Mesh(
                    nodeGeo,
                    new THREE.MeshBasicMaterial({ color: def.color, wireframe: true, transparent: true, opacity: 0.6 })
                );
                mesh.position.copy(base);
                ring.add(mesh);
                nodes.push({ mesh, ring, base });
            }
            return { group: ring, def };
        });

        // spokes: each node → core (updated every frame since rings rotate)
        const spokePositions = new Float32Array(nodes.length * 2 * 3);
        const spokeGeo = new THREE.BufferGeometry();
        spokeGeo.setAttribute('position', new THREE.BufferAttribute(spokePositions, 3));
        const spokes = new THREE.LineSegments(
            spokeGeo,
            new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.07 })
        );
        system.add(spokes);

        // ── Message pulses ────────────────────────────────────────────────
        const pulseGeo = new THREE.SphereGeometry(0.055, 8, 8);
        const pulseColors = [CYAN, EMERALD, VIOLET, AMBER];
        const worldTmp = new THREE.Vector3();
        const coreWorld = new THREE.Vector3();

        const nodeWorld = (node, out) => node.ring.localToWorld(out.copy(node.base));

        const makeCurve = (from, to) => {
            const mid = from.clone().add(to).multiplyScalar(0.5);
            const bulge = from.clone().sub(to).length() * 0.35;
            mid.add(new THREE.Vector3((Math.random() - 0.5) * bulge, (Math.random() - 0.5) * bulge + bulge * 0.4, (Math.random() - 0.5) * bulge));
            return new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone());
        };

        /** @type {{mesh: THREE.Mesh, t: number, speed: number, curve: THREE.QuadraticBezierCurve3, toCore: boolean, node: typeof nodes[0]}[]} */
        const pulses = [];
        const spawnPulse = (p) => {
            const node = nodes[Math.floor(Math.random() * nodes.length)];
            const toCore = p ? !p.toCore : Math.random() > 0.5;
            nodeWorld(node, worldTmp);
            scene.updateMatrixWorld();
            coreGlow.getWorldPosition(coreWorld);
            const from = toCore ? worldTmp.clone() : coreWorld.clone();
            const to = toCore ? coreWorld.clone() : worldTmp.clone();
            const curve = makeCurve(from, to);
            if (p) {
                p.curve = curve; p.t = 0; p.toCore = toCore; p.node = node;
                p.speed = 0.25 + Math.random() * 0.35;
                return p;
            }
            const mesh = new THREE.Mesh(
                pulseGeo,
                new THREE.MeshBasicMaterial({ color: pulseColors[Math.floor(Math.random() * pulseColors.length)], transparent: true, opacity: 0.95 })
            );
            scene.add(mesh);
            return { mesh, t: Math.random(), speed: 0.25 + Math.random() * 0.35, curve, toCore, node };
        };
        system.updateMatrixWorld(true);
        for (let i = 0; i < counts.pulses; i++) pulses.push(spawnPulse(null));

        // ── Data field ────────────────────────────────────────────────────
        const fieldPos = new Float32Array(counts.field * 3);
        const fieldSize = new Float32Array(counts.field);
        const fieldPhase = new Float32Array(counts.field);
        for (let i = 0; i < counts.field; i++) {
            // wide, shallow disc biased away from the screen centre
            const r = 4 + Math.pow(Math.random(), 0.6) * 26;
            const a = Math.random() * Math.PI * 2;
            fieldPos[i * 3] = Math.cos(a) * r;
            fieldPos[i * 3 + 1] = (Math.random() - 0.5) * 9 - 1.5;
            fieldPos[i * 3 + 2] = Math.sin(a) * r * 0.7 - 4;
            fieldSize[i] = 0.35 + Math.random() * 1.1;
            fieldPhase[i] = Math.random();
        }
        const fieldGeo = new THREE.BufferGeometry();
        fieldGeo.setAttribute('position', new THREE.BufferAttribute(fieldPos, 3));
        fieldGeo.setAttribute('aSize', new THREE.BufferAttribute(fieldSize, 1));
        fieldGeo.setAttribute('aPhase', new THREE.BufferAttribute(fieldPhase, 1));
        const fieldMat = new THREE.ShaderMaterial({
            vertexShader: DATA_FIELD_VERT,
            fragmentShader: DATA_FIELD_FRAG,
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: renderer.getPixelRatio() },
                uWarp: { value: 1 },
                uColorA: { value: new THREE.Color(INDIGO) },
                uColorB: { value: new THREE.Color(CYAN) },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        const field = new THREE.Points(fieldGeo, fieldMat);
        scene.add(field);

        // ── Horizon grid ──────────────────────────────────────────────────
        const grid = new THREE.GridHelper(80, 40, 0x1e3a5f, 0x0f172a);
        grid.material.transparent = true;
        grid.material.opacity = 0.18;
        grid.material.depthWrite = false;
        grid.position.y = -7.5;
        scene.add(grid);

        // ── Interaction ───────────────────────────────────────────────────
        let mouseX = 0, mouseY = 0, smX = 0, smY = 0;
        const onMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', onMouseMove);

        let scrollRatio = 0;
        let velocity = 0; // smoothed scroll speed, drives the "warp" feel
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const next = max > 0 ? window.scrollY / max : 0;
            velocity += Math.abs(next - scrollRatio) * 18;
            scrollRatio = next;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
            fieldMat.uniforms.uPixelRatio.value = renderer.getPixelRatio();
        };
        window.addEventListener('resize', onResize);

        // ── Animation ─────────────────────────────────────────────────────
        const clock = new THREE.Clock();
        let animId = 0;
        let smoothScroll = 0;
        const target = new THREE.Vector3();
        const spokeArr = spokeGeo.attributes.position.array;

        const animate = () => {
            const dt = Math.min(clock.getDelta(), 0.05);
            const t = clock.elapsedTime;

            // core
            coreOuter.rotation.y += dt * 0.12;
            coreOuter.rotation.x += dt * 0.05;
            coreMid.rotation.y -= dt * 0.2;
            coreMid.rotation.z += dt * 0.08;
            const breathe = 1 + Math.sin(t * 1.3) * 0.12;
            coreGlow.scale.setScalar(breathe);
            coreHalo.scale.setScalar(1 + Math.sin(t * 1.3 + 0.6) * 0.25);
            coreHalo.material.opacity = 0.06 + Math.sin(t * 1.3) * 0.03;

            // rings + nodes
            ringGroups.forEach(({ group, def }) => { group.rotation.y += dt * def.speed; });
            nodes.forEach(({ mesh }, i) => {
                mesh.rotation.x += dt * 0.4;
                mesh.rotation.y += dt * 0.3;
                mesh.scale.setScalar(1 + Math.sin(t * 1.1 + i * 0.7) * 0.15);
            });

            // spokes follow the nodes
            scene.updateMatrixWorld();
            coreGlow.getWorldPosition(coreWorld);
            nodes.forEach((node, i) => {
                nodeWorld(node, worldTmp);
                system.worldToLocal(worldTmp);
                const o = i * 6;
                spokeArr[o] = worldTmp.x; spokeArr[o + 1] = worldTmp.y; spokeArr[o + 2] = worldTmp.z;
                spokeArr[o + 3] = 0; spokeArr[o + 4] = 0; spokeArr[o + 5] = 0;
            });
            spokeGeo.attributes.position.needsUpdate = true;

            // scroll energy: decays every frame, spikes while the reader scrolls
            velocity *= 0.9;
            const energy = Math.min(velocity, 1);

            // pulses (traffic speeds up while scrolling)
            pulses.forEach((p) => {
                p.t += dt * p.speed * (1 + energy * 3);
                if (p.t >= 1) spawnPulse(p);
                // keep the curve endpoint glued to the moving node
                nodeWorld(p.node, worldTmp);
                if (p.toCore) { p.curve.v0.copy(worldTmp); p.curve.v2.copy(coreWorld); }
                else { p.curve.v0.copy(coreWorld); p.curve.v2.copy(worldTmp); }
                p.curve.getPoint(p.t, p.mesh.position);
                const fade = Math.sin(p.t * Math.PI);
                p.mesh.scale.setScalar(0.6 + fade * 0.8);
                p.mesh.material.opacity = 0.3 + fade * 0.7;
            });

            // data field
            fieldMat.uniforms.uTime.value = t;
            fieldMat.uniforms.uWarp.value += ((1 + energy * 1.6) - fieldMat.uniforms.uWarp.value) * 0.1;
            field.rotation.y = t * 0.008 + smoothScroll * 0.6;

            // camera: fly into the system as the reader scrolls
            smoothScroll += (scrollRatio - smoothScroll) * 0.05;
            smX += (mouseX - smX) * 0.03;
            smY += (mouseY - smY) * 0.03;
            const s = smoothScroll;
            const eased = s * s * (3 - 2 * s); // smoothstep — the dive accelerates mid-page
            const azimuth = -0.3 + s * 2.6 + smX * 0.15;
            const elevation = 0.3 - eased * 0.42 - smY * 0.1;
            const dist = 15 - eased * 9.2 - energy * 0.6;
            camera.position.set(
                system.position.x + Math.sin(azimuth) * Math.cos(elevation) * dist,
                system.position.y + Math.sin(elevation) * dist + 0.6,
                system.position.z + Math.cos(azimuth) * Math.cos(elevation) * dist
            );
            // Aim left of the core so it stays in the right third; as we get close
            // the offset shrinks so the rings sweep past the camera on both sides.
            const aimOffset = 4.2 - eased * 2.4;
            target.set(system.position.x - aimOffset, system.position.y - 0.4 + eased * 0.3, system.position.z);
            camera.lookAt(target);

            // widen the lens while diving, plus a small kick while scrolling
            const fov = 50 + eased * 14 + energy * 4;
            if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }

            // glow eases off in dense text, flares briefly while scrolling
            bloomPass.strength = 0.55 - Math.min(s, 1) * 0.15 + energy * 0.25;

            composer.render();
            if (!prefersReducedMotion) animId = requestAnimationFrame(animate);
        };

        animId = requestAnimationFrame(animate);
        if (prefersReducedMotion) composer.render();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            scene.traverse((obj) => {
                /** @type {any} */
                const o = obj;
                if (o.geometry) o.geometry.dispose();
                if (o.material) {
                    if (Array.isArray(o.material)) o.material.forEach((/** @type {any} */ m) => m.dispose());
                    else o.material.dispose();
                }
            });
            composer.dispose?.();
            renderer.dispose();
            if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}
