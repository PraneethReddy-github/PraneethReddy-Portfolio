/*
 * Tiny global "system" store for the iOS shell.
 * ------------------------------------------------
 * One place for state that several surfaces care about (wallpaper, haptics,
 * reduce-motion, flashlight, now-playing, timer live activity, dark mode…).
 * Framework-free (plain subscribers) with a React hook built on
 * useSyncExternalStore so any component can read a slice without prop drilling.
 *
 *   import { useSystem, setSystem, getSystem } from './system';
 *   const wallpaper = useSystem((s) => s.wallpaper);
 *   setSystem({ flashlight: true });
 *   setSystem((s) => ({ media: { ...s.media, playing: true } }));
 */
import { useSyncExternalStore } from 'react';

export const WALLPAPERS = [
    { id: 'iphone', name: 'Default',  src: '/images/wallpapers/iphone.jpg' },
    { id: 'w1',     name: 'Aurora',   src: '/images/wallpapers/wall-1.webp' },
    { id: 'w2',     name: 'Dusk',     src: '/images/wallpapers/wall-2.webp' },
    { id: 'w3',     name: 'Bloom',    src: '/images/wallpapers/wall-3.webp' },
    { id: 'w4',     name: 'Mist',     src: '/images/wallpapers/wall-4.webp' },
    { id: 'w5',     name: 'Ember',    src: '/images/wallpapers/wall-5.webp' },
    { id: 'w6',     name: 'Tide',     src: '/images/wallpapers/wall-6.webp' },
    { id: 'w7',     name: 'Nebula',   src: '/images/wallpapers/wall-7.webp' },
    { id: 'w8',     name: 'Glacier',  src: '/images/wallpapers/wall-8.webp' },
    { id: 'w9',     name: 'Prism',    src: '/images/wallpapers/wall-9.png' },
    { id: 'w10',    name: 'Horizon',  src: '/images/wallpapers/wall-10.png' },
];

const PERSIST_KEY = 'ios_system_v1';
/* Only these keys are written to localStorage */
const PERSISTED = ['wallpaper', 'haptics', 'reduceMotion', 'textSize', 'trueTone', 'homeHidden'];

const DEFAULTS = {
    wallpaper: 'iphone',      // id from WALLPAPERS
    haptics: true,
    reduceMotion: false,
    textSize: 1,              // 0.9 | 1 | 1.1 | 1.2 — multiplier applied via CSS var
    trueTone: false,
    homeHidden: [],           // app ids removed from the home grid via the context menu

    flashlight: false,        // screen-flash overlay (lock screen + control center)
    lowPower: false,

    /* Now-playing — published by the shared media player (media.js) */
    media: { playing: false, title: "God's Plan", artist: 'Drake · Scorpion', cover: '/images/logos/song-cover.png', progress: 0, cur: 0, dur: 0 },

    /* Timer live activity — published by TimerApp (phase: idle|running|paused|done) */
    timer: { phase: 'idle', remaining: 0, total: 0, endsAt: null },

    /* Stopwatch live activity */
    stopwatch: { running: false, elapsed: 0 },

    /* Transient toast/banner requests: { id, app, icon, color, title, body, appId } */
    banner: null,
    islandExpanded: null,     // 'music' | 'timer' | null — published by StatusBar
};

function loadPersisted() {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem(PERSIST_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
}

let state = { ...DEFAULTS, ...loadPersisted() };
const listeners = new Set();

export function getSystem() { return state; }

export function setSystem(patch) {
    const next = typeof patch === 'function' ? patch(state) : patch;
    if (!next) return;
    state = { ...state, ...next };
    if (typeof window !== 'undefined' && PERSISTED.some((k) => k in next)) {
        try {
            const out = {};
            PERSISTED.forEach((k) => { out[k] = state[k]; });
            localStorage.setItem(PERSIST_KEY, JSON.stringify(out));
        } catch {}
    }
    listeners.forEach((l) => l(state));
}

export function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

const identity = (s) => s;
/* Read a slice of the store. Selector must return a stable/primitive value or
   the same object reference when nothing changed (slices are replaced wholesale). */
export function useSystem(selector = identity) {
    return useSyncExternalStore(
        subscribe,
        () => selector(state),
        () => selector({ ...DEFAULTS }),   // server snapshot
    );
}

export function wallpaperSrc(id = state.wallpaper) {
    return (WALLPAPERS.find((w) => w.id === id) || WALLPAPERS[0]).src;
}
export function useWallpaper() {
    const id = useSystem((s) => s.wallpaper);
    return wallpaperSrc(id);
}

/* Fire a transient notification banner (rendered by NotificationBanner in index.js) */
let bannerSeq = 0;
export function showBanner(b) {
    setSystem({ banner: { id: ++bannerSeq, ...b } });
}
export function clearBanner() { setSystem({ banner: null }); }
