import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArcadeBackButton, ArcadeScorePill, ArcadeOverlay } from '../GamesApp';

const COLS = 15;
const ROWS = 17;
const CELL = 20;            // logical px per cell
const W = COLS * CELL;      // 300
const H = ROWS * CELL;      // 340
const SPEED = 175;          // ms per step (slower, more controllable)

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

export default function Snake({ onClose }) {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);
    const [state, setState] = useState('idle'); // idle | playing | over

    const snakeRef = useRef([{ x: 7, y: 8 }]);
    const dirRef = useRef({ x: 1, y: 0 });
    const nextDirRef = useRef({ x: 1, y: 0 });
    const foodRef = useRef({ x: 10, y: 8 });
    const loopRef = useRef(null);
    const stateRef = useRef('idle');

    const placeFood = () => {
        let p;
        do {
            p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
        } while (snakeRef.current.some((s) => s.x === p.x && s.y === p.y));
        foodRef.current = p;
    };

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, '#11331f');
        bgGrad.addColorStop(0.55, '#0a1e12');
        bgGrad.addColorStop(1, '#06120b');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if ((r + c) % 2 === 0) {
                    ctx.fillStyle = 'rgba(255,255,255,0.018)';
                    ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
                }
            }
        }

        ctx.strokeStyle = 'rgba(120,220,150,0.06)';
        ctx.lineWidth = 1;
        for (let i = 1; i < COLS; i++) { ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, H); ctx.stroke(); }
        for (let i = 1; i < ROWS; i++) { ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(W, i * CELL); ctx.stroke(); }

        const f = foodRef.current;
        const fcx = f.x * CELL + CELL / 2;
        const fcy = f.y * CELL + CELL / 2;
        const fr = CELL * 0.36;
        ctx.save();
        ctx.shadowColor = 'rgba(255,69,58,0.85)';
        ctx.shadowBlur = 16;
        const appleGrad = ctx.createRadialGradient(fcx - fr * 0.3, fcy - fr * 0.4, fr * 0.2, fcx, fcy, fr);
        appleGrad.addColorStop(0, '#ff7a6f');
        appleGrad.addColorStop(1, '#e22f24');
        ctx.fillStyle = appleGrad;
        ctx.beginPath();
        ctx.arc(fcx, fcy, fr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.beginPath();
        ctx.arc(fcx - fr * 0.32, fcy - fr * 0.36, fr * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4fcf6a';
        ctx.beginPath();
        ctx.ellipse(fcx + fr * 0.35, fcy - fr * 0.85, fr * 0.42, fr * 0.2, -0.7, 0, Math.PI * 2);
        ctx.fill();

        const snake = snakeRef.current;
        const len = snake.length;
        const dir = dirRef.current;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (len > 1) {
            ctx.save();
            ctx.shadowColor = 'rgba(52,214,95,0.45)';
            ctx.shadowBlur = 12;
            ctx.strokeStyle = 'rgba(52,214,95,0.0)';
            ctx.lineWidth = CELL - 4;
            ctx.beginPath();
            snake.forEach((s, i) => {
                const px = s.x * CELL + CELL / 2;
                const py = s.y * CELL + CELL / 2;
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            });
            ctx.stroke();
            ctx.restore();
        }
        snake.forEach((s, i) => {
            const t = i / Math.max(1, len - 1);
            const g = Math.round(214 - t * 70);
            const r2 = Math.round(36 + t * 10);
            const b2 = Math.round(95 - t * 30);
            const cx = s.x * CELL + CELL / 2;
            const cy = s.y * CELL + CELL / 2;
            const bodyGrad = ctx.createLinearGradient(cx - CELL / 2, cy - CELL / 2, cx + CELL / 2, cy + CELL / 2);
            bodyGrad.addColorStop(0, `rgb(${r2 + 24}, ${Math.min(255, g + 28)}, ${b2 + 20})`);
            bodyGrad.addColorStop(1, `rgb(${r2}, ${g}, ${b2})`);
            ctx.fillStyle = bodyGrad;
            const pad = i === 0 ? 1 : 2;
            roundRect(ctx, s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, i === 0 ? 7 : 6);
            ctx.fill();
            if (i === 0) {
                ctx.fillStyle = 'rgba(255,255,255,0.18)';
                roundRect(ctx, s.x * CELL + 3, s.y * CELL + 3, CELL - 6, (CELL - 6) * 0.45, 5);
                ctx.fill();
                const ex = dir.x, ey = dir.y;
                const perpX = -ey, perpY = ex;
                const fwd = CELL * 0.16, side = CELL * 0.2;
                const e1x = cx + ex * fwd + perpX * side;
                const e1y = cy + ey * fwd + perpY * side;
                const e2x = cx + ex * fwd - perpX * side;
                const e2y = cy + ey * fwd - perpY * side;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(e1x, e1y, 2.6, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(e2x, e2y, 2.6, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#06210f';
                ctx.beginPath(); ctx.arc(e1x + ex * 0.8, e1y + ey * 0.8, 1.3, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(e2x + ex * 0.8, e2y + ey * 0.8, 1.3, 0, Math.PI * 2); ctx.fill();
            }
        });

        const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(1, 'rgba(0,0,0,0.38)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, W, H);
    }, []);

    const stop = () => { if (loopRef.current) { clearInterval(loopRef.current); loopRef.current = null; } };

    const tick = useCallback(() => {
        const dir = nextDirRef.current;
        dirRef.current = dir;
        const head = snakeRef.current[0];
        const nh = { x: head.x + dir.x, y: head.y + dir.y };

        const hitWall = nh.x < 0 || nh.x >= COLS || nh.y < 0 || nh.y >= ROWS;
        const hitSelf = snakeRef.current.some((s) => s.x === nh.x && s.y === nh.y);
        if (hitWall || hitSelf) {
            stop();
            stateRef.current = 'over';
            setState('over');
            setBest((b) => Math.max(b, snakeRef.current.length - 1));
            return;
        }

        const newSnake = [nh, ...snakeRef.current];
        if (nh.x === foodRef.current.x && nh.y === foodRef.current.y) {
            setScore((s) => s + 1);
            placeFood();
        } else {
            newSnake.pop();
        }
        snakeRef.current = newSnake;
        draw();
    }, [draw]);

    const start = () => {
        snakeRef.current = [{ x: 7, y: 8 }, { x: 6, y: 8 }, { x: 5, y: 8 }];
        dirRef.current = { x: 1, y: 0 };
        nextDirRef.current = { x: 1, y: 0 };
        setScore(0);
        placeFood();
        stateRef.current = 'playing';
        setState('playing');
        draw();
        stop();
        loopRef.current = setInterval(tick, SPEED);
    };

    const setDir = (d) => {
        if (stateRef.current !== 'playing') return;
        const cur = dirRef.current;
        if (d.x === -cur.x && d.y === -cur.y) return; // no instant reverse
        nextDirRef.current = d;
    };

    useEffect(() => { draw(); }, [draw]);
    useEffect(() => () => stop(), []);

    useEffect(() => {
        const onKey = (e) => {
            const map = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
            if (map[e.key]) { e.preventDefault(); setDir(map[e.key]); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const DPadBtn = ({ d, rot, cls }) => (
        <button
            onPointerDown={(e) => { e.preventDefault(); setDir(d); }}
            className={`w-[52px] h-[52px] rounded-2xl bg-white/10 active:bg-white/25 flex items-center justify-center transition-colors ${cls}`}
        >
            <svg className="w-6 h-6 fill-white/85" viewBox="0 0 24 24" style={{ transform: `rotate(${rot}deg)` }}>
                <path d="M12 4l-8 8h5v8h6v-8h5z" />
            </svg>
        </button>
    );

    return (
        <div
            className="h-full w-full flex flex-col items-center ios-font select-none relative"
            style={{ background: 'radial-gradient(120% 90% at 50% 0%, #102e1c 0%, #08160d 60%, #050d08 100%)' }}
        >
            {onClose && <ArcadeBackButton onClose={onClose} />}
            <ArcadeScorePill value={score} accent="#30d158" />

            <div className="flex-1 min-h-0 w-full flex items-center justify-center px-6 pt-16">
                <div className="relative" style={{ width: '100%', maxWidth: 300 }}>
                    <canvas
                        ref={canvasRef}
                        width={W}
                        height={H}
                        className="w-full h-auto rounded-[18px] border border-white/10"
                        style={{ aspectRatio: `${W}/${H}`, boxShadow: '0 18px 50px rgba(0,0,0,0.55)' }}
                    />
                    <ArcadeOverlay
                        state={state}
                        glyph="🐍"
                        title="Snake"
                        score={score}
                        best={best}
                        accent="#30d158"
                        onStart={start}
                    />
                </div>
            </div>

            <div className="flex-shrink-0 w-full flex items-center justify-center pb-9 pt-2">
                <div className="grid grid-cols-3 grid-rows-3 gap-2 w-[180px]">
                    <span />
                    <DPadBtn d={{ x: 0, y: -1 }} rot={0} />
                    <span />
                    <DPadBtn d={{ x: -1, y: 0 }} rot={-90} />
                    <span />
                    <DPadBtn d={{ x: 1, y: 0 }} rot={90} />
                    <span />
                    <DPadBtn d={{ x: 0, y: 1 }} rot={180} />
                    <span />
                </div>
            </div>
        </div>
    );
}
