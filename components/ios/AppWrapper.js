import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import StatusBar from './StatusBar';
import { haptic } from './haptics';
import { useWallpaper } from './system';
import { GALLERY, GALLERY_DATES } from './galleryPhotos';
import Portfolio, { PortfolioApp } from './Portfolio';
import MailApp from './MailApp';
import CameraApp from './CameraApp';
import GamesApp from './GamesApp';
import CalendarApp from './CalendarApp';
import WeatherApp from './WeatherApp';
import TimerApp from './TimerApp';
import Varshion from './apps/Varshion';
import Safari from './apps/Safari';
import SettingsApp from './SettingsApp';

const PORTFOLIO_SECTIONS = new Set([
    'about', 'education', 'skills', 'learning',
    'certifications', 'projects', 'publications', 'resume'
]);

export const APP_SURFACE = {
    camera: '#000000', timer: '#0c0c0e', varshion: '#0a0f1e', weather: '#1f6fd1',
    calendar: '#ffffff', photos: '#ffffff', settings: '#f2f2f7', safari: '#ffffff', games: '#0b0b0f',
};
export const LIGHT_STATUS = new Set(['camera', 'timer', 'varshion', 'weather', 'games']);
const FULL_BLEED = new Set(['photos']);

/* ---------- Contact ---------- */

