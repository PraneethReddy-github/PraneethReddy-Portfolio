import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArcadeBackButton, ArcadeScorePill, ArcadeOverlay } from '../GamesApp';

const W = 300;
const H = 440;
const GRAVITY = 0.45;
const FLAP = -7.2;
const PIPE_W = 54;
const GAP = 130;
const PIPE_SPACING = 200;   // horizontal px between pipes
const SPEED = 2.3;          // px per frame
const BIRD_X = 80;
const BIRD_R = 13;

export default function Flappy({ onClose }) {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);
    const [state, setState] = useState('idle'); // idle | playing | over

    const stateRef = useRef('idle');
    const birdRef = useRef({ y: H / 2, v: 0 });
    const pipesRef = useRef([]);
    const scoreRef = useRef(0);
    const rafRef = useRef(null);
    const tRef = useRef(0); // animation clock for clouds / wing flap

    const reset = () => {
        birdRef.current = { y: H / 2, v: 0 };
        pipesRef.current = [];
        for (let i = 0; i < 3; i++) {
            pipesRef.current.push({
                x: W + i * PIPE_SPACING,
                gap: 90 + Math.random() * (H - GAP - 200),
                passed: false,
            });
        }
        scoreRef.current = 0;
        setScore(0);
    };

    const GROUND_H = 28;

    const drawCloud = (ctx, cx, cy, s) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 16 * s, 0, Math.PI * 2);
        ctx.arc(cx + 18 * s, cy + 4 * s, 13 * s, 0, Math.PI * 2);
        ctx.arc(cx - 18 * s, cy + 4 * s, 12 * s, 0, Math.PI * 2);
        ctx.arc(cx, cy + 8 * s, 14 * s, 0, Math.PI * 2);
        ctx.fill();
    };

    const drawPipe = (ctx, x, top, height, capAtBottom) => {
        const grad = ctx.createLinearGradient(x, 0, x + PIPE_W, 0);
        grad.addColorStop(0, '#7fd26a');
        grad.addColorStop(0.45, '#57b84a');
        grad.addColorStop(0.55, '#4ba83f');
        grad.addColorStop(1, '#2f7d2c');
        const capH = 20;
        const capX = x - 5;
        const capW = PIPE_W + 10;
        roundRectPath(ctx, x, top, PIPE_W, height, 6);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        roundRectPath(ctx, x + 5, top, 6, height, 3);
        ctx.fill();
        const capY = capAtBottom ? top + height - capH : top;
        const capGrad = ctx.createLinearGradient(capX, 0, capX + capW, 0);
        capGrad.addColorStop(0, '#85d771');
        capGrad.addColorStop(0.5, '#54b446');
        capGrad.addColorStop(1, '#2c7829');
        ctx.fillStyle = capGrad;
        roundRectPath(ctx, capX, capY, capW, capH, 6);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        roundRectPath(ctx, capX + 4, capY + 3, capW - 8, 4, 2);
        ctx.fill();
    };

    function roundRectPath(ctx, x, y, w, h, r) {
        const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.arcTo(x + w, y, x + w, y + h, rr);
        ctx.arcTo(x + w, y + h, x, y + h, rr);
        ctx.arcTo(x, y + h, x, y, rr);
        ctx.arcTo(x, y, x + w, y, rr);
        ctx.closePath();
    }

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const t = tRef.current;

        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, '#2b5b8c');
        sky.addColorStop(0.45, '#6aa0c4');
        sky.addColorStop(0.8, '#f3b98a');
        sky.addColorStop(1, '#ffd9a8');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        const sun = ctx.createRadialGradient(W - 60, 90, 8, W - 60, 90, 120);
        sun.addColorStop(0, 'rgba(255,240,200,0.65)');
        sun.addColorStop(1, 'rgba(255,240,200,0)');
        ctx.fillStyle = sun;
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        const back = ((t * 0.25) % (W + 120)) - 60;
        drawCloud(ctx, W - back, 70, 1.1);
        drawCloud(ctx, W - back - 180, 130, 0.8);
        ctx.fillStyle = 'rgba(255,255,255,0.42)';
        const front = ((t * 0.6) % (W + 140)) - 70;
        drawCloud(ctx, W - front - 40, 50, 1.0);
        drawCloud(ctx, W - front - 220, 110, 1.25);

        pipesRef.current.forEach((p) => {
            drawPipe(ctx, p.x, 0, p.gap, true);                  // top pipe (cap at bottom, by the gap)
            const by = p.gap + GAP;
            drawPipe(ctx, p.x, by, (H - GROUND_H) - by, false); // bottom pipe (cap at top, by the gap)
        });

        const groundY = H - GROUND_H;
        const gGrad = ctx.createLinearGradient(0, groundY, 0, H);
        gGrad.addColorStop(0, '#e6d79a');
        gGrad.addColorStop(1, '#cdb878');
        ctx.fillStyle = gGrad;
        ctx.fillRect(0, groundY, W, GROUND_H);
        ctx.fillStyle = '#6ec24f';
        ctx.fillRect(0, groundY, W, 5);
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        const goff = (t * SPEED) % 16;
        for (let gx = -goff; gx < W; gx += 16) {
            ctx.fillRect(gx, groundY + 8, 8, 3);
        }

        const b = birdRef.current;
        ctx.save();
        ctx.translate(BIRD_X, b.y);
        ctx.rotate(Math.max(-0.45, Math.min(1.1, b.v / 11)));

        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.beginPath(); ctx.ellipse(0, BIRD_R + 2, BIRD_R * 0.9, BIRD_R * 0.4, 0, 0, Math.PI * 2); ctx.fill();

        const bodyGrad = ctx.createRadialGradient(-3, -4, 3, 0, 0, BIRD_R + 2);
        bodyGrad.addColorStop(0, '#ffe98a');
        bodyGrad.addColorStop(0.6, '#ffd33d');
        bodyGrad.addColorStop(1, '#f3b21d');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, BIRD_R + 1, BIRD_R, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.beginPath();
        ctx.ellipse(-2, 3, BIRD_R * 0.55, BIRD_R * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        const wingFlap = Math.sin(t * 0.4) * 0.5;
        ctx.save();
        ctx.rotate(wingFlap);
        const wingGrad = ctx.createLinearGradient(-10, -2, -2, 8);
        wingGrad.addColorStop(0, '#ffc94d');
        wingGrad.addColorStop(1, '#e89c12');
        ctx.fillStyle = wingGrad;
        ctx.beginPath();
        ctx.ellipse(-3, 2, 8, 5.5, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = '#f7861c';
        ctx.beginPath();
        ctx.moveTo(BIRD_R - 1, -1);
        ctx.lineTo(BIRD_R + 8, 1);
        ctx.lineTo(BIRD_R - 1, 4);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#d96a10';
        ctx.beginPath();
        ctx.moveTo(BIRD_R - 1, 2);
        ctx.lineTo(BIRD_R + 8, 1);
        ctx.lineTo(BIRD_R + 5, 4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(5, -4, 4.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath(); ctx.arc(6.3, -4, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(7, -5, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        if (stateRef.current === 'playing') {
            ctx.save();
            ctx.font = '700 34px ui-rounded, -apple-system, "SF Pro Rounded", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fontVariantNumeric = 'tabular-nums';
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'rgba(0,0,0,0.25)';
            ctx.fillStyle = '#ffffff';
            ctx.strokeText(String(scoreRef.current), W / 2, 58);
            ctx.fillText(String(scoreRef.current), W / 2, 58);
            ctx.restore();
        }
    }, []);

    const stop = () => { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } };

    const gameOver = () => {
        stop();
        stateRef.current = 'over';
        setState('over');
        setBest((b) => Math.max(b, scoreRef.current));
    };

    const step = useCallback(() => {
        tRef.current += 1;
        const b = birdRef.current;
        b.v += GRAVITY;
        b.y += b.v;

        let pipes = pipesRef.current;
        pipes.forEach((p) => { p.x -= SPEED; });
        if (pipes[0] && pipes[0].x + PIPE_W < 0) {
            pipes.shift();
            const lastX = pipes[pipes.length - 1].x;
            pipes.push({ x: lastX + PIPE_SPACING, gap: 90 + Math.random() * (H - GAP - 200), passed: false });
        }

        pipes.forEach((p) => {
            if (!p.passed && p.x + PIPE_W < BIRD_X) {
                p.passed = true;
                scoreRef.current += 1;
                setScore(scoreRef.current);
            }
        });

        if (b.y + BIRD_R > H - GROUND_H || b.y - BIRD_R < 0) { gameOver(); return; }
        for (const p of pipes) {
            const inX = BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_W;
            const inGap = b.y - BIRD_R > p.gap && b.y + BIRD_R < p.gap + GAP;
            if (inX && !inGap) { gameOver(); return; }
        }

        draw();
        rafRef.current = requestAnimationFrame(step);
    }, [draw]);

    const start = () => {
        reset();
        stateRef.current = 'playing';
        setState('playing');
        birdRef.current.v = FLAP;
        stop();
        rafRef.current = requestAnimationFrame(step);
    };

    const flap = () => {
        if (stateRef.current === 'playing') birdRef.current.v = FLAP;
    };

    useEffect(() => { draw(); }, [draw]);
    useEffect(() => () => stop(), []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === ' ' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (stateRef.current === 'playing') flap();
                else start();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div
            className="h-full w-full flex flex-col items-center ios-font select-none relative"
            style={{ background: 'radial-gradient(120% 90% at 50% 0%, #16414a 0%, #0b2a30 55%, #061518 100%)' }}
        >
            {onClose && <ArcadeBackButton onClose={onClose} />}
            <ArcadeScorePill value={score} accent="#ffd33d" />

            <div className="flex-1 min-h-0 w-full flex items-center justify-center px-6 pt-16">
                <div
                    className="relative"
                    style={{ width: '100%', maxWidth: 300 }}
                    onPointerDown={(e) => { e.preventDefault(); flap(); }}
                >
                    <canvas
                        ref={canvasRef}
                        width={W}
                        height={H}
                        className="w-full h-auto rounded-[18px] border border-white/10"
                        style={{ aspectRatio: `${W}/${H}`, boxShadow: '0 18px 50px rgba(0,0,0,0.55)' }}
                    />
                    <ArcadeOverlay
                        state={state}
                        glyph="🐤"
                        title="Flappy"
                        score={score}
                        best={best}
                        accent="#ffd33d"
                        onStart={start}
                    />
                </div>
            </div>

            <div className="flex-shrink-0 w-full flex items-center justify-center pb-9 pt-2" style={{ minHeight: 36 }}>
                {state === 'playing' && (
                    <button
                        onPointerDown={(e) => { e.preventDefault(); flap(); }}
                        className="px-14 py-4 rounded-full bg-[#ffd33d] text-black font-extrabold text-[16px] tracking-wide active:scale-95 transition-transform"
                        style={{ boxShadow: '0 10px 28px rgba(255,211,61,0.4)' }}
                    >
                        FLAP
                    </button>
                )}
            </div>
        </div>
    );
}
