import React, { useState, useEffect, useRef } from 'react';
import { APP_SURFACE, LIGHT_STATUS } from './AppWrapper';
import { useWallpaper } from './system';
import { haptic } from './haptics';

const SPRING = 'cubic-bezier(0.32,0.72,0,1)';

/* One multitasking card. Handles its own drag (axis-locked): vertical swipe
   up flings the card off-screen and kills the app; horizontal is left to the
   scroll container; a tap selects. Works with touch + mouse via pointer events. */
function Card({ app, index, shown, onSelect, onKill }) {
    const [dy, setDy] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [flung, setFlung] = useState(false);
    const g = useRef(null);

    const surface = APP_SURFACE[app.id] || '#f2f2f7';
    const light = LIGHT_STATUS.has(app.id);

    const onDown = (e) => {
        if (flung) return;
        g.current = { x: e.clientX, y: e.clientY, axis: null, moved: false };
    };
    const onMove = (e) => {
        const s = g.current;
        if (!s) return;
        const dx = e.clientX - s.x, ddy = e.clientY - s.y;
        if (!s.axis && (Math.abs(dx) > 8 || Math.abs(ddy) > 8)) {
            s.axis = Math.abs(ddy) > Math.abs(dx) ? 'v' : 'h';
            s.moved = true;
        }
        if (s.axis === 'v') {
            if (e.currentTarget.setPointerCapture && !s.captured) {
                try { e.currentTarget.setPointerCapture(e.pointerId); s.captured = true; } catch {}
            }
            setDragging(true);
            setDy(ddy < 0 ? ddy : ddy * 0.25);
        } else if (s.axis === 'h') {
            g.current = null; // hand off to native scroll
            setDragging(false);
            setDy(0);
        }
    };
    const onUp = () => {
        const s = g.current;
        g.current = null;
        setDragging(false);
        if (!s) return;
        if (!s.moved) { haptic('light'); onSelect(app.id); return; }
        if (s.axis === 'v' && dy <= -90) {
            haptic('medium');
            setFlung(true);
            setTimeout(() => onKill(app.id), 240);
            return;
        }
        setDy(0);
    };

    let transform = 'scale(0.9) translateY(24px)', opacity = 0;
    if (flung) { transform = 'translateY(-120vh) scale(0.85)'; opacity = 0; }
    else if (shown) { transform = `translateY(${dy}px) scale(${1 - Math.min(0.08, Math.abs(dy) / 1400)})`; opacity = 1 - Math.min(0.6, Math.abs(dy) / 500); }

    return (
        <div
            className="flex-shrink-0 h-full flex items-center"
            style={{ width: '72vw', scrollSnapAlign: 'center', touchAction: 'pan-x' }}
        >
            <div
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full rounded-[28px] overflow-hidden shadow-2xl ring-1 ring-white/15 select-none cursor-pointer"
                style={{
                    height: '62vh',
                    background: surface,
                    transform, opacity,
                    transition: dragging
                        ? 'none'
                        : `transform ${flung ? 0.26 : 0.42}s ${SPRING} ${shown && !flung ? index * 35 : 0}ms, opacity 0.3s ease ${shown && !flung ? index * 35 : 0}ms`,
                }}
            >
                {/* Top strip: icon + name */}
                <div
                    className="absolute top-0 inset-x-0 z-10 flex items-center gap-2 px-3 pt-3"
                    style={{ color: light ? '#fff' : '#000' }}
                >
                    <div className="w-[33px] h-[33px] flex items-center justify-center overflow-hidden">
                        <div style={{ transform: 'scale(0.55)' }}><app.Icon /></div>
                    </div>
                    <span className="text-[14px] font-semibold drop-shadow-sm truncate">{app.name}</span>
                </div>

                {/* Preview body — faded giant icon as a stand-in for a screenshot */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div style={{ transform: 'scale(1.6)', opacity: 0.18, filter: 'saturate(1.2)' }}><app.Icon /></div>
                </div>
                <div
                    className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                    style={{ background: light ? 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)' : 'linear-gradient(to top, rgba(0,0,0,0.06), transparent)' }}
                />
                <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
                    <div className="w-[70px] h-[4px] rounded-full" style={{ background: light ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.3)' }} />
                </div>
            </div>
        </div>
    );
}

export default function AppSwitcher({ apps = [], activeId = null, onSelect, onKill, onClose }) {
    const wallpaper = useWallpaper();
    const [shown, setShown] = useState(false);
    const [hint, setHint] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        const r = requestAnimationFrame(() => setShown(true));
        const t = setTimeout(() => setHint(false), 2500);
        return () => { cancelAnimationFrame(r); clearTimeout(t); };
    }, []);

    /* Start scrolled to the active/most-recent card */
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const idx = Math.max(0, apps.findIndex((a) => a.id === activeId));
        const card = el.children[idx];
        if (card) el.scrollLeft = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const close = () => {
        setShown(false);
        setTimeout(() => onClose && onClose(), 220);
    };

    const select = (id) => {
        setShown(false);
        setTimeout(() => onSelect && onSelect(id), 200);
    };

    return (
        <div
            className="absolute inset-0 z-[70] overflow-hidden ios-font"
            onClick={close}
            style={{ opacity: shown ? 1 : 0, transition: 'opacity 0.22s ease' }}
        >
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${wallpaper})`, filter: 'blur(28px) brightness(0.55)', transform: 'scale(1.15)' }}
            />
            <div className="absolute inset-0 bg-black/25" />

            {apps.length === 0 ? (
                <div className="relative h-full flex items-center justify-center">
                    <span className="text-white/60 text-[17px] font-medium">No Recent Apps</span>
                </div>
            ) : (
                <div
                    ref={scrollRef}
                    className="relative h-full flex items-center overflow-x-auto overflow-y-hidden ios-scroll"
                    style={{ scrollSnapType: 'x mandatory', gap: '4vw', paddingLeft: '14vw', paddingRight: '14vw' }}
                >
                    {apps.map((app, i) => (
                        <Card key={app.id} app={app} index={i} shown={shown} onSelect={select} onKill={onKill} />
                    ))}
                </div>
            )}

            <div
                className="absolute bottom-9 inset-x-0 flex justify-center pointer-events-none"
                style={{ opacity: hint && apps.length > 0 ? 1 : 0, transition: 'opacity 0.6s ease' }}
            >
                <span className="text-white/60 text-[12px] font-medium bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
                    Swipe up on a card to close it
                </span>
            </div>
        </div>
    );
}
