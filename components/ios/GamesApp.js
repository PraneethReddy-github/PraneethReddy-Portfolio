import React, { useState, useRef, useEffect } from 'react';
import Game2048 from './apps/Game2048';
import Snake from './apps/Snake';
import Flappy from './apps/Flappy';

/* Shared iOS-style frosted back control used by the in-game view. */
export function ArcadeBackButton({ onClose }) {
    return (
        <button
            onClick={onClose}
            className="absolute top-3 left-3 z-30 flex items-center gap-0.5 pl-1.5 pr-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white text-[14px] font-semibold active:scale-95 transition-transform shadow-lg"
            style={{ WebkitBackdropFilter: 'blur(20px)' }}
        >
            <svg className="w-[18px] h-[18px] fill-white -ml-0.5" viewBox="0 0 24 24"><path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4-4.6-4.6 4.6-4.6Z" /></svg>
            Arcade
        </button>
    );
}

/* Shared iOS-style frosted score pill used by the in-game view (top-right). */
export function ArcadeScorePill({ label = 'Score', value, accent = '#ffffff' }) {
    return (
        <div
            className="absolute top-3 right-3 z-30 flex items-center gap-1.5 pl-3 pr-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 shadow-lg"
            style={{ WebkitBackdropFilter: 'blur(20px)' }}
        >
            <span className="text-white/55 text-[12px] font-semibold tracking-wide">{label}</span>
            <span className="text-[16px] font-bold tabular-nums leading-none" style={{ color: accent }}>{value}</span>
        </div>
    );
}

/* Shared iOS-style start / game-over card overlay. */
export function ArcadeOverlay({ state, glyph, title, score, best, accent, onStart }) {
    const [shown, setShown] = useState(false);

    useEffect(() => {
        if (state === 'playing') {
            setShown(false);
            return;
        }
        setShown(false);
        const raf = requestAnimationFrame(() => setShown(true));
        return () => cancelAnimationFrame(raf);
    }, [state]);

    if (state === 'playing') return null;
    const isOver = state === 'over';
    return (
        <div
            className="fixed inset-0 z-20 flex items-center justify-center p-6"
            style={{
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                opacity: shown ? 1 : 0,
                transition: 'opacity 0.32s ease',
            }}
        >
            <div
                className="w-full max-w-[230px] flex flex-col items-center text-center px-6 py-7 rounded-[26px] border border-white/12"
                style={{
                    background: 'rgba(28,28,32,0.72)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
                    opacity: shown ? 1 : 0,
                    transform: shown ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(10px)',
                    transition: 'opacity 0.32s cubic-bezier(0.34,1.56,0.64,1), transform 0.32s cubic-bezier(0.34,1.56,0.64,1)',
                }}
            >
                <div className="text-[40px] leading-none mb-2 drop-shadow">{glyph}</div>
                <div className="text-white text-[22px] font-bold tracking-[-0.3px]">{isOver ? 'Game Over' : title}</div>
                {isOver ? (
                    <div className="mt-4 mb-5 w-full flex items-stretch justify-center gap-3">
                        <div className="flex-1 rounded-[16px] py-3 bg-white/[0.06] border border-white/10">
                            <div className="text-white/45 text-[11px] font-semibold uppercase tracking-wide">Score</div>
                            <div className="text-white text-[24px] font-bold tabular-nums leading-tight">{score}</div>
                        </div>
                        <div className="flex-1 rounded-[16px] py-3 bg-white/[0.06] border border-white/10">
                            <div className="text-white/45 text-[11px] font-semibold uppercase tracking-wide">Best</div>
                            <div className="text-[24px] font-bold tabular-nums leading-tight" style={{ color: accent }}>{best}</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-white/50 text-[14px] mt-1.5 mb-5">Best {best}</div>
                )}
                <button
                    onClick={onStart}
                    className="w-full py-3 rounded-full text-black font-bold text-[16px] active:scale-95 transition-transform"
                    style={{ background: accent, boxShadow: `0 8px 24px ${accent}55` }}
                >
                    {isOver ? 'Play Again' : 'Start'}
                </button>
            </div>
        </div>
    );
}

/* Adds touch-swipe controls to the keyboard-only 2048 without editing the shared
   game file: a swipe dispatches the matching arrow key into the game's container. */
