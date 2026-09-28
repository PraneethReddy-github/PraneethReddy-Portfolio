/*
 * Shared "Now Playing" media player — a single module-level HTMLAudio for
 * /audio/song.mp3 so the home-screen widget, Control Center and the Dynamic
 * Island all drive the SAME playback and read the SAME state via the system
 * store (`system.media`). If the audio file can't play, a tiny synthesised
 * WebAudio loop takes over so the button always does something.
 */
import { getSystem, setSystem, useSystem } from './system';

const SRC = '/audio/song.mp3';
const TRACK = { title: "God's Plan", artist: 'Drake · Scorpion', cover: '/images/logos/song-cover.png' };

/* ---- synth fallback ---- */
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
const PATTERN = [0, 2, 4, 5, 4, 2, 3, 1, 0, 2, 4, 5, 4, 5, 3, 2];
const BASS = [130.81, 130.81, 174.61, 196.0];
const BEAT_MS = 300;
const SYNTH_LEN = 60; // pretend duration (s) for progress

let audio = null;
let ctx = null, master = null, synthTimer = null, synthStep = 0, synthStart = 0, synthProgTimer = null;
let usingSynth = false;
let fileBroken = false;
let lastPublish = 0;

function publish(extra = {}) {
    const prev = getSystem().media;
    const a = audio;
    const cur = usingSynth ? (Date.now() - synthStart) / 1000 : (a ? a.currentTime : 0);
    const dur = usingSynth ? SYNTH_LEN : (a && a.duration && isFinite(a.duration) ? a.duration : 0);
    setSystem({
        media: {
            ...prev,
            ...TRACK,
            cur,
            dur,
            progress: dur ? Math.min(100, (cur / dur) * 100) : 0,
            ...extra,
        },
    });
}

function ensureAudio() {
    if (audio || typeof window === 'undefined') return audio;
    audio = new Audio(SRC);
    audio.preload = 'metadata';
    audio.addEventListener('loadedmetadata', () => publish());
    audio.addEventListener('timeupdate', () => {
        const now = Date.now();
        if (now - lastPublish < 250) return;
        lastPublish = now;
        publish();
    });
    audio.addEventListener('play', () => publish({ playing: true }));
    audio.addEventListener('pause', () => publish({ playing: false }));
    audio.addEventListener('ended', () => { audio.currentTime = 0; publish({ playing: false, cur: 0, progress: 0 }); });
    audio.addEventListener('error', () => { fileBroken = true; });
    return audio;
}

/* ---- synth ---- */
function ensureCtx() {
    if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.0001;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1400;
        master.connect(filter); filter.connect(ctx.destination);
    }
    return ctx;
}
function blip(freq, when, dur, vol, type = 'sine') {
    const osc = ctx.createOscillator(); osc.type = type; osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(vol, when + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(g); g.connect(master);
    osc.start(when); osc.stop(when + dur + 0.05);
}
function startSynth() {
    ensureCtx();
    if (ctx.state === 'suspended') ctx.resume();
    usingSynth = true;
    synthStart = Date.now();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.4);
    const tick = () => {
        const step = synthStep % PATTERN.length;
        const t = ctx.currentTime + 0.02;
        blip(SCALE[PATTERN[step]], t, 0.45, 0.22, 'triangle');
        if (step % 4 === 0) blip(BASS[(step / 4) % BASS.length], t, 0.9, 0.18, 'sine');
        synthStep = step + 1;
    };
    tick();
    synthTimer = setInterval(tick, BEAT_MS);
    synthProgTimer = setInterval(() => {
        if ((Date.now() - synthStart) / 1000 >= SYNTH_LEN) { stopSynth(false); publish({ playing: false, cur: 0, progress: 0 }); return; }
        publish();
    }, 250);
    publish({ playing: true });
}
function stopSynth(immediate) {
    if (synthTimer) { clearInterval(synthTimer); synthTimer = null; }
    if (synthProgTimer) { clearInterval(synthProgTimer); synthProgTimer = null; }
    if (ctx && master) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + (immediate ? 0.01 : 0.25));
    }
    usingSynth = false;
}

/* ---- public API ---- */
export function isPlaying() { return !!getSystem().media.playing; }

export async function play() {
    if (typeof window === 'undefined') return;
    if (isPlaying()) return;
    if (!fileBroken) {
        const a = ensureAudio();
        try { await a.play(); return; } catch { fileBroken = true; }
    }
    startSynth();
}

export function pause() {
    if (usingSynth) { stopSynth(false); publish({ playing: false }); return; }
    if (audio) audio.pause();
}

export function toggle() { return isPlaying() ? pause() : play(); }

export function seek(fraction) {
    const f = Math.max(0, Math.min(1, fraction || 0));
    if (usingSynth) { synthStart = Date.now() - f * SYNTH_LEN * 1000; publish(); return; }
    const a = ensureAudio();
    if (a && a.duration && isFinite(a.duration)) { a.currentTime = f * a.duration; publish(); }
}

export function restart() { seek(0); }
export function skip() { seek(0); }

export function useMedia() { return useSystem((s) => s.media); }

export const track = TRACK;
