import React, { useEffect, useRef, useState } from 'react';
import { useSystem, clearBanner, showBanner } from './system';
import { haptic } from './haptics';
import { NOTIFICATIONS } from './notifications';

/* ------------------------------------------------------------------
 * Swipeable notification card — shared by the lock screen and the
 * notification center. Swipe left reveals a red "Clear" action; swiping
 * far (≥ clearAt px) clears immediately. Tap → onTap.
 * ------------------------------------------------------------------ */
export function SwipeCard({ children, onTap, onClear, clearAt = 140, className = '', style = {} }) {
    const [x, setX] = useState(0);
    const [drag, setDrag] = useState(false);
    const [gone, setGone] = useState(false);
    const s = useRef(null);
    const REVEAL = 78;

    const pt = (e) => (e.touches?.[0] || e.changedTouches?.[0] || e);

    const start = (e) => {
        const p = pt(e);
        s.current = { x: p.clientX, y: p.clientY, base: x, axis: null };
    };
    const move = (e) => {
        const g = s.current;
        if (!g) return;
        const p = pt(e);
        const dx = p.clientX - g.x, dy = p.clientY - g.y;
        if (!g.axis && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) g.axis = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
        if (g.axis !== 'h') return;
        e.stopPropagation();
        const v = Math.min(0, g.base + dx);
        setX(v > -REVEAL - 30 ? v : -REVEAL - 30 + (v + REVEAL + 30) * 0.35);
        setDrag(true);
    };
    const doClear = () => {
        haptic('light');
        setGone(true);
        setTimeout(() => onClear && onClear(), 220);
    };
    const end = (e) => {
        const g = s.current;
        s.current = null;
        if (!g) return;
        setDrag(false);
        if (g.axis === 'h') {
            e.stopPropagation();
            if (x <= -clearAt) return doClear();
            setX(x < -REVEAL / 2 ? -REVEAL : 0);
            return;
        }
        if (!g.axis) {
            if (x !== 0) { setX(0); return; }
            onTap && onTap();
        }
    };

    return (
        <div
            className={`relative ${className}`}
            style={{
                ...style,
                transition: gone ? 'transform .22s ease, opacity .22s ease, max-height .22s ease, margin .22s ease' : undefined,
                transform: gone ? 'translateX(-110%)' : undefined,
                opacity: gone ? 0 : 1,
                maxHeight: gone ? 0 : 400,
                overflow: gone ? 'hidden' : undefined,
                marginTop: gone ? 0 : undefined,
                marginBottom: gone ? -10 : undefined,
            }}
        >
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); doClear(); }}
                onTouchStart={(e) => e.stopPropagation()}
                className="absolute right-0 top-0 bottom-0 w-[70px] rounded-[20px] bg-[#ff3b30] text-white text-[13px] font-semibold flex items-center justify-center"
                style={{ opacity: Math.min(1, -x / REVEAL), transform: `scale(${0.85 + Math.min(1, -x / REVEAL) * 0.15})` }}
            >
                Clear
            </button>
            <div
                onTouchStart={start} onTouchMove={move} onTouchEnd={end}
                onMouseDown={start}
                onMouseMove={(e) => { if (s.current && e.buttons === 1) move(e); }}
                onMouseUp={end}
                onMouseLeave={(e) => { if (s.current) end(e); }}
                style={{ transform: `translateX(${x}px)`, transition: drag ? 'none' : 'transform .3s cubic-bezier(0.32,0.72,0,1)' }}
            >
                {children}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------
 * Top banner — reads system.banner. Drops in, auto-dismisses after 5s,
 * swipe up to dismiss, tap to open the source app.
 * ------------------------------------------------------------------ */
function Banner({ banner, onOpen }) {
    const islandExpanded = useSystem((s) => s.islandExpanded);
    const [shown, setShown] = useState(false);
    const [dy, setDy] = useState(0);
    const [drag, setDrag] = useState(false);
    const startY = useRef(null);
    const timer = useRef(null);
    const leaving = useRef(false);

    const armTimer = () => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => dismiss(), 5000);
    };

    useEffect(() => {
        haptic('light');
        const r = requestAnimationFrame(() => setShown(true));
        armTimer();
        return () => { cancelAnimationFrame(r); clearTimeout(timer.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dismiss = (cb) => {
        if (leaving.current) return;
        leaving.current = true;
        clearTimeout(timer.current);
        setShown(false);
        setTimeout(() => { clearBanner(); cb && cb(); }, 220);
    };

    const onStart = (e) => { startY.current = e.touches[0].clientY; clearTimeout(timer.current); setDrag(true); };
    const onMove = (e) => {
        if (startY.current === null) return;
        e.stopPropagation();
        const d = e.touches[0].clientY - startY.current;
        setDy(d < 0 ? d : d * 0.15);
    };
    const onEnd = () => {
        if (startY.current === null) return;
        const d = dy;
        startY.current = null;
        setDrag(false);
        if (d <= -30) { dismiss(); return; }
        setDy(0);
        armTimer();
    };

    const tap = () => {
        if (Math.abs(dy) > 4) return;
        haptic('light');
        dismiss(() => onOpen && onOpen(banner.appId));
    };

    return (
        <div
            className="absolute inset-x-3 z-[95] ios-font select-none"
            style={{
                top: islandExpanded === 'music' ? 172 : islandExpanded === 'timer' ? 132 : 52,
                transform: shown ? `translateY(${dy}px)` : 'translateY(-120%)',
                opacity: shown ? 1 : 0,
                transition: drag ? 'none' : 'transform .45s cubic-bezier(0.32,0.72,0,1), opacity .25s ease, top .35s cubic-bezier(0.32,0.72,0,1)',
            }}
            onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
            onClick={tap}
        >
            <div
                className="rounded-[22px] border border-white/10 px-3.5 py-3 shadow-2xl"
                style={{ background: 'rgba(28,28,30,0.78)', backdropFilter: 'blur(30px) saturate(1.3)', WebkitBackdropFilter: 'blur(30px) saturate(1.3)' }}
            >
                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[18px] flex-shrink-0 shadow" style={{ background: banner.color }}>
                        {banner.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                            <span className="text-white/55 text-[11px] font-semibold uppercase tracking-wider truncate">{banner.app}</span>
                            <span className="ml-auto text-white/40 text-[11px] flex-shrink-0">now</span>
                        </div>
                        <div className="text-white text-[14px] font-semibold leading-tight mt-0.5">{banner.title}</div>
                        <div className="text-white/75 text-[13px] leading-snug mt-0.5" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {banner.body}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NotificationBanner({ onOpen }) {
    const banner = useSystem((s) => s.banner);
    if (!banner) return null;
    return <Banner key={banner.id} banner={banner} onOpen={onOpen} />;
}

/* Once per session: drop the welcome notifications in as banners. */
export function scheduleWelcomeBanners() {
    if (typeof window === 'undefined') return;
    try {
        if (sessionStorage.getItem('ios_welcomed')) return;
        sessionStorage.setItem('ios_welcomed', '1');
    } catch { return; }
    setTimeout(() => showBanner(NOTIFICATIONS[0]), 2500);
    setTimeout(() => showBanner(NOTIFICATIONS[1]), 14000);
}
