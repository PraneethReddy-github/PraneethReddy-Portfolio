import React, { useState, useEffect } from 'react';
import { useMedia, toggle as mediaToggle, seek as mediaSeek, restart as mediaRestart } from './media';
import { haptic } from './haptics';
import { createPortal } from 'react-dom';
import useWeather from '../hooks/useWeather';
import WeatherScene, { gradientFor } from './WeatherScene';

const tile = 'aspect-square rounded-[26px] border border-white/25 shadow-xl select-none overflow-hidden';

/* ---------- Calendar (small) — opens the Calendar app ---------- */
const DOW_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function CalendarWidget({ onOpen }) {
    const [now, setNow] = useState(null);
    useEffect(() => {
        setNow(new Date());
        const t = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(t);
    }, []);
    const weekday = now ? now.toLocaleDateString('en-US', { weekday: 'long' }) : '';
    const month = now ? now.toLocaleDateString('en-US', { month: 'short' }) : '';
    const day = now ? now.getDate() : '';
    const todayDow = now ? now.getDay() : -1;

    return (
        <button
            onClick={() => onOpen && onOpen('calendar')}
            className={`${tile} relative bg-white/15 backdrop-blur-2xl flex flex-col justify-between p-4 text-left ios-tap`}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="wx-sheen absolute -inset-y-2 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12" />
            </div>

            <span className="relative z-10 text-[#ff453a] font-bold text-[11px] tracking-[0.12em] uppercase">{weekday}</span>
            <div className="relative z-10 flex flex-col">
                <span className="text-white text-[40px] leading-none font-light tracking-[-2px]">{day}</span>
                <span className="text-white/70 font-medium text-[13px] mt-0.5">{month}</span>
            </div>

            <div className="relative z-10 flex justify-between mt-2">
                {DOW_LETTERS.map((d, i) => {
                    const isToday = i === todayDow;
                    return (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <span className={`text-[8px] font-semibold ${isToday ? 'text-white' : 'text-white/40'}`}>{d}</span>
                            <span
                                className={`w-[5px] h-[5px] rounded-full ${isToday ? 'bg-[#ff453a] wx-dot-pulse' : 'bg-white/25'}`}
                            />
                        </div>
                    );
                })}
            </div>
        </button>
    );
}

/* ---------- Weather (small) — live, Bangalore. Tap to open the app ---------- */
export function WeatherWidget({ onOpen }) {
    const w = useWeather();
    return (
        <button
            onClick={() => onOpen && onOpen('weather')}
            className={`${tile} relative flex flex-col justify-between p-4 text-left ios-tap`}
            style={{ background: gradientFor(w.key, w.isDay) }}
        >
            <WeatherScene weatherKey={w.key} isDay={w.isDay} />

            <div className="relative z-10">
                <span className="text-white font-semibold text-[13px] drop-shadow truncate">{w.city}</span>
            </div>
            <div className="relative z-10 flex flex-col">
                <span className="text-white text-[40px] leading-none font-light tracking-[-2px] drop-shadow">{w.temp}°</span>
                <span className="text-white/90 font-medium text-[12px] drop-shadow truncate">{w.desc}</span>
                <span className="text-white/75 font-medium text-[11px] mt-0.5 drop-shadow">H:{w.hi}° L:{w.lo}°</span>
            </div>
        </button>
    );
}

/* ---------- Now-Playing song widget (big, full width) ----------
 * Drives the shared media player (media.js) so the widget, Control Center and
 * the Dynamic Island all stay in sync.
 */
export function SongWidget() {
    const media = useMedia();
    const { playing, progress, cur, dur, title, artist, cover } = media;
    const [expanded, setExpanded] = useState(false);

    const fmt = (s) => {
        if (!s || isNaN(s)) return '0:00';
        const m = Math.floor(s / 60);
        const ss = Math.floor(s % 60).toString().padStart(2, '0');
        return `${m}:${ss}`;
    };

    const seek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        mediaSeek(x / rect.width);
    };

    const toggle = () => { haptic('light'); mediaToggle(); };

    return (
        <>
            <div
                className="rounded-[28px] border border-white/20 shadow-2xl select-none overflow-hidden bg-black/45 backdrop-blur-2xl p-3.5 cursor-pointer"
                onClick={() => setExpanded(true)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-[70px] h-[70px] rounded-[16px] overflow-hidden flex-shrink-0 shadow-lg ring-1 ring-white/10">
                        <img src={cover} alt="cover" className="w-full h-full object-cover" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="text-white text-[17px] font-semibold truncate leading-tight">{title}</div>
                        <div className="text-white/55 text-[13px] truncate mt-0.5">{artist}</div>

                        <div className="mt-2.5 flex items-center gap-2">
                            <div
                                className="flex-1 h-[5px] rounded-full bg-white/20 relative cursor-pointer overflow-hidden"
                                onClick={(e) => { e.stopPropagation(); seek(e); }}
                                onTouchStart={(e) => { e.stopPropagation(); seek(e); }}
                                onTouchMove={(e) => { e.stopPropagation(); seek(e); }}
                            >
                                <div className="absolute left-0 top-0 h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                            {playing && (
                                <div className="flex items-end gap-[2px] h-3.5">
                                    {[0, 1, 2].map((i) => (
                                        <span key={i} className="ios-eq-bar w-[3px] h-full bg-white/80 rounded-full" style={{ animationDelay: `${i * 0.15}s` }} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); toggle(); }}
                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform shadow-lg"
                        aria-label={playing ? 'Pause' : 'Play'}
                    >
                        <PlayPauseIcon playing={playing} className="w-[22px] h-[22px] fill-black" />
                    </button>
                </div>
            </div>

            {expanded && typeof document !== 'undefined' && createPortal(
                <NowPlaying
                    playing={playing}
                    progress={progress}
                    cur={cur}
                    dur={dur}
                    title={title}
                    artist={artist}
                    cover={cover}
                    fmt={fmt}
                    onToggle={toggle}
                    onSeek={seek}
                    onRestart={() => mediaRestart()}
                    onClose={() => setExpanded(false)}
                />,
                document.body
            )}
        </>
    );
}

