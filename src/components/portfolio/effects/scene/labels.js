import * as THREE from 'three';

/**
 * Canvas-backed text sprites for the backdrop.
 *
 * Labels use `sizeAttenuation: false` so they stay the same size on screen no
 * matter how deep in the scene their anchor is — a label 30 units away reads
 * exactly like one 5 units away. `height` is therefore a fraction of the
 * viewport height (0.04 ≈ 4%), and the x-scale is corrected for aspect ratio
 * via fitLabels() on resize.
 */
const FONT = '500 30px "JetBrains Mono", ui-monospace, Menlo, monospace';
const W = 640;
const H = 64;
const ASPECT_CANVAS = W / H;

function paint(canvas, text, color, anchor) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    ctx.font = FONT;
    ctx.textBaseline = 'middle';
    const w = Math.min(ctx.measureText(text).width, W - 40);
    const x0 = anchor === 'left' ? 16 : anchor === 'right' ? W - 16 - w : (W - w) / 2;
    ctx.fillStyle = 'rgba(3,7,18,0.6)';
    ctx.beginPath();
    ctx.roundRect(x0 - 12, 10, w + 24, H - 20, 8);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.fillText(text, x0, H / 2 + 1, w);
}

/**
 * @param {string} text
 * @param {string} color css color
 * @param {number} height fraction of viewport height
 * @param {'left'|'center'|'right'} anchor which edge sits on the sprite position
 */
export function makeLabel(text, color, height = 0.04, anchor = 'left') {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    paint(canvas, text, color, anchor);
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false, opacity: 0, sizeAttenuation: false });
    const sprite = new THREE.Sprite(mat);
    sprite.center.set(anchor === 'left' ? 0 : anchor === 'right' ? 1 : 0.5, 0.5);
    sprite.userData = { canvas, tex, color, anchor, height, target: 0, isLabel: true };
    sprite.renderOrder = 10;
    fitLabel(sprite, window.innerWidth / window.innerHeight);
    return sprite;
}

export function fitLabel(sprite, aspect) {
    const h = sprite.userData.height;
    sprite.scale.set(h * ASPECT_CANVAS / aspect, h, 1);
}

/** Re-fit every label after a viewport resize. */
export function fitLabels(root, aspect) {
    root.traverse((o) => { if (o.isSprite && o.userData.isLabel) fitLabel(o, aspect); });
}

export function setLabelText(sprite, text, color = sprite.userData.color) {
    const { canvas, tex, anchor } = sprite.userData;
    paint(canvas, text, color, anchor);
    sprite.userData.color = color;
    tex.needsUpdate = true;
}

/** Ease a label toward its target opacity each frame. */
export function tickLabel(sprite, dt) {
    const m = sprite.material;
    const t = sprite.userData.target;
    m.opacity += (t - m.opacity) * Math.min(1, dt * 6);
    sprite.visible = m.opacity > 0.01;
}
