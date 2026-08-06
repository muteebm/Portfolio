import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/**
 * ThreeScene — Full-screen WebGL background representing the developer's stack.
 *
 * Elements (all distributed toward screen edges so the center stays readable):
 *  ─ Left       → Microservices Mesh (Node.js/TypeScript architecture)
 *  ─ Right      → LLM Neural Flow (LangChain agentic workflows)
 *  ─ Top-Left   → Cloud Server Stack (Azure/AWS/GCP)
 *  ─ Top-Right  → Message Queue (Azure Service Bus event pulses)
 *  ─ Bottom-Left→ Database (PostgreSQL/MongoDB/Redis)
 *  ─ Bottom-Right→ Container (Docker/CI-CD)
 *  ─ Bottom     → Perspective grid floor
 *  ─ Edges      → Faint text labels
 */
export default function ThreeScene() {
    /** @type {import('react').MutableRefObject<HTMLDivElement|null>} */
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const canvasEl = document.createElement('canvas');
        const hasWebGL = !!(canvasEl.getContext('webgl') || canvasEl.getContext('experimental-webgl'));
        if (!hasWebGL) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const performanceTier = (() => {
            const w = window.innerWidth;
            if (w < 480) return 'low';
            if (w < 900) return 'medium';
            return 'high';
        })();

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x030712, performanceTier === 'high' ? 0.004 : 0.008);

        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2.4, 9.5);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, performanceTier === 'high' ? 2 : 1.5));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        container.appendChild(renderer.domElement);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.inset = '0';
        renderer.domElement.style.pointerEvents = 'none';

        // ---- Post-processing ----
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.25,
            0.6,
            0.8
        );
        composer.addPass(bloomPass);
        composer.addPass(new OutputPass());

        // ---- Lights ----
        const ambient = new THREE.AmbientLight(0x334155, 0.45);
        scene.add(ambient);
        const dirLight = new THREE.DirectionalLight(0x67e8f9, 1.0);
        dirLight.position.set(5, 8, 4);
        scene.add(dirLight);
        const pointLight = new THREE.PointLight(0xc084fc, 1.2, 20);
        pointLight.position.set(-4, -2, 3);
        scene.add(pointLight);

        /** Helper to make a faint edge label sprite */
        const makeLabel = (text, x, y, z, color) => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 96;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.font = '26px "Courier New", monospace';
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 256, 48);
            const tex = new THREE.CanvasTexture(canvas);
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
            sprite.position.set(x, y, z);
            sprite.scale.set(3.2, 0.6, 1);
            scene.add(sprite);
        };

        // ─────────────────────────────────────────────
        //  LEFT: Microservices mesh (Node.js / TypeScript)
        // ─────────────────────────────────────────────
        const meshGroup = new THREE.Group();
        scene.add(meshGroup);
        const meshPositions = [
            [-5.1, 1.4, 0.5], [-4.2, 1.9, -0.6], [-3.6, 0.6, 0.8],
            [-4.9, 0.3, -0.8], [-3.8, -0.5, 0.2], [-5.4, -0.8, 0.9],
            [-4.3, -1.4, -0.3],
        ];
        const meshNodes = [];
        meshPositions.forEach((p, i) => {
            const geo = new THREE.OctahedronGeometry(0.14, 0);
            const mat = new THREE.MeshBasicMaterial({
                color: i === 0 ? 0x67e8f9 : 0x0891b2,
                wireframe: i !== 0,
                transparent: true,
                opacity: i === 0 ? 0.9 : 0.5,
            });
            const node = new THREE.Mesh(geo, mat);
            node.position.set(p[0], p[1], p[2]);
            meshGroup.add(node);
            meshNodes.push(node);
        });
        for (let i = 0; i < meshPositions.length - 1; i++) {
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(meshPositions[i][0], meshPositions[i][1], meshPositions[i][2]),
                new THREE.Vector3(meshPositions[i + 1][0], meshPositions[i + 1][1], meshPositions[i + 1][2]),
            ]);
            const line = new THREE.Line(
                lineGeo,
                new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.15 })
            );
            meshGroup.add(line);
        }
        makeLabel('microservices — node / ts', -4.6, -2.2, 0.3, 'rgba(103,232,249,0.35)');

        // ─────────────────────────────────────────────
        //  RIGHT: LLM neural flow (LangChain / agents)
        // ─────────────────────────────────────────────
        const llmGroup = new THREE.Group();
        scene.add(llmGroup);
        const nodesPerLayer = 4;
        const inputPositions = [];
        const hiddenPositions = [];
        const outputPositions = [];
        for (let i = 0; i < nodesPerLayer; i++) inputPositions.push(new THREE.Vector3(3.5, 1.6 - i * 0.55, -0.4));
        for (let i = 0; i < nodesPerLayer; i++) hiddenPositions.push(new THREE.Vector3(4.7, 1.6 - i * 0.55, 0.4));
        for (let i = 0; i < nodesPerLayer; i++) outputPositions.push(new THREE.Vector3(5.9, 1.6 - i * 0.55, -0.4));
        const llmNodes = [];
        [inputPositions, hiddenPositions, outputPositions].forEach((layer, layerIdx) => {
            layer.forEach((p, i) => {
                const geo = new THREE.SphereGeometry(0.09, 10, 10);
                const mat = new THREE.MeshBasicMaterial({
                    color: layerIdx === 2 ? 0xc084fc : 0x67e8f9,
                    transparent: true,
                    opacity: layerIdx === 2 ? 0.9 : 0.6,
                });
                const node = new THREE.Mesh(geo, mat);
                node.position.copy(p);
                llmGroup.add(node);
                llmNodes.push({ mesh: node, layer: layerIdx });
            });
        });
        for (let i = 0; i < nodesPerLayer; i++) {
            for (let j = 0; j < nodesPerLayer; j++) {
                const lineGeo = new THREE.BufferGeometry().setFromPoints([inputPositions[i], hiddenPositions[j]]);
                llmGroup.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.08 })));
            }
        }
        for (let i = 0; i < nodesPerLayer; i++) {
            for (let j = 0; j < nodesPerLayer; j++) {
                const lineGeo = new THREE.BufferGeometry().setFromPoints([hiddenPositions[i], outputPositions[j]]);
                llmGroup.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.08 })));
            }
        }
        const tokenGeo = new THREE.SphereGeometry(0.035, 8, 8);
        const tokenMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.9 });
        const tokens = [];
        for (let t = 0; t < 6; t++) {
            const tok = new THREE.Mesh(tokenGeo, tokenMat);
            llmGroup.add(tok);
            tokens.push({
                mesh: tok,
                phase: (t / 6) * Math.PI * 2,
                path: Math.floor(Math.random() * nodesPerLayer),
            });
        }
        makeLabel('llm / langchain agents', 4.7, -1.2, 0.4, 'rgba(192,132,252,0.35)');

        // ─────────────────────────────────────────────
        //  TOP-LEFT: Cloud server stack (Azure / AWS)
        // ─────────────────────────────────────────────
        const cloudGroup = new THREE.Group();
        scene.add(cloudGroup);
        {
            const boxGeo = new THREE.IcosahedronGeometry(0.75, 0);
            const boxWire = new THREE.LineSegments(
                new THREE.WireframeGeometry(boxGeo),
                new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.35 })
            );
            boxWire.position.set(-5.6, 3.1, -1.6);
            cloudGroup.add(boxWire);
        }
        for (let s = 0; s < 3; s++) {
            const rackGeo = new THREE.BoxGeometry(0.55, 0.18, 0.45);
            const rackWire = new THREE.LineSegments(
                new THREE.WireframeGeometry(rackGeo),
                new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.25 })
            );
            rackWire.position.set(-4.3, 3.0 - s * 0.3, -0.9);
            cloudGroup.add(rackWire);
        }
        makeLabel('azure / aws cloud', -5, 1.7, -1.2, 'rgba(129,140,248,0.35)');

        // ─────────────────────────────────────────────
        //  TOP-RIGHT: Message queue (Azure Service Bus)
        // ─────────────────────────────────────────────
        const mqGroup = new THREE.Group();
        scene.add(mqGroup);
        const mqStart = new THREE.Vector3(4.2, 3.2, -1.3);
        const mqEnd = new THREE.Vector3(5.8, 2.6, -0.6);
        {
            const a = new THREE.Mesh(
                new THREE.SphereGeometry(0.13, 10, 10),
                new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.8 })
            );
            a.position.copy(mqStart);
            mqGroup.add(a);
            const b = new THREE.Mesh(
                new THREE.SphereGeometry(0.13, 10, 10),
                new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.8 })
            );
            b.position.copy(mqEnd);
            mqGroup.add(b);
        }
        const mqArcPts = [];
        for (let i = 0; i <= 40; i++) {
            const tt = i / 40;
            const inv = 1 - tt;
            const cx = (mqStart.x + mqEnd.x) / 2 + 0.4;
            const cy = (mqStart.y + mqEnd.y) / 2 + 0.5;
            const cz = (mqStart.z + mqEnd.z) / 2;
            mqArcPts.push(new THREE.Vector3(
                inv * inv * mqStart.x + 2 * inv * tt * cx + tt * tt * mqEnd.x,
                inv * inv * mqStart.y + 2 * inv * tt * cy + tt * tt * mqEnd.y,
                inv * inv * mqStart.z + 2 * inv * tt * cz + tt * tt * mqEnd.z
            ));
        }
        {
            const arcGeo = new THREE.BufferGeometry().setFromPoints(mqArcPts);
            mqGroup.add(new THREE.Line(arcGeo, new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.25 })));
        }
        const eventPulses = [];
        for (let p = 0; p < 4; p++) {
            const pulse = new THREE.Mesh(
                new THREE.SphereGeometry(0.05, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.95 })
            );
            mqGroup.add(pulse);
            eventPulses.push({ mesh: pulse, phase: p / 4 });
        }
        makeLabel('azure service bus — events', 5, 1.5, -1, 'rgba(52,211,153,0.35)');

        // ─────────────────────────────────────────────
        //  BOTTOM-LEFT: Database (PostgreSQL / Mongo / Redis)
        // ─────────────────────────────────────────────
        const dbGroup = new THREE.Group();
        scene.add(dbGroup);
        {
            const cylGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.9, 16, 1, true);
            const cylWire = new THREE.LineSegments(
                new THREE.WireframeGeometry(cylGeo),
                new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.3 })
            );
            cylWire.position.set(-5.1, -2.7, 0.6);
            dbGroup.add(cylWire);
            const capGeo = new THREE.CircleGeometry(0.55, 16);
            const capWire = new THREE.LineSegments(
                new THREE.WireframeGeometry(capGeo),
                new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.4 })
            );
            capWire.position.set(-5.1, -2.25, 0.6);
            capWire.rotation.x = -Math.PI / 2;
            dbGroup.add(capWire);
            const capWire2 = capWire.clone();
            capWire2.position.y = -3.15;
            dbGroup.add(capWire2);
        }
        makeLabel('postgres / mongo / redis', -5.1, -4.1, 1, 'rgba(251,191,36,0.35)');

        // ─────────────────────────────────────────────
        //  BOTTOM-RIGHT: Container (Docker / CI-CD)
        // ─────────────────────────────────────────────
        const dockerGroup = new THREE.Group();
        scene.add(dockerGroup);
        {
            const boxGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
            const boxWire = new THREE.LineSegments(
                new THREE.WireframeGeometry(boxGeo),
                new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
            );
            boxWire.position.set(5.2, -2.7, 0.6);
            dockerGroup.add(boxWire);
            const inner = new THREE.Mesh(
                new THREE.SphereGeometry(0.18, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.7 })
            );
            inner.position.set(5.2, -2.7, 0.6);
            dockerGroup.add(inner);
        }
        makeLabel('docker — ci/cd', 5.2, -4.1, 1, 'rgba(56,189,248,0.35)');

        // ─────────────────────────────────────────────
        //  Ambient particles — spread wide to edges
        // ─────────────────────────────────────────────
        const particleCount = performanceTier === 'high' ? 220 : performanceTier === 'medium' ? 120 : 60;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const colorCyan = new THREE.Color(0x67e8f9);
        const colorViolet = new THREE.Color(0xc084fc);
        const colorIndigo = new THREE.Color(0x818cf8);
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() * 2 - 1) * 14;
            positions[i * 3 + 1] = (Math.random() * 2 - 1) * 9;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
            const c = [colorCyan, colorViolet, colorIndigo][Math.floor(Math.random() * 3)];
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const pMat = new THREE.PointsMaterial({
            size: 0.035,
            vertexColors: true,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const stars = new THREE.Points(pGeo, pMat);
        scene.add(stars);

        // ─────────────────────────────────────────────
        //  Perspective grid floor
        // ─────────────────────────────────────────────
        const grid = new THREE.GridHelper(30, 30, 0x67e8f9, 0x1e293b);
        grid.material.transparent = true;
        grid.material.opacity = 0.08;
        grid.position.y = -3.4;
        scene.add(grid);

        // ─────────────────────────────────────────────
        //  Interaction state
        // ─────────────────────────────────────────────
        let mouseX = 0, mouseY = 0;
        let targetRotX = 0, targetRotY = 0;
        /** @param {MouseEvent} e */
        const onMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', onMouseMove);

        let scrollOffset = 0;
        const onScroll = () => {
            scrollOffset = window.scrollY;
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);

        // ─────────────────────────────────────────────
        //  Animation loop
        // ─────────────────────────────────────────────
        const clock = new THREE.Clock();
        /** @type {number} */
        let animId = 0;
        const animate = () => {
            const dt = clock.getDelta();
            const t = clock.elapsedTime;

            // Microservices — breathing + leader pulse
            meshNodes.forEach((node, i) => {
                node.rotation.x += dt * 0.3;
                node.rotation.y += dt * 0.2;
                if (i === 0) node.scale.setScalar(1 + Math.sin(t * 1.6) * 0.2);
            });

            // LLM tokens flow input → hidden → output
            tokens.forEach((tok) => {
                const progress = (t * 0.18 + tok.phase) % 1;
                const layerPath = tok.path;
                let pos = null;
                if (progress < 0.45) {
                    pos = inputPositions[layerPath].clone().lerp(hiddenPositions[layerPath], progress / 0.45);
                } else if (progress < 0.85) {
                    pos = hiddenPositions[layerPath].clone().lerp(outputPositions[layerPath], (progress - 0.45) / 0.4);
                }
                if (pos) {
                    tok.mesh.position.copy(pos);
                    tok.mesh.visible = true;
                } else {
                    tok.mesh.visible = false;
                }
            });
            llmNodes.forEach((n, i) => {
                n.mesh.scale.setScalar(1 + Math.sin(t * 1.2 + i * 0.4) * 0.15);
            });

            // Cloud — slow counter-rotation
            cloudGroup.children.forEach((c, i) => {
                c.rotation.y += dt * 0.12 * (i % 2 === 0 ? 1 : -1);
            });

            // Message queue — pulses along the arc
            eventPulses.forEach((pulse) => {
                const progress = (t * 0.25 + pulse.phase) % 1;
                const idx = Math.floor(progress * (mqArcPts.length - 1));
                const frac = progress * (mqArcPts.length - 1) - idx;
                const p0 = mqArcPts[idx];
                const p1 = mqArcPts[Math.min(idx + 1, mqArcPts.length - 1)];
                pulse.mesh.position.lerpVectors(p0, p1, frac);
                pulse.mesh.scale.setScalar(1 + Math.sin(t * 3) * 0.2);
            });

            // Database — slow rotation
            dbGroup.children.forEach((c) => {
                c.rotation.y += dt * 0.25;
            });

            // Container — rotation + inner pulse
            dockerGroup.children.forEach((c, i) => {
                c.rotation.y += dt * 0.2;
                if (i === 1) c.scale.setScalar(1 + Math.sin(t * 1.5) * 0.15);
            });

            // Particles drift
            stars.rotation.y += dt * 0.01;

            // Camera parallax (subtle)
            targetRotX += (mouseY * 0.4 - targetRotX) * 0.03;
            targetRotY += (mouseX * 0.7 - targetRotY) * 0.03;
            camera.position.x += (targetRotY * 1.1 - camera.position.x) * 0.04;
            camera.position.y += (2.4 - targetRotX * 0.9 - camera.position.y) * 0.04;
            camera.lookAt(0, 0, 0);

            // Scroll tilt + bloom fade for readability
            if (!prefersReducedMotion) {
                const scrollNorm = Math.min(scrollOffset / window.innerHeight, 3);
                scene.rotation.x = THREE.MathUtils.lerp(scene.rotation.x, scrollNorm * 0.035, 0.02);
                bloomPass.strength = 0.25 - Math.min(scrollNorm * 0.04, 0.1);
            }

            composer.render();
            if (!prefersReducedMotion) animId = requestAnimationFrame(animate);
        };

        animId = requestAnimationFrame(animate);
        if (prefersReducedMotion) composer.render();

        // Cleanup
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
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}