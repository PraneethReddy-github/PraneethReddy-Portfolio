import React, { useState, useEffect, useRef } from 'react';
import StatusBar from './StatusBar';
import { NOTIFICATIONS, formatRelativeTime } from './notifications';
import { useSystem, setSystem, useWallpaper } from './system';
import { haptic } from './haptics';
import { SwipeCard } from './NotificationBanner';

export default function LockScreen({ onUnlock }) {
    const [time, setTime] = useState(null);
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [unlocking, setUnlocking] = useState(false);
    const [notifs, setNotifs] = useState(NOTIFICATIONS);
    const startYRef = useRef(null);
    const flashlight = useSystem((s) => s.flashlight);
    const reduceMotion = useSystem((s) => s.reduceMotion);
    const wallpaper = useWallpaper();

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        if (!date) return '';
        let h = date.getHours() % 12;
        if (h === 0) h = 12;
        const m = date.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    };

    const formatDate = (date) =>
        date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : '';

    const triggerUnlock = (appId) => {
        if (unlocking) return;
        setUnlocking(true);
        haptic('unlock');
        setTimeout(() => onUnlock(appId), reduceMotion ? 100 : 260);
    };

    const handleTouchStart = (e) => {
        /* Swipes that start on the notification stack scroll the stack —
           they must not lift the whole lock screen. */
        if (e.target && e.target.closest && e.target.closest('[data-lock-notifs]')) { startYRef.current = null; return; }
        startYRef.current = e.touches[0].clientY;
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (startYRef.current === null) return;
        const delta = startYRef.current - e.touches[0].clientY;
        if (delta > 0) setDragY(delta);
    };

    const handleTouchEnd = (e) => {
        if (startYRef.current === null) return;
        const delta = startYRef.current - e.changedTouches[0].clientY;
        if (delta > 70) triggerUnlock();
        else setDragY(0);
        setIsDragging(false);
        startYRef.current = null;
    };

    const toggleFlashlight = (e) => {
        e.stopPropagation();
        haptic('medium');
        setSystem({ flashlight: !flashlight });
    };

    const openCamera = (e) => {
        e.stopPropagation();
        haptic('medium');
        triggerUnlock('camera');
    };

    const dragProgress = Math.min(dragY / 130, 1);
    const lift = Math.min(dragY * 0.45, 70);
    const lifting = unlocking;
    const lockOpen = lifting || dragProgress > 0.6;
    const t = (extra = '') => (isDragging ? 'none' : `transform 0.4s cubic-bezier(0.32,0.72,0,1)${extra}`);

    return (
        <div
            className={`w-full h-full relative bg-cover bg-center flex flex-col overflow-hidden ios-font ${lifting ? 'animate-ios-unlock' : 'animate-ios-fade-in'}`}
            style={{ backgroundImage: `url(${wallpaper})` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => triggerUnlock()}
        >
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

            <StatusBar />

            <div
                className="relative pt-[78px] flex flex-col items-center select-none"
                style={{ transform: `translateY(-${lift}px)`, opacity: 1 - dragProgress * 0.6, transition: t(', opacity 0.3s ease') }}
            >
                {/* Padlock — shackle lifts when the swipe is nearly there / unlocked */}
                <svg className="w-[15px] h-[17px] mb-2 drop-shadow" viewBox="0 0 24 26" fill="rgba(255,255,255,0.85)">
                    <path
                        d="M7.3 11V6.5a4.7 4.7 0 1 1 9.4 0V9h-2.2V6.5a2.5 2.5 0 1 0-5 0V11"
                        style={{
                            transformOrigin: '7px 11px',
                            transform: lockOpen ? 'translateY(-3px) rotate(-22deg)' : 'none',
                            transition: 'transform .3s cubic-bezier(0.34,1.56,0.64,1)',
                        }}
                    />
                    <path d="M6.4 11h11.2A2.4 2.4 0 0 1 20 13.4v8.2a2.4 2.4 0 0 1-2.4 2.4H6.4A2.4 2.4 0 0 1 4 21.6v-8.2A2.4 2.4 0 0 1 6.4 11Z" />
                </svg>
                <h2 className="text-[19px] font-semibold tracking-wide text-white/95 drop-shadow-md">
                    {formatDate(time)}
                </h2>
                <h1
                    className="text-[78px] font-bold leading-[1.05] tracking-[-2px] text-white drop-shadow-lg mt-1"
                    style={{ fontFamily: 'var(--ios-font)' }}
                >
                    {formatTime(time)}
                </h1>
            </div>

            <div
                data-lock-notifs=""
                className="relative flex-1 min-h-0 overflow-y-auto ios-scroll px-3.5 mt-7 mb-1 flex flex-col gap-2.5"
                style={{ transform: `translateY(-${lift}px)`, opacity: 1 - dragProgress, transition: t() }}
            >
                {notifs.map((n, i) => (
                    <SwipeCard
                        key={n.id}
                        onTap={() => triggerUnlock(n.appId)}
                        onClear={() => setNotifs((p) => p.filter((x) => x.id !== n.id))}
                        className="animate-ios-rise"
                        style={{ animationDelay: `${i * 40}ms` }}
                    >
                        <div className="bg-black/30 backdrop-blur-2xl rounded-[20px] border border-white/10 px-3.5 py-3 shadow-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-5 h-5 rounded-[6px] flex items-center justify-center text-[11px]" style={{ background: n.color }}>{n.icon}</div>
                                <span className="text-white/55 text-[11px] font-semibold uppercase tracking-wider">{n.app}</span>
                                <span className="ml-auto text-white/40 text-[11px]">{formatRelativeTime(n.time)}</span>
                            </div>
                            <div className="text-white text-[13.5px] font-semibold leading-tight">{n.title}</div>
                            <div className="text-white/75 text-[12.5px] leading-snug mt-0.5">{n.body}</div>
                        </div>
                    </SwipeCard>
                ))}
            </div>

            <div
                className="relative pb-3 px-9 flex flex-col w-full"
                style={{ transform: `translateY(-${lift}px)`, transition: t() }}
            >
                <div className="flex justify-between items-center w-full mb-8 px-1">
                    <button
                        onClick={toggleFlashlight}
                        onTouchStart={(e) => e.stopPropagation()}
                        className={`w-[50px] h-[50px] rounded-full backdrop-blur-2xl flex items-center justify-center border ios-tap shadow-lg transition-colors duration-200 ${flashlight ? 'bg-white border-white' : 'bg-black/35 border-white/15'}`}
                        aria-label="Flashlight"
                        aria-pressed={flashlight}
                    >
                        <svg className={`w-[22px] h-[22px] transition-colors ${flashlight ? 'fill-black' : 'fill-white'}`} viewBox="0 0 24 24">
                            <path d="M7 2h10l-1.2 5.2a2 2 0 0 1-.6 1.05l-.9.85a1.5 1.5 0 0 0-.47 1.1V20a2 2 0 0 1-2 2h-.66a2 2 0 0 1-2-2v-9.8a1.5 1.5 0 0 0-.47-1.1l-.9-.85a2 2 0 0 1-.6-1.05L7 2Zm1.55 1.5.7 3h5.5l.7-3h-6.9Z" />
                        </svg>
                    </button>
                    <button
                        onClick={openCamera}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="w-[50px] h-[50px] rounded-full bg-black/35 backdrop-blur-2xl flex items-center justify-center border border-white/15 ios-tap shadow-lg active:bg-white/90 group"
                        aria-label="Camera"
                    >
                        <svg className="w-[22px] h-[22px] fill-white group-active:fill-black transition-colors" viewBox="0 0 24 24">
                            <path d="M9.4 4 8 5.6H4.8A2.8 2.8 0 0 0 2 8.4v9.2A2.8 2.8 0 0 0 4.8 20.4h14.4A2.8 2.8 0 0 0 22 17.6V8.4a2.8 2.8 0 0 0-2.8-2.8H16L14.6 4H9.4Zm2.6 4.6a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col items-center" style={{ opacity: 1 - dragProgress * 1.6 }}>
                    <span className={`text-[13px] font-medium tracking-wide text-white/75 drop-shadow ${reduceMotion ? '' : 'animate-ios-bounce'}`}>
                        swipe up to open
                    </span>
                    <div className="w-[134px] h-[5px] bg-white/85 rounded-full mt-4 shadow-sm" />
                </div>
            </div>
        </div>
    );
}