function ContactCard() {
    const rows = [
        { label: 'Phone', value: '+91 8639564054', href: 'tel:+918639564054', color: '#34c759',
          icon: 'M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1l-2.2 2.2Z' },
        { label: 'Email', value: 'connectwithpraneeth@gmail.com', href: 'mailto:connectwithpraneeth@gmail.com', color: '#007aff',
          icon: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z' },
        { label: 'LinkedIn', value: 'connectwithpraneeth', href: 'https://www.linkedin.com/in/connectwithpraneeth/', color: '#0a66c2',
          icon: 'M19 0h-14C2.2 0 0 2.2 0 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5ZM8 19H5V8h3v11ZM6.5 6.7A1.8 1.8 0 1 1 6.5 3a1.8 1.8 0 0 1 0 3.7ZM20 19h-3v-5.6c0-3.4-4-3.1-4 0V19h-3V8h3v1.8c1.4-2.6 7-2.8 7 2.5V19Z' },
    ];
    return (
        <div className="min-h-full bg-[#f2f2f7] ios-font px-4 pt-8 pb-10 animate-ios-rise">
            <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg ring-1 ring-black/5">
                    <img src="/images/logos/pfp.jpg" alt="Praneeth" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-[24px] font-bold text-black mt-3">P Praneeth Reddy</h1>
                <p className="text-[14px] text-black/45 mt-0.5">Software Developer @ Simnovus</p>
            </div>
            <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
                {rows.map((r, i) => (
                    <a key={i} href={r.href} target={r.href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer" className="block active:bg-black/[0.03]">
                        <div className="flex items-center px-4 py-3.5">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mr-3.5" style={{ background: r.color }}>
                                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d={r.icon} /></svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-[12px] text-black/40">{r.label}</div>
                                <div className="text-[15px] font-medium truncate" style={{ color: '#007AFF' }}>{r.value}</div>
                            </div>
                        </div>
                        {i < rows.length - 1 && <div className="h-px bg-black/[0.07] ml-[64px]" />}
                    </a>
                ))}
            </div>
        </div>
    );
}

/* ---------- Photos ---------- */

function PhotosApp({ initialPhoto = null }) {
    const photos = GALLERY;
    const photoDates = GALLERY_DATES;

    const TABS = ['Years', 'Months', 'All Photos'];
    const [tab, setTab] = useState(2); // default to All Photos
    const [viewer, setViewer] = useState(initialPhoto); // index of open photo or null
    const dateFor = (i) => photoDates[i] || '2026';

    const [slideDir, setSlideDir] = useState(0);     // -1 prev, +1 next → drives slide-in anim
    const [drag, setDrag] = useState(0);             // live horizontal drag offset (px)
    const [dragging, setDragging] = useState(false); // suppress transition while finger down
    const swipe = useRef(null);                       // {x, y, active, axis}
    const filmRef = useRef(null);

    const goTo = (next) => {
        const clamped = Math.max(0, Math.min(photos.length - 1, next));
        if (clamped === viewer) return;
        setSlideDir(clamped > viewer ? 1 : -1);
        setViewer(clamped);
    };
    const goPrev = () => goTo(viewer - 1);
    const goNext = () => goTo(viewer + 1);

    useEffect(() => {
        if (viewer === null) return;
        const strip = filmRef.current;
        if (!strip) return;
        const thumb = strip.querySelector(`[data-thumb="${viewer}"]`);
        if (!thumb) return;
        const target = thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2;
        strip.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    }, [viewer]);

    const pointFor = (e) => {
        if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        if (e.changedTouches && e.changedTouches[0]) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        return { x: e.clientX, y: e.clientY };
    };
    const dragStart = (e) => {
        const p = pointFor(e);
        swipe.current = { x: p.x, y: p.y, active: true, axis: null };
    };
    const dragMove = (e) => {
        const s = swipe.current;
        if (!s || !s.active) return;
        const p = pointFor(e);
        const dx = p.x - s.x;
        const dy = p.y - s.y;
        if (!s.axis) {
            if (Math.abs(dx) > 8 || Math.abs(dy) > 8) s.axis = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
        }
        if (s.axis === 'h') {
            let v = dx;
            if ((viewer === 0 && dx > 0) || (viewer === photos.length - 1 && dx < 0)) v = dx * 0.32;
            setDrag(v);
            setDragging(true);
        }
    };
    const dragEnd = (e) => {
        const s = swipe.current;
        swipe.current = null;
        if (!s || s.axis !== 'h') { setDragging(false); setDrag(0); return; }
        const p = pointFor(e);
        const dx = p.x - s.x;
        setDragging(false);
        setDrag(0);
        if (dx <= -60 && viewer < photos.length - 1) goNext();
        else if (dx >= 60 && viewer > 0) goPrev();
    };

    const monthGroups = [
        { label: 'June', sub: 'This Month', items: [0, 1] },
        { label: 'May', sub: '2026', items: [2, 3, 4] },
        { label: 'April', sub: '2026', items: [5, 6, 7] },
        { label: 'March', sub: '2026', items: [8, 9] },
        { label: 'February', sub: '2026', items: [10, 11] },
    ];

    return (
        <div className="min-h-full bg-white ios-font" style={{ animation: 'photosFade .32s ease-out both' }}>
            <style>{`
                @keyframes photosFade { from { opacity: 0 } to { opacity: 1 } }
                @keyframes photosViewerIn {
                    from { opacity: 0; transform: scale(.92); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes photoSlideFromRight {
                    from { transform: translateX(36px); opacity: .2; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes photoSlideFromLeft {
                    from { transform: translateX(-36px); opacity: .2; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes photoBackdropFade { from { opacity: 0 } to { opacity: 1 } }
            `}</style>

            {/* Header — extra top padding clears the status bar / dynamic island
                since Photos now runs full-bleed to the top edge. */}
            <div className="px-5 pt-14 pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-[32px] leading-tight font-bold text-black tracking-[-0.6px]">Photos</h1>
                        <p className="text-[14px] text-black/40 mt-0.5">{photos.length} Items</p>
                    </div>
                    <button
                        type="button"
                        className="text-[16px] text-[#007aff] font-normal mt-1 active:opacity-50 transition-opacity"
                    >
                        Select
                    </button>
                </div>
            </div>

            <div className="px-4 pb-3">
                <div className="relative flex p-[2px] rounded-[9px]" style={{ background: 'rgba(118,118,128,0.12)' }}>
                    <div
                        className="absolute top-[2px] bottom-[2px] rounded-[7px] bg-white"
                        style={{
                            width: `calc((100% - 4px) / ${TABS.length})`,
                            left: `calc(2px + ${tab} * (100% - 4px) / ${TABS.length})`,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.04)',
                            transition: 'left .26s cubic-bezier(.32,.72,0,1)',
                        }}
                    />
                    {TABS.map((t, i) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTab(i)}
                            className="relative z-10 flex-1 py-[6px] text-[13px] font-semibold tracking-[-0.1px] transition-colors"
                            style={{ color: tab === i ? '#000' : 'rgba(60,60,67,0.6)' }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {tab === 2 && (
                /* All Photos — edge-to-edge tight grid */
                <div className="grid grid-cols-4 gap-[2px]" style={{ paddingBottom: '26px' }}>
                    {photos.map((src, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setViewer(i)}
                            className="aspect-square overflow-hidden bg-black/5 active:opacity-70 transition-opacity"
                        >
                            <img src={src.replace('/images/gallery/', '/images/gallery/thumbnails/')} alt="" loading="lazy" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {tab === 1 && (
                /* Months — larger rounded cards grouped by month */
                <div className="px-4 space-y-6" style={{ paddingBottom: '26px' }}>
                    {monthGroups.map((g) => (
                        <div key={g.label}>
                            <div className="px-1 mb-2">
                                <h2 className="text-[22px] font-bold text-black tracking-[-0.4px] leading-tight">{g.label}</h2>
                                <p className="text-[13px] text-black/40 -mt-0.5">{g.sub}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-[3px] rounded-[16px] overflow-hidden">
                                {g.items.map((idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setViewer(idx)}
                                        className="aspect-square overflow-hidden bg-black/5 active:opacity-80 transition-opacity"
                                    >
                                        <img src={photos[idx].replace('/images/gallery/', '/images/gallery/thumbnails/')} alt="" loading="lazy" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 0 && (
                /* Years — one big hero card per year */
                <div className="px-4 space-y-5" style={{ paddingBottom: '26px' }}>
                    <div>
                        <div className="px-1 mb-2">
                            <h2 className="text-[26px] font-bold text-black tracking-[-0.5px] leading-tight">2026</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => setViewer(0)}
                            className="relative block w-full aspect-[4/3] rounded-[20px] overflow-hidden bg-black/5 active:opacity-90 transition-opacity"
                        >
                            <img src={photos[0].replace('/images/gallery/', '/images/gallery/thumbnails/')} alt="" loading="lazy" className="w-full h-full object-cover" />
                            <div
                                className="absolute inset-x-0 bottom-0 h-1/2"
                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)' }}
                            />
                            <div className="absolute left-4 bottom-3 text-white text-left">
                                <p className="text-[19px] font-bold leading-tight">June</p>
                                <p className="text-[13px] text-white/80">{photos.length} photos</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* ----- Full-screen viewer — portaled to <body> so it's a true top-level
                overlay: above the app frame's status bar + home bar, fixed to the
                viewport, and outside the scroll container (so nothing drifts). ----- */}
            {viewer !== null && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[120] flex flex-col overflow-hidden"
                    style={{ background: '#000', animation: 'photosViewerIn .28s cubic-bezier(.32,.72,0,1) both' }}
                    onClick={() => setViewer(null)}
                    /* Keep photo swipes inside the viewer — don't let them bubble to
                       the app-frame's swipe-to-dismiss gesture (which would drag the
                       whole window aside and expose the wallpaper, esp. on the last photo). */
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                >
                    {/* Blurred, darkened, scaled-up copy of the current photo as an
                        immersive backdrop (Apple now-playing style). Keyed so it
                        crossfades whenever the photo changes. */}
                    <img
                        key={`bg-${viewer}`}
                        src={photos[viewer]}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                        style={{
                            transform: 'scale(1.6)',
                            filter: 'blur(40px) saturate(1.4) brightness(0.85)',
                            animation: 'photoBackdropFade .5s ease-out both',
                        }}
                    />
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.42)' }} />

                    <div
                        className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-3 pt-11 pb-2"
                        style={{
                            background: 'rgba(20,20,22,0.45)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setViewer(null); }}
                            className="flex items-center text-[#0a84ff] active:opacity-50 transition-opacity"
                        >
                            <svg width="13" height="22" viewBox="0 0 13 22" fill="none" className="mr-1">
                                <path d="M11 2 2 11l9 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-[17px]">Photos</span>
                        </button>
                        <div className="text-center leading-tight">
                            <p className="text-[13px] text-white/95 font-semibold">{dateFor(viewer)}</p>
                            <p className="text-[11px] text-white/55">{viewer + 1} of {photos.length}</p>
                        </div>
                        <span className="w-[74px]" />
                    </div>

                    <div
                        className="relative z-10 flex-1 flex items-center justify-center px-2 overscroll-none"
                        style={{ touchAction: 'pan-y' }}
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={dragStart}
                        onTouchMove={dragMove}
                        onTouchEnd={dragEnd}
                        onMouseDown={dragStart}
                        onMouseMove={(e) => { if (swipe.current && swipe.current.active) dragMove(e); }}
                        onMouseUp={dragEnd}
                        onMouseLeave={(e) => { if (swipe.current && swipe.current.active) dragEnd(e); }}
                    >
                        <img
                            key={`img-${viewer}`}
                            src={photos[viewer]}
                            alt=""
                            draggable="false"
                            className="max-w-full max-h-full object-contain select-none"
                            style={{
                                transform: `translateX(${drag}px)`,
                                transition: dragging ? 'none' : 'transform .32s cubic-bezier(.32,.72,0,1)',
                                animation: dragging ? 'none' : `${slideDir < 0 ? 'photoSlideFromLeft' : 'photoSlideFromRight'} .3s cubic-bezier(.32,.72,0,1) both`,
                            }}
                        />
                    </div>

                    <div
                        ref={filmRef}
                        className="relative z-20 flex items-center gap-[6px] px-4 pt-2 pb-7 overflow-x-auto ios-scroll"
                        style={{
                            background: 'rgba(20,20,22,0.45)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {photos.map((src, i) => {
                            const active = i === viewer;
                            return (
                                <button
                                    key={i}
                                    data-thumb={i}
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); goTo(i); }}
                                    className="shrink-0 overflow-hidden rounded-[7px] bg-white/10"
                                    style={{
                                        width: active ? '48px' : '38px',
                                        height: active ? '48px' : '38px',
                                        boxShadow: active ? '0 0 0 2px #fff' : '0 0 0 1px rgba(255,255,255,0.18)',
                                        opacity: active ? 1 : 0.6,
                                        transition: 'width .22s ease, height .22s ease, opacity .22s ease, box-shadow .22s ease',
                                    }}
                                >
                                    <img src={src} alt="" loading="lazy" draggable="false" className="w-full h-full object-cover" />
                                </button>
                            );
                        })}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

/* ---------- App shell with iOS swipe gestures ---------- */

export default function AppWrapper({ appId, onClose, params, onOpenApp, onSwitcher }) {
    const wallpaper = useWallpaper();
    const [entered, setEntered] = useState(false);
    const [dragX, setDragX] = useState(0);
    const [homeX, setHomeX] = useState(0);   // slight horizontal follow during the home gesture
    const [homeProg, setHomeProg] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [closing, setClosing] = useState(null); // 'left' | 'right' | 'home'

    const g = useRef(null);
    const dragXRef = useRef(0);
    const homeProgRef = useRef(0);
    const pauseTimer = useRef(null);
    const switcherFired = useRef(false);

    const clearPause = () => { if (pauseTimer.current) { clearTimeout(pauseTimer.current); pauseTimer.current = null; } };
    useEffect(() => () => clearPause(), []);

    const resetGesture = () => {
        clearPause();
        g.current = null;
        dragXRef.current = 0;
        homeProgRef.current = 0;
        setDragging(false);
        setDragX(0);
        setHomeX(0);
        setHomeProg(0);
    };

    const fireSwitcher = () => {
        if (switcherFired.current || !onSwitcher) return;
        switcherFired.current = true;
        haptic('medium');
        resetGesture();
        onSwitcher();
        setTimeout(() => { switcherFired.current = false; }, 400);
    };

    useEffect(() => {
        const t = setTimeout(() => setEntered(true), 460);
        return () => clearTimeout(t);
    }, []);

    const closeSlide = (dir) => { haptic('light'); setClosing(dir); setTimeout(onClose, 300); };
    const closeHome = () => { haptic('light'); setClosing('home'); setTimeout(onClose, 300); };

    const onStart = (e) => {
        const x = e.touches[0].clientX, y = e.touches[0].clientY;
        const w = window.innerWidth, h = window.innerHeight;
        clearPause();
        g.current = {
            x, y, mode: null,
            edge: x < 30 ? 'left' : x > w - 30 ? 'right' : null,
            bottom: y > h - 80,
            lastX: x, lastY: y, h,
        };
    };
    const onMove = (e) => {
        const s = g.current;
        if (!s || closing) return;
        const ddx = e.touches[0].clientX - s.x;
        const ddy = e.touches[0].clientY - s.y;
        if (!s.mode) {
            if (s.edge && Math.abs(ddx) > 14 && Math.abs(ddx) > Math.abs(ddy)) s.mode = 'h';
            else if (s.bottom && ddy < -14 && Math.abs(ddy) > Math.abs(ddx)) s.mode = 'home';
            else if (Math.abs(ddx) > 12 || Math.abs(ddy) > 12) s.mode = 'ignore';
        }
        if (s.mode === 'h') {
            const v = s.edge === 'left' ? Math.max(0, ddx) : Math.min(0, ddx);
            dragXRef.current = v;
            setDragX(v);
            setDragging(true);
        } else if (s.mode === 'home') {
            const prog = Math.max(0, Math.min(1, -ddy / 170));
            homeProgRef.current = prog;
            setHomeProg(prog);
            setHomeX(ddx * 0.3);
            setDragging(true);

            if (onSwitcher) {
                const cx = e.touches[0].clientX, cy = e.touches[0].clientY;
                /* Dragged more than ~45% of the screen → switcher right away */
                if (-ddy > s.h * 0.45) { fireSwitcher(); return; }
                /* Otherwise: pause (finger nearly still for ~160ms) after ≥60px */
                const moved = Math.abs(cx - s.lastX) > 4 || Math.abs(cy - s.lastY) > 4;
                if (moved) {
                    s.lastX = cx; s.lastY = cy;
                    clearPause();
                    if (-ddy >= 60) pauseTimer.current = setTimeout(fireSwitcher, 160);
                } else if (-ddy >= 60 && !pauseTimer.current) {
                    pauseTimer.current = setTimeout(fireSwitcher, 160);
                }
            }
        }
    };
    const onEnd = () => {
        const s = g.current;
        clearPause();
        g.current = null;
        setDragging(false);
        if (s && s.mode === 'h') {
            if (Math.abs(dragXRef.current) > 95) { closeSlide(dragXRef.current > 0 ? 'right' : 'left'); return; }
        } else if (s && s.mode === 'home') {
            if (homeProgRef.current > 0.32) { closeHome(); return; }
        }
        dragXRef.current = 0;
        homeProgRef.current = 0;
        setDragX(0);
        setHomeX(0);
        setHomeProg(0);
    };

    const renderContent = () => {
        if (PORTFOLIO_SECTIONS.has(appId)) return <div className="h-full overflow-y-auto ios-scroll"><Portfolio section={appId} /></div>;
        switch (appId) {
            case 'portfolio': return <div className="h-full overflow-y-auto ios-scroll"><PortfolioApp /></div>;
            case 'mail': return <div className="h-full"><MailApp /></div>;
            case 'camera': return <div className="h-full"><CameraApp onOpenPhotos={(i) => onOpenApp && onOpenApp('photos', { photo: i })} /></div>;
            case 'games': return <div className="h-full"><GamesApp /></div>;
            case 'calendar': return <div className="h-full"><CalendarApp /></div>;
            case 'weather': return <div className="h-full"><WeatherApp /></div>;
            case 'varshion': return <div className="h-full bg-white"><Varshion /></div>;
            case 'safari': return <div className="h-full bg-white"><Safari /></div>;
            case 'phone': return <div className="h-full overflow-y-auto ios-scroll"><ContactCard /></div>;
            case 'photos': return <div className="h-full overflow-y-auto ios-scroll"><PhotosApp initialPhoto={params?.photo ?? null} /></div>;
            case 'settings': return <div className="h-full overflow-hidden"><SettingsApp onOpenApp={(id) => onOpenApp && onOpenApp(id)} /></div>;
            case 'timer': return <div className="h-full overflow-hidden bg-black"><TimerApp /></div>;
            default: return (
                <div className="flex flex-col items-center justify-center bg-[#f2f2f7] h-full ios-font">
                    <h1 className="text-2xl font-bold text-black capitalize">{appId}</h1>
                    <p className="text-black/40 mt-2">Coming soon.</p>
                </div>
            );
        }
    };

    const surface = APP_SURFACE[appId] || '#f2f2f7';
    const lightStatus = LIGHT_STATUS.has(appId);
    const fullBleed = FULL_BLEED.has(appId);

    let transform = 'none', opacity = 1, radius = '0px';
    if (closing === 'left') { transform = 'translateX(-115%)'; opacity = 0; radius = '32px'; }
    else if (closing === 'right') { transform = 'translateX(115%)'; opacity = 0; radius = '32px'; }
    else if (closing === 'home') { transform = 'scale(0.82) translateY(10px)'; opacity = 0; radius = '46px'; }
    else if (dragX !== 0) { transform = `translateX(${dragX}px)`; opacity = Math.max(0, 1 - Math.abs(dragX) / 520); radius = '32px'; }
    else if (homeProg > 0) { transform = `translateX(${homeX}px) scale(${1 - homeProg * 0.12}) translateY(${homeProg * 6}px)`; opacity = 1 - homeProg * 0.45; radius = `${homeProg * 46}px`; }

    return (
        <div
            className={`absolute inset-0 z-[60] flex flex-col overflow-hidden ios-font ${!entered ? 'animate-ios-app-open' : ''}`}
            style={{
                transform, opacity, borderRadius: radius,
                transition: dragging ? 'none' : 'transform 0.32s cubic-bezier(0.32,0.72,0,1), opacity 0.32s ease, border-radius 0.32s ease',
                transformOrigin: 'center center',
            }}
            onTouchStart={onStart}
            onTouchMove={onMove}
            onTouchEnd={onEnd}
        >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${wallpaper})`, filter: 'blur(24px)', transform: 'scale(1.15)' }} />
            <div className="absolute inset-0 bg-black/35" />

            {/* App window — like a real iPhone screen: status bar on top, the app
                edge-to-edge below it, and a thin floating home indicator. */}
            <div className="relative flex flex-col w-full h-full overflow-hidden shadow-2xl" style={{ background: surface }}>
                {/* Real iOS status bar (time · dynamic island · battery). Full-bleed
                    apps run their content under it; others get a matching strip. */}
                {!fullBleed && <div className="h-11 flex-shrink-0" />}

                <div className="flex-1 min-h-0 overflow-hidden">{renderContent()}</div>

                {/* Full-bleed apps run content under the bars, so pin a frosted
                    scrim top + bottom to keep the status bar + home indicator
                    locked and legible while photos scroll beneath them. */}
                {fullBleed && (
                    <>
                        <div
                            className="absolute top-0 inset-x-0 z-40 pointer-events-none"
                            style={{
                                height: 60,
                                background: lightStatus
                                    ? 'linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0))'
                                    : 'linear-gradient(to bottom, rgba(255,255,255,0.92), rgba(255,255,255,0))',
                                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                                maskImage: 'linear-gradient(to bottom, black 58%, transparent)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black 58%, transparent)',
                            }}
                        />
                        <div
                            className="absolute bottom-0 inset-x-0 z-[15] pointer-events-none"
                            style={{
                                height: 40,
                                background: lightStatus
                                    ? 'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0))'
                                    : 'linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0))',
                                backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                                maskImage: 'linear-gradient(to top, black 45%, transparent)',
                                WebkitMaskImage: 'linear-gradient(to top, black 45%, transparent)',
                            }}
                        />
                    </>
                )}

                <StatusBar dark={!lightStatus} />

                {/* Thin floating home indicator — tap or swipe up to go home.
                    Wrapper ignores pointer events so it never blocks app controls. */}
                <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center pointer-events-none">
                    <button
                        onClick={onClose}
                        aria-label="Home"
                        className="pointer-events-auto py-1.5 px-12 active:opacity-60 transition-opacity"
                    >
                        <div className={`w-[132px] h-[5px] rounded-full ${lightStatus ? 'bg-white/55' : 'bg-black/30'}`} />
                    </button>
                </div>
            </div>

            {dragX !== 0 && (
                <div
                    className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none"
                    style={{ [dragX > 0 ? 'left' : 'right']: 12, opacity: Math.min(1, Math.abs(dragX) / 90) }}
                >
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                        <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d={dragX > 0 ? 'M15.4 7.4 14 6l-6 6 6 6 1.4-1.4-4.6-4.6 4.6-4.6Z' : 'M8.6 7.4 10 6l6 6-6 6-1.4-1.4 4.6-4.6-4.6-4.6Z'} /></svg>
                    </div>
                </div>
            )}
        </div>
    );
}