/* Clean rounded play / pause glyph reused by the widget and the popup */
function PlayPauseIcon({ playing, className }) {
    return playing ? (
        <svg className={className} viewBox="0 0 24 24">
            <rect x="6" y="5" width="4" height="14" rx="1.6" />
            <rect x="14" y="5" width="4" height="14" rx="1.6" />
        </svg>
    ) : (
        <svg className={className} viewBox="0 0 24 24">
            <path d="M7 6.2v11.6c0 .82.9 1.32 1.6.88l9-5.8a1.05 1.05 0 0 0 0-1.76l-9-5.8C7.9 4.88 7 5.38 7 6.2z" />
        </svg>
    );
}

/* Apple-style Now Playing popup — centered card, tap outside to dismiss */
function NowPlaying({ playing, progress, cur, dur, title, artist, cover, fmt, onToggle, onSeek, onRestart, onClose }) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const r = requestAnimationFrame(() => setShown(true));
        return () => cancelAnimationFrame(r);
    }, []);

    const close = () => {
        setShown(false);
        setTimeout(onClose, 280); // matches the exit transition duration
    };

    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center ios-font p-6"
            onClick={close}
            style={{
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: shown ? 'blur(10px)' : 'blur(0px)',
                WebkitBackdropFilter: shown ? 'blur(10px)' : 'blur(0px)',
                opacity: shown ? 1 : 0,
                transition: 'opacity 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-[340px] rounded-[34px] overflow-hidden shadow-2xl ring-1 ring-white/15"
                style={{
                    transformOrigin: 'center',
                    transform: shown ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(24px)',
                    opacity: shown ? 1 : 0,
                    transition: 'transform 0.36s cubic-bezier(0.34,1.56,0.64,1), opacity 0.26s ease',
                }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110"
                    style={{ backgroundImage: `url(${cover})`, filter: 'blur(34px) brightness(0.5)' }}
                />
                <div className="absolute inset-0 bg-black/35" />

                <div className="relative z-[5] w-full px-7 pt-10 pb-9 flex flex-col items-center">
                    <div
                        className="rounded-[18px] overflow-hidden shadow-2xl ring-1 ring-white/10 transition-all duration-300"
                        style={{ width: playing ? '82%' : '68%', aspectRatio: '1' }}
                    >
                        <img src={cover} alt="cover" className="w-full h-full object-cover" />
                    </div>

                    <div className="w-full mt-7 flex items-center justify-between">
                        <div className="min-w-0">
                            <div className="text-white text-[21px] font-bold truncate leading-tight">{title}</div>
                            <div className="text-white/60 text-[16px] truncate">{artist}</div>
                        </div>
                        <button className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform">
                            <svg className="w-5 h-5 fill-white/90" viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                        </button>
                    </div>

                    <div className="w-full mt-5">
                        <div
                            className="h-[6px] rounded-full bg-white/20 relative cursor-pointer overflow-hidden"
                            onClick={onSeek}
                            onTouchStart={onSeek}
                            onTouchMove={onSeek}
                        >
                            <div className="absolute left-0 top-0 h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between mt-1.5 text-[12px] text-white/55 font-medium tabular-nums">
                            <span>{fmt(cur)}</span>
                            <span>-{fmt(Math.max(0, dur - cur))}</span>
                        </div>
                    </div>

                    <div className="w-full mt-6 flex items-center justify-center gap-10">
                        <button onClick={onRestart} className="active:scale-90 transition-transform" aria-label="Previous">
                            <svg className="w-9 h-9 fill-white" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
                        </button>
                        <button onClick={onToggle} className="active:scale-90 transition-transform" aria-label={playing ? 'Pause' : 'Play'}>
                            <PlayPauseIcon playing={playing} className="w-[56px] h-[56px] fill-white" />
                        </button>
                        <button onClick={onRestart} className="active:scale-90 transition-transform" aria-label="Next">
                            <svg className="w-9 h-9 fill-white" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
