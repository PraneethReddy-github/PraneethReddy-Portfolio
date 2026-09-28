import React, { useState, useRef, useEffect, useMemo } from 'react';
import StatusBar from './StatusBar';
import Dock, { DOCK_APPS } from './Dock';
import AppWrapper from './AppWrapper';
import AppLibrary, { ALL_APPS } from './AppLibrary';
import AppSwitcher from './AppSwitcher';
import Spotlight from './Spotlight';
import ContextMenu, { defaultActionsFor } from './ContextMenu';
import useLongPress from './useLongPress';
import { SongWidget, CalendarWidget, WeatherWidget } from './Widgets';
import { useSystem, setSystem, useWallpaper } from './system';
import { haptic } from './haptics';
import {
    AboutMeIcon, CameraIcon, PhotosIcon,
    GitHubIcon, LinkedInIcon, SettingsIcon,
} from './Icons';

const HOME_APPS = [
    { id: 'portfolio', name: 'About Me', Icon: AboutMeIcon },
    { id: 'camera', name: 'Camera', Icon: CameraIcon },
    { id: 'photos', name: 'Photos', Icon: PhotosIcon },
    { id: 'settings', name: 'Settings', Icon: SettingsIcon },
    { id: 'github', name: 'GitHub', Icon: GitHubIcon },
    { id: 'linkedin', name: 'LinkedIn', Icon: LinkedInIcon },
];

const OPEN_EXTERNAL = {
    github: 'https://github.com/PraneethReddy-github',
    linkedin: 'https://www.linkedin.com/in/connectwithpraneeth/',
};

/* Every app the shell knows about, by id — used to build the recents list
   for the app switcher and to resolve context-menu targets. */
const APP_LOOKUP = (() => {
    const map = {};
    [...ALL_APPS, ...HOME_APPS, ...DOCK_APPS].forEach((a) => { if (!map[a.id]) map[a.id] = a; });
    return map;
})();

const PULL_THRESHOLD = 82; // px of pull-down needed to summon Spotlight

/* A single home-screen icon with long-press support */
function HomeIcon({ app, index, onOpen, onLongPress, jiggle }) {
    const lp = useLongPress({
        onLongPress: (e, rect) => onLongPress(app, rect),
        onClick: () => onOpen(app.id),
    });
    return (
        <div
            className="flex flex-col items-center animate-ios-icon-pop"
            style={{ animationDelay: `${index * 28}ms` }}
        >
            <div
                {...lp.handlers}
                style={lp.style}
                className={`ios-tap cursor-pointer ${jiggle ? 'ios-jiggle' : ''}`}
            >
                <app.Icon />
            </div>
            <span className="text-white text-[11px] mt-1.5 font-medium drop-shadow-md select-none text-center leading-tight max-w-[72px] truncate">
                {app.name}
            </span>
        </div>
    );
}

