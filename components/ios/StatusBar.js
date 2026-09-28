import React, { useState, useEffect, useRef } from 'react';
import { useSystem, setSystem } from './system';
import { useMedia, toggle as mediaToggle, seek as mediaSeek, restart as mediaRestart, skip as mediaSkip } from './media';
import { haptic } from './haptics';

const SPRING = 'cubic-bezier(0.34,1.3,0.64,1)';
const fmtClock = (sec) => {
    const s = Math.max(0, Math.round(sec));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
    return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`;
};

const TIMER_PATH = 'M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61 1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z';
const FLASH_PATH = 'M7 2v11h2v9l7-12h-4l4-8H7z';

/* ── Dynamic Island: idle pill + live activities (music / timer / stopwatch) ── */
function Island() {
    const media = useMedia();
    const timer = useSystem((s) => s.timer);
    const stopwatch = useSystem((s) => s.stopwatch);
    const flashlight = useSystem((s) => s.flashlight);

    const [expanded, setExpanded] = useState(null); // 'music' | 'timer' | null
    const [remaining, setRemaining] = useState(0);
    const [justDone, setJustDone] = useState(false);
    const collapseT = useRef(null);

    /* Let other surfaces (notification banner) know the island is open so
       they can move out of its way. */
    useEffect(() => { setSystem({ islandExpanded: expanded }); }, [expanded]);
    const rootRef = useRef(null);

    /* Derive countdown from endsAt so it keeps ticking after the app closes */
    useEffect(() => {
        if (timer.phase === 'running' && timer.endsAt) {
            const tick = () => {
                const rem = Math.max(0, (timer.endsAt - Date.now()) / 1000);
                setRemaining(rem);
                if (rem <= 0) {
                    setJustDone(true);
                    setSystem({ timer: { phase: 'done', remaining: 0, total: timer.total, endsAt: null } });
                }
            };
            tick();
            const iv = setInterval(tick, 500);
            return () => clearInterval(iv);
        }
        if (timer.phase === 'paused') setRemaining(timer.remaining);
        if (timer.phase === 'done') {
            setRemaining(0);
            setJustDone(true);
            const t = setTimeout(() => {
                setJustDone(false);
                setSystem({ timer: { phase: 'idle', remaining: 0, total: 0, endsAt: null } });
            }, 3000);
            return () => clearTimeout(t);
        }
        if (timer.phase === 'idle') setJustDone(false);
        return undefined;
    }, [timer]);

    const timerLive = timer.phase === 'running' || timer.phase === 'paused' || justDone;
    const musicLive = !!media.playing;
    const swLive = !!stopwatch.running;

    /* Auto-collapse the expanded card after 4s of no interaction */
    const armCollapse = () => {
        clearTimeout(collapseT.current);
        collapseT.current = setTimeout(() => setExpanded(null), 4000);
    };
    useEffect(() => () => clearTimeout(collapseT.current), []);
    useEffect(() => {
        if (!expanded) return undefined;
        const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setExpanded(null); };
        document.addEventListener('pointerdown', onDown, true);
        return () => document.removeEventListener('pointerdown', onDown, true);
    }, [expanded]);
    /* Collapse if the activity ends */
    useEffect(() => {
        if (expanded === 'timer' && !timerLive) setExpanded(null);
    }, [expanded, timerLive]);

    const mode = expanded || (musicLive ? 'music' : timerLive ? 'timer' : swLive ? 'stopwatch' : 'idle');
    const split = mode === 'music' && timerLive && !expanded;

    const onTap = (e) => {
        e.stopPropagation();
        if (expanded) return;
        if (musicLive) { haptic('light'); setExpanded('music'); armCollapse(); }
        else if (timerLive) { haptic('light'); setExpanded('timer'); armCollapse(); }
    };

    let width = 112, height = 33, radius = 20;
    if (expanded === 'music') { width = 'min(92vw, 380px)'; height = 150; radius = 40; }
    else if (expanded === 'timer') { width = 'min(92vw, 380px)'; height = 110; radius = 40; }
    else if (mode === 'music' || mode === 'timer' || mode === 'stopwatch') { width = split ? 176 : 156; height = 35; radius = 20; }
    else if (flashlight) { width = 130; }

    const cancelTimer = (e) => {
        e.stopPropagation();
        haptic('medium');
        setJustDone(false);
        setSystem({ timer: { phase: 'idle', remaining: 0, total: 0, endsAt: null } });
        setExpanded(null);
    };

    return (
        <div className="absolute left-0 right-0 top-0 flex justify-center pointer-events-none" style={{ height: 48, paddingTop: 12 }}>
            <div
                ref={rootRef}
                onClick={onTap}
                className="pointer-events-auto bg-black text-white overflow-hidden select-none ios-font relative"
                style={{
                    width, height, borderRadius: radius,
                    transition: `width .38s ${SPRING}, height .38s ${SPRING}, border-radius .38s ${SPRING}`,
                    boxShadow: expanded ? '0 12px 40px rgba(0,0,0,0.55)' : 'none',
                    cursor: musicLive || timerLive ? 'pointer' : 'default',
                    zIndex: 60,
                }}
            >
                {/* ── idle ── */}
                {mode === 'idle' && (
                    <div className="absolute inset-0 flex items-center justify-end pr-3 gap-2">
                        {flashlight && (
                            <svg className="w-[13px] h-[13px] mr-auto ml-3 fill-[#ffd60a]" viewBox="0 0 24 24"><path d={FLASH_PATH} /></svg>
                        )}
                        <div className="w-[9px] h-[9px] rounded-full bg-[#0a0a0a] ring-1 ring-[#1c1c1e]" />
                    </div>
                )}

                {/* ── compact music ── */}
                {mode === 'music' && !expanded && (
                    <div className="absolute inset-0 flex items-center px-[7px] animate-ios-fade-in">
                        <img src={media.cover} alt="" className="w-[22px] h-[22px] rounded-[6px] object-cover" />
                        {split ? (
                            <span className="ml-auto text-[12px] font-semibold tabular-nums text-[#ff9f0a] pr-1">{fmtClock(remaining)}</span>
                        ) : (
                            <div className="ml-auto flex items-end gap-[2px] h-[14px] pr-1">
                                {[0, 1, 2, 3].map((i) => (
                                    <span key={i} className="ios-eq-bar w-[3px] h-full rounded-full bg-[#fa2d48]" style={{ animationDelay: `${i * 0.13}s` }} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── compact timer ── */}
                {mode === 'timer' && !expanded && (
                    <div className="absolute inset-0 flex items-center px-3 animate-ios-fade-in">
                        <div className="w-[21px] h-[21px] rounded-full bg-[#ff9f0a]/25 flex items-center justify-center">
                            <svg className="w-[13px] h-[13px] fill-[#ff9f0a]" viewBox="0 0 24 24"><path d={TIMER_PATH} /></svg>
                        </div>
                        <span className="ml-auto text-[12px] font-semibold tabular-nums" style={{ color: timer.phase === 'paused' ? 'rgba(255,255,255,0.55)' : '#ff9f0a' }}>
                            {justDone ? '0:00' : fmtClock(remaining)}
                        </span>
                    </div>
                )}

                {/* ── compact stopwatch ── */}
                {mode === 'stopwatch' && (
                    <div className="absolute inset-0 flex items-center px-3 animate-ios-fade-in">
                        <div className="w-[21px] h-[21px] rounded-full bg-[#30d158]/25 flex items-center justify-center">
                            <svg className="w-[13px] h-[13px] fill-[#30d158]" viewBox="0 0 24 24"><path d={TIMER_PATH} /></svg>
                        </div>
                        <span className="ml-auto text-[12px] font-semibold tabular-nums text-[#30d158]">{fmtClock(stopwatch.elapsed / 1000)}</span>
                    </div>
                )}

                {/* ── expanded music ── */}
                {expanded === 'music' && (
                    <div className="absolute inset-0 px-5 pt-4 pb-3 flex flex-col animate-ios-rise" onClick={armCollapse}>
                        <div className="flex items-center gap-3">
                            <img src={media.cover} alt="" className="w-[56px] h-[56px] rounded-[12px] object-cover shadow-lg" />
                            <div className="min-w-0 flex-1">
                                <div className="text-[15px] font-semibold truncate">{media.title}</div>
                                <div className="text-[12px] text-white/55 truncate">{media.artist}</div>
                            </div>
                            <div className="flex items-end gap-[2px] h-[18px]">
                                {[0, 1, 2, 3].map((i) => (
                                    <span key={i} className="ios-eq-bar w-[3px] h-full rounded-full bg-[#fa2d48]" style={{ animationDelay: `${i * 0.13}s` }} />
                                ))}
                            </div>
                        </div>
                        <div
                            className="mt-3 h-[4px] rounded-full bg-white/20 overflow-hidden cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); mediaSeek((e.clientX - r.left) / r.width); armCollapse(); }}
                        >
                            <div className="h-full bg-white/85 rounded-full" style={{ width: `${media.progress}%` }} />
                        </div>
                        <div className="mt-1.5 flex items-center justify-center gap-9">
                            <button onClick={(e) => { e.stopPropagation(); haptic('light'); mediaRestart(); armCollapse(); }} className="active:scale-90 transition-transform" aria-label="Previous">
                                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); haptic('light'); mediaToggle(); armCollapse(); }} className="active:scale-90 transition-transform" aria-label={media.playing ? 'Pause' : 'Play'}>
                                {media.playing ? (
                                    <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1.6" /><rect x="14" y="5" width="4" height="14" rx="1.6" /></svg>
                                ) : (
                                    <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24"><path d="M7 6.2v11.6c0 .82.9 1.32 1.6.88l9-5.8a1.05 1.05 0 0 0 0-1.76l-9-5.8C7.9 4.88 7 5.38 7 6.2z" /></svg>
                                )}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); haptic('light'); mediaSkip(); armCollapse(); }} className="active:scale-90 transition-transform" aria-label="Next">
                                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* ── expanded timer ── */}
                {expanded === 'timer' && (
                    <div className="absolute inset-0 px-5 flex items-center gap-4 animate-ios-rise" onClick={armCollapse}>
                        <div className="relative w-[56px] h-[56px] flex-shrink-0">
                            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
                                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,159,10,0.2)" strokeWidth="5" />
                                <circle cx="28" cy="28" r="24" fill="none" stroke="#ff9f0a" strokeWidth="5" strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 24}
                                    strokeDashoffset={2 * Math.PI * 24 * (timer.total ? 1 - remaining / timer.total : 0)}
                                    style={{ transition: 'stroke-dashoffset .5s linear' }} />
                            </svg>
                            <svg className="absolute inset-0 m-auto w-[20px] h-[20px] fill-[#ff9f0a]" viewBox="0 0 24 24"><path d={TIMER_PATH} /></svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[12px] font-semibold text-[#ff9f0a] uppercase tracking-wide">{timer.phase === 'paused' ? 'Paused' : justDone ? 'Done' : 'Timer'}</div>
                            <div className="text-[34px] font-light tabular-nums leading-none mt-0.5 tracking-tight">{fmtClock(remaining)}</div>
                        </div>
                        <button onClick={cancelTimer} className="w-[46px] h-[46px] rounded-full bg-[#ff453a]/25 flex items-center justify-center active:scale-90 transition-transform" aria-label="Cancel timer">
                            <svg className="w-5 h-5 fill-[#ff453a]" viewBox="0 0 24 24"><path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 0 0-1.4 1.4l4.9 4.9-4.9 4.9a1 1 0 1 0 1.4 1.4l4.9-4.9 4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z" /></svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}


export default function StatusBar({ dark = false, island = true }) {
    const [time, setTime] = useState(null);
    const [batteryLevel, setBatteryLevel] = useState(85);
    const [charging, setCharging] = useState(false);
    const [batteryLow, setBatteryLow] = useState(false);

    const [wifiOn, setWifiOn] = useState(() => {
        if (typeof window === 'undefined') return true;
        try { return JSON.parse(localStorage.getItem('cc_wifi') ?? 'true'); } catch { return true; }
    });
    const [cellularOn, setCellularOn] = useState(() => {
        if (typeof window === 'undefined') return true;
        try { return JSON.parse(localStorage.getItem('cc_cellular') ?? 'true'); } catch { return true; }
    });

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (typeof navigator !== 'undefined' && navigator.getBattery) {
            navigator.getBattery().then((battery) => {
                const update = () => {
                    const pct = Math.round(battery.level * 100);
                    setBatteryLevel(pct);
                    setBatteryLow(pct <= 20 && !battery.charging);
                    setCharging(battery.charging);
                };
                update();
                battery.addEventListener('levelchange', update);
                battery.addEventListener('chargingchange', update);
            }).catch(() => {});
        }
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (e.detail.wifi    !== undefined) setWifiOn(e.detail.wifi);
            if (e.detail.cellular !== undefined) setCellularOn(e.detail.cellular);
        };
        window.addEventListener('cc-connectivity', handler);
        return () => window.removeEventListener('cc-connectivity', handler);
    }, []);

    const formatTime = (date) => {
        if (!date) return '';
        let h = date.getHours() % 12;
        if (h === 0) h = 12;
        const m = date.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    };

    const fg    = dark ? '#000' : '#fff';
    const fgDim = dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.45)';
    const fillPct = Math.max(0, Math.min(100, batteryLevel));

    /* ── fill width for the SVG battery (max inner width = 18px) ── */
    const fillW = Math.max(fillPct > 0 ? 2 : 0, Math.round(18 * fillPct / 100));
    const battColor = batteryLow ? '#ff3b30' : charging ? '#34c759' : fg;

    return (
        <div
            className="w-full h-12 flex justify-between items-center px-7 pt-2 absolute top-0 left-0 z-50 select-none ios-font"
            style={{ color: fg }}
        >
            <div className="flex-1 flex justify-start">
                <span className="text-[16px] font-semibold tracking-[0.2px] pl-1" style={{ textShadow: dark ? 'none' : '0 0 1px rgba(0,0,0,0.15)' }}>
                    {formatTime(time)}
                </span>
            </div>

            {/* Spacer keeps the time / status clusters exactly where they were;
                the island itself is absolutely centred so it can grow freely. */}
            {island && <div className="w-[112px] h-[33px] flex-shrink-0" />}
            {island && <Island />}

            <div className="flex-1 flex justify-end items-center gap-[5px] pr-1">

                {cellularOn && (
                    <svg width="18" height="12" viewBox="0 0 18 12">
                        <rect x="0"  y="8"   width="3" height="4"  rx="0.8" fill={fg} />
                        <rect x="5"  y="5.5" width="3" height="6.5" rx="0.8" fill={fg} />
                        <rect x="10" y="3"   width="3" height="9"  rx="0.8" fill={fg} />
                        <rect x="15" y="0"   width="3" height="12" rx="0.8" fill={fg} />
                    </svg>
                )}

                {wifiOn && (
                    <svg width="21" height="16" viewBox="0 0 24 24" fill={fg}>
                        <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                    </svg>
                )}

                <svg width="28" height="13" viewBox="0 0 28 13">
                    <rect x="0.75" y="0.75" width="23.5" height="11.5" rx="3.2"
                        fill="none"
                        stroke={batteryLow ? '#ff3b30' : fgDim}
                        strokeWidth="1.5"
                    />
                    {fillPct > 0 && (
                        <rect x="2.5" y="2.5" width={fillW} height="8" rx="1.8" fill={battColor} />
                    )}
                    <path
                        d="M25.5 4.3a2.2 2.2 0 0 1 0 4.4"
                        fill="none"
                        stroke={batteryLow ? '#ff3b30' : fgDim}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    {charging && (
                        <path
                            d="M12 9.5L14.5 6H12.8L13.5 3.5 11 7H12.8L12 9.5Z"
                            fill={dark ? '#fff' : '#000'}
                            opacity="0.75"
                        />
                    )}
                </svg>
            </div>
        </div>
    );
}
