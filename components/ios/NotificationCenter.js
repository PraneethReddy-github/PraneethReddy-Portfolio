import React, { useState } from 'react';
import StatusBar from './StatusBar';
import { NOTIFICATIONS as INITIAL_NOTIFICATIONS, formatRelativeTime } from './notifications';
import { useWallpaper } from './system';
import { haptic } from './haptics';
import { SwipeCard } from './NotificationBanner';

const DISMISSED_KEY = 'nc_dismissed';

function loadDismissed() {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(sessionStorage.getItem(DISMISSED_KEY) || '[]'); } catch { return []; }
}
function saveDismissed(ids) {
    try { sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(ids)); } catch {}
}

function NotificationCard({ notif, onDismiss, onOpen, index }) {
    return (
        <SwipeCard
            onTap={onOpen}
            onClear={onDismiss}
            className="animate-ios-rise"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="w-full bg-[#1C1C1E]/60 backdrop-blur-[40px] rounded-[24px] shadow-xl border border-white/10 flex flex-col cursor-pointer active:scale-[0.98] overflow-hidden transition-transform">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center text-[10px]"
                                style={{ backgroundColor: notif.color }}
                            >
                                {notif.icon}
                            </div>
                            <span className="text-white/60 text-[12px] font-semibold tracking-wider uppercase">{notif.app}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-white/40 text-[12px]">{formatRelativeTime(notif.time)}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDismiss(); }}
                                onTouchStart={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-[13px] leading-none active:bg-white/20 transition-colors"
                                aria-label="Dismiss"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                    <span className="text-white font-semibold text-[14px] leading-tight block">{notif.title}</span>
                    <span className="text-white/75 text-[13px] mt-0.5 leading-snug block">{notif.body}</span>
                </div>
            </div>
        </SwipeCard>
    );
}

export default function NotificationCenter({ onClose, onOpenApp }) {
    const [dismissed, setDismissed] = useState(loadDismissed);
    const [startY, setStartY] = useState(null);
    const [translateY, setTranslateY] = useState(0);
    const wallpaper = useWallpaper();

    const notifications = INITIAL_NOTIFICATIONS.filter((n) => !dismissed.includes(n.id));

    const today = new Date();
    const day = today.toLocaleDateString('en-US', { weekday: 'long' });
    const date = today.getDate();
    const month = today.toLocaleDateString('en-US', { month: 'long' });
    const time = today.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).replace(/\s?[AP]M$/i, '');

    const handleTouchStart = (e) => setStartY(e.touches[0].clientY);
    const handleTouchMove = (e) => {
        if (!startY) return;
        const diff = e.touches[0].clientY - startY;
        if (diff < 0) setTranslateY(diff);
    };
    const handleTouchEnd = (e) => {
        if (!startY) return;
        if (startY - e.changedTouches[0].clientY > 50) onClose();
        else setTranslateY(0);
        setStartY(null);
    };

    const dismiss = (id) => {
        setDismissed((prev) => {
            const next = prev.includes(id) ? prev : [...prev, id];
            saveDismissed(next);
            return next;
        });
    };

    const clearAll = () => {
        haptic('light');
        const all = INITIAL_NOTIFICATIONS.map((n) => n.id);
        saveDismissed(all);
        setDismissed(all);
    };

    const open = (n) => {
        haptic('light');
        onClose();
        if (onOpenApp && n.appId) onOpenApp(n.appId);
    };

    return (
        <div
            className={`absolute inset-0 z-[90] flex flex-col items-center overflow-hidden ios-font ${translateY === 0 ? 'animate-ios-slide-down' : ''}`}
            style={{
                transform: `translateY(${translateY}px)`,
                transition: translateY === 0 ? 'transform 0.3s cubic-bezier(0.32,0.72,0,1)' : 'none',
                backgroundImage: `url(${wallpaper})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="absolute inset-0 bg-black/25 backdrop-blur-md" />

            <StatusBar />

            <div className="flex flex-col items-center mt-[70px] z-10 w-full select-none">
                <span className="text-white/90 font-semibold text-[18px] drop-shadow-md tracking-wide">
                    {day}, {month} {date}
                </span>
                <span
                    className="text-white text-[64px] leading-[1.05] font-bold drop-shadow-lg tracking-[-1.5px] mt-0.5"
                    style={{ fontFamily: 'var(--ios-font)' }}
                >
                    {time}
                </span>
            </div>

            <div className="mt-4 flex flex-col space-y-2.5 w-full px-4 z-10 select-none flex-1 overflow-y-auto pb-10 ios-scroll">
                {notifications.length > 0 ? (
                    <>
                        <div className="flex justify-between items-center px-1 mb-0.5">
                            <div className="flex items-center gap-2">
                                <span className="text-white/50 text-[12px] font-semibold uppercase tracking-widest">Notification Summary</span>
                                <span className="text-white/80 text-[11px] font-semibold bg-white/15 rounded-full px-2 py-[1px] leading-none">
                                    {notifications.length}
                                </span>
                            </div>
                            <button
                                onClick={clearAll}
                                className="text-white/50 text-[12px] font-medium active:text-white/80 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                        {notifications.map((notif, i) => (
                            <NotificationCard
                                key={notif.id}
                                index={i}
                                notif={notif}
                                onDismiss={() => dismiss(notif.id)}
                                onOpen={() => open(notif)}
                            />
                        ))}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center flex-1 mt-8">
                        <span className="text-white/60 text-[15px] font-medium">No more notifications</span>
                    </div>
                )}
            </div>

            <div className="w-full h-8 flex justify-center items-center pb-2 pt-2 cursor-pointer absolute bottom-0 left-0 z-10">
                <div className="w-32 h-1.5 bg-white/50 rounded-full shadow-md" />
            </div>
        </div>
    );
}