function Game2048Mobile() {
    const wrapRef = useRef(null);
    const start = useRef(null);

    const onStart = (e) => { start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onEnd = (e) => {
        if (!start.current) return;
        const dx = e.changedTouches[0].clientX - start.current.x;
        const dy = e.changedTouches[0].clientY - start.current.y;
        const ax = Math.abs(dx), ay = Math.abs(dy);
        start.current = null;
        if (Math.max(ax, ay) < 24) return;
        const key = ax > ay ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft') : (dy > 0 ? 'ArrowDown' : 'ArrowUp');
        const el = wrapRef.current && wrapRef.current.querySelector('[tabindex="0"]');
        if (el) {
            el.focus();
            el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
        }
    };

    return (
        <div ref={wrapRef} className="h-full" onTouchStart={onStart} onTouchEnd={onEnd}>
            <Game2048 />
        </div>
    );
}

const GAMES = [
    {
        id: 'snake', name: 'Snake', tagline: 'Glide, grow, survive',
        glyph: '🐍', accent: '#30d158',
        bg: 'radial-gradient(120% 120% at 15% 0%, #1f5e35 0%, #0c2a18 55%, #061309 100%)',
    },
    {
        id: 'flappy', name: 'Flappy', tagline: 'Tap to soar through the gaps',
        glyph: '🐤', accent: '#ffd33d',
        bg: 'radial-gradient(120% 120% at 80% 0%, #4ec0ca 0%, #1f7e8a 50%, #0b2a30 100%)',
    },
    {
        id: '2048', name: '2048', tagline: 'Swipe, merge, hit 2048',
        glyph: '🔢', accent: '#f6b352',
        bg: 'radial-gradient(120% 120% at 15% 0%, #f6b352 0%, #c9772a 50%, #3b2410 100%)',
    },
];

export default function GamesApp() {
    const [game, setGame] = useState(null);

    if (game) {
        const close = () => setGame(null);
        return (
            <div className="h-full w-full flex flex-col bg-black ios-font">
                <div className="flex-1 min-h-0 relative overflow-hidden">
                    {game === '2048' ? (
                        <>
                            <ArcadeBackButton onClose={close} />
                            <div className="h-full">
                                <Game2048Mobile />
                            </div>
                        </>
                    ) : game === 'snake' ? (
                        <Snake onClose={close} />
                    ) : (
                        <Flappy onClose={close} />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full ios-font overflow-y-auto ios-scroll animate-ios-rise" style={{ background: '#0b0b0f' }}>
            <div className="px-5 pt-5 pb-4">
                <h1 className="text-[34px] font-bold text-white tracking-[-0.8px] leading-none">Arcade</h1>
            </div>

            <div className="px-4 space-y-4 pb-[26px]">
                {GAMES.map((g) => (
                    <button
                        key={g.id}
                        onClick={() => setGame(g.id)}
                        className="w-full block rounded-[22px] overflow-hidden text-left border border-white/10 active:scale-[0.98] transition-transform"
                        style={{ boxShadow: '0 12px 34px rgba(0,0,0,0.55)' }}
                    >
                        <div className="relative w-full" style={{ aspectRatio: '16 / 10', background: g.bg }}>
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0.35) 100%)' }} />

                            <div className="absolute -right-2 -bottom-4 text-[150px] leading-none opacity-25 select-none pointer-events-none" style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.4))' }}>
                                {g.glyph}
                            </div>

                            <div className="absolute inset-0 flex flex-col p-5">
                                <div
                                    className="w-14 h-14 rounded-[16px] flex items-center justify-center text-[30px] border border-white/25"
                                    style={{ background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                                >
                                    {g.glyph}
                                </div>

                                <div className="mt-auto flex items-end justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="text-white text-[26px] font-bold tracking-[-0.4px] leading-none drop-shadow-lg">{g.name}</div>
                                        <div className="text-white/80 text-[14px] font-medium mt-1.5 drop-shadow">{g.tagline}</div>
                                    </div>
                                    <span
                                        className="flex-shrink-0 px-6 py-2 rounded-full text-[15px] font-bold text-black"
                                        style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 14px rgba(0,0,0,0.35)' }}
                                    >
                                        Play
                                    </span>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