export default function HomeScreen({ onLock, initialApp = null, openRequest = null, onRequestHandled }) {
    const [openApp, setOpenApp] = useState(initialApp);
    const [appParams, setAppParams] = useState(null); // optional deep-link data (e.g. Camera → Photos)
    const [progress, setProgress] = useState(0);      // 0 = home, 1 = app library (continuous)
    const [recents, setRecents] = useState(() => (initialApp && APP_LOOKUP[initialApp] ? [APP_LOOKUP[initialApp]] : []));
    const [switcher, setSwitcher] = useState(false);
    const [spotlight, setSpotlight] = useState(false);
    const [menu, setMenu] = useState(null);            // { app, anchor }
    const [pull, setPull] = useState(0);               // live pull-down distance on the home page
    const pagerRef = useRef(null);
    const pageRef = useRef(null);
    const pullRef = useRef(null);                      // { y, scrollTop, active }
    const homeBarRef = useRef(null);                   // { y, fired }

    const wallpaper = useWallpaper();
    const hidden = useSystem((s) => s.homeHidden);
    const hiddenSet = useMemo(() => new Set(hidden || []), [hidden]);
    const apps = HOME_APPS.filter((a) => !hiddenSet.has(a.id));

    /* Open an app and remember it for the switcher */
    const openAppWith = (id, params = null) => {
        const meta = APP_LOOKUP[id];
        if (meta) setRecents((r) => [meta, ...r.filter((a) => a.id !== id)].slice(0, 8));
        setAppParams(params);
        setOpenApp(id);
    };

    const handleAppClick = (id) => {
        haptic('light');
        if (OPEN_EXTERNAL[id]) window.open(OPEN_EXTERNAL[id], '_blank');
        else openAppWith(id);
    };

    /* ── Long-press → context menu ── */
    const showMenu = (app, rect) => setMenu({ app, anchor: rect });
    const menuActions = menu
        ? defaultActionsFor(menu.app, {
            open: (id) => handleAppClick(id),
            openExternal: (url) => window.open(url, '_blank'),
            remove: HOME_APPS.some((a) => a.id === menu.app.id)
                ? (id) => {
                    haptic('medium');
                    setSystem((s) => ({ homeHidden: [...new Set([...(s.homeHidden || []), id])] }));
                }
                : undefined,
        })
        : [];

    /* ── Pull-down on the home page → Spotlight ── */
    const onPullStart = (e) => {
        const el = pageRef.current;
        if (!el || openApp || spotlight) return;
        pullRef.current = { y: e.touches[0].clientY, x: e.touches[0].clientX, scrollTop: el.scrollTop, active: el.scrollTop <= 0 };
    };
    const onPullMove = (e) => {
        const p = pullRef.current;
        if (!p || !p.active) return;
        const dy = e.touches[0].clientY - p.y;
        const dx = Math.abs(e.touches[0].clientX - p.x);
        if (dy <= 0 || dx > dy) { if (pull) setPull(0); return; }
        /* Ignore drags that start at the very top edge — those belong to the
           notification / control center gestures owned by the shell. */
        if (p.y < 44) return;
        const eased = Math.min(PULL_THRESHOLD * 1.4, dy * 0.55);
        setPull(eased);
    };
    const onPullEnd = () => {
        const p = pullRef.current;
        pullRef.current = null;
        if (!p) return;
        if (pull >= PULL_THRESHOLD * 0.75) {
            haptic('medium');
            setSpotlight(true);
        }
        setPull(0);
    };

    /* ── Home indicator: swipe up from the bottom edge → app switcher ── */
    const onHomeBarStart = (e) => { homeBarRef.current = { y: e.touches[0].clientY, fired: false }; };
    const onHomeBarMove = (e) => {
        const h = homeBarRef.current;
        if (!h || h.fired) return;
        if (h.y - e.touches[0].clientY > 55) {
            h.fired = true;
            haptic('medium');
            setSwitcher(true);
        }
    };
    const onHomeBarEnd = () => { homeBarRef.current = null; };

    const onPagerScroll = (e) => {
        const el = e.currentTarget;
        setProgress(Math.max(0, Math.min(1, el.scrollLeft / el.clientWidth)));
    };

    /* Apps requested by the shell (control center tiles, notification taps,
       banners) route through here so they land in the recents list too. */
    useEffect(() => {
        if (!openRequest || !openRequest.id) return;
        setSpotlight(false); setSwitcher(false); setMenu(null);
        openAppWith(openRequest.id, openRequest.params || null);
        if (onRequestHandled) onRequestHandled();
    }, [openRequest]); // eslint-disable-line react-hooks/exhaustive-deps

    /* Keyboard shortcut for desktop testers: ⌘/Ctrl+K opens Spotlight */
    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSpotlight((v) => !v); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const pullProg = Math.min(1, pull / PULL_THRESHOLD);

    return (
        <div className="w-full h-full relative overflow-hidden ios-font">
            <div
                className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-500"
                style={{
                    backgroundImage: `url(${wallpaper})`,
                    animation: 'ios-wallpaper-breathe 18s ease-in-out infinite',
                    filter: spotlight || switcher ? 'blur(6px)' : 'none',
                    transition: 'filter 0.3s ease',
                }}
            />

            <StatusBar />

            {/* Frosted top scrim — content blurs/fades as it scrolls up under the
                time + island + controls. */}
            <div
                className="absolute top-0 left-0 right-0 h-[68px] z-40 pointer-events-none"
                style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.22), rgba(0,0,0,0))',
                    maskImage: 'linear-gradient(to bottom, black 0%, black 42%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 42%, transparent 100%)',
                }}
            />

            {/* Pull-down indicator (Spotlight) */}
            <div
                className="absolute left-0 right-0 top-[58px] z-30 flex justify-center pointer-events-none"
                style={{ opacity: pullProg, transform: `translateY(${pull * 0.35}px) scale(${0.6 + pullProg * 0.4})`, transition: pull ? 'none' : 'opacity 0.2s, transform 0.2s' }}
            >
                <div className="w-9 h-9 rounded-full bg-black/35 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg">
                    <svg className="w-[18px] h-[18px] fill-white" viewBox="0 0 24 24" style={{ transform: `rotate(${pullProg * 90}deg)` }}>
                        <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.49 4.49 0 0 1 9.5 14z" />
                    </svg>
                </div>
            </div>

            <div
                ref={pagerRef}
                onScroll={onPagerScroll}
                className="flex h-full w-full overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden"
                style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
            >
                <div
                    ref={pageRef}
                    className="w-full h-full flex-shrink-0 overflow-y-auto ios-scroll pt-16 px-5 pb-32"
                    style={{
                        scrollSnapAlign: 'start',
                        transform: `translateY(${pull}px)`,
                        transition: pull ? 'none' : 'transform 0.35s var(--ios-spring)',
                    }}
                    onTouchStart={onPullStart}
                    onTouchMove={onPullMove}
                    onTouchEnd={onPullEnd}
                    onTouchCancel={onPullEnd}
                >
                    <div className="grid grid-cols-2 gap-3 mb-3 animate-ios-rise">
                        <CalendarWidget onOpen={openAppWith} />
                        <WeatherWidget onOpen={openAppWith} />
                    </div>

                    <div className="mb-6 animate-ios-rise" style={{ animationDelay: '60ms' }}>
                        <SongWidget />
                    </div>

                    <div className="grid grid-cols-3 gap-x-4 gap-y-5">
                        {apps.map((app, i) => (
                            <HomeIcon
                                key={app.id}
                                app={app}
                                index={i}
                                onOpen={handleAppClick}
                                onLongPress={showMenu}
                                jiggle={menu && menu.app.id === app.id}
                            />
                        ))}
                    </div>

                    {hiddenSet.size > 0 && (
                        <button
                            onClick={() => { haptic('selection'); setSystem({ homeHidden: [] }); }}
                            className="mt-8 mx-auto block text-[12px] font-medium text-white/60 bg-white/10 backdrop-blur-xl border border-white/15 rounded-full px-3.5 py-1.5 active:bg-white/20 transition-colors"
                        >
                            Restore {hiddenSet.size} hidden app{hiddenSet.size > 1 ? 's' : ''}
                        </button>
                    )}
                </div>

                <div
                    className="w-full h-full flex-shrink-0 overflow-y-auto ios-scroll"
                    style={{ scrollSnapAlign: 'start' }}
                >
                    <AppLibrary onAppClick={handleAppClick} />
                </div>
            </div>

            <div
                className="absolute bottom-[122px] left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none"
                style={{ opacity: 1 - progress }}
            >
                {[0, 1].map((i) => (
                    <div
                        key={i}
                        className="w-[7px] h-[7px] rounded-full"
                        style={{ background: i === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)' }}
                    />
                ))}
            </div>

            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ transform: `translateX(${-progress * 100}%)` }}
            >
                <div className="pointer-events-auto">
                    <Dock
                        onOpenApp={openAppWith}
                        onLongPress={showMenu}
                        activeIds={recents.slice(0, 4).map((a) => a.id)}
                    />
                </div>
            </div>

            {/* Home indicator — swipe up (or tap) to open the app switcher */}
            <div
                className="absolute inset-x-0 bottom-0 z-20 flex justify-center items-end"
                style={{ height: 26, touchAction: 'none' }}
                onTouchStart={onHomeBarStart}
                onTouchMove={onHomeBarMove}
                onTouchEnd={onHomeBarEnd}
                onTouchCancel={onHomeBarEnd}
                onClick={() => { if (recents.length) { haptic('light'); setSwitcher(true); } }}
                aria-label="App switcher"
            >
                <div className="w-[134px] h-[5px] rounded-full bg-white/80 mb-[7px] shadow-[0_0_6px_rgba(0,0,0,0.35)]" />
            </div>

            {spotlight && (
                <Spotlight
                    onOpenApp={(id, params) => {
                        if (OPEN_EXTERNAL[id]) window.open(OPEN_EXTERNAL[id], '_blank');
                        else openAppWith(id, params);
                    }}
                    onClose={() => setSpotlight(false)}
                />
            )}

            {menu && (
                <ContextMenu
                    anchor={menu.anchor}
                    app={menu.app}
                    actions={menuActions}
                    onClose={() => setMenu(null)}
                />
            )}

            {openApp && (
                <AppWrapper
                    key={openApp}
                    appId={openApp}
                    params={appParams}
                    onOpenApp={openAppWith}
                    onSwitcher={() => setSwitcher(true)}
                    onClose={() => { setOpenApp(null); setAppParams(null); }}
                />
            )}

            {switcher && (
                <AppSwitcher
                    apps={recents}
                    activeId={openApp}
                    onSelect={(id) => { setSwitcher(false); openAppWith(id); }}
                    onKill={(id) => {
                        setRecents((r) => r.filter((a) => a.id !== id));
                        if (id === openApp) { setOpenApp(null); setAppParams(null); }
                    }}
                    onClose={() => { setSwitcher(false); setOpenApp(null); setAppParams(null); }}
                />
            )}
        </div>
    );
}
