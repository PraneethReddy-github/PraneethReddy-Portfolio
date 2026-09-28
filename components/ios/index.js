import React, { useState, useEffect, useRef } from 'react';
import BootScreen from './BootScreen';
import LockScreen from './LockScreen';
import HomeScreen from './HomeScreen';
import ControlCenter from './ControlCenter';
import NotificationCenter from './NotificationCenter';
import NotificationBanner, { scheduleWelcomeBanners } from './NotificationBanner';
import { useSystem, setSystem } from './system';
import { haptic } from './haptics';

export default function IOS() {
    const [booting, setBooting] = useState(true);
    const [locked, setLocked] = useState(true);
    const [brightness, setBrightness] = useState(100);
    const [nightLight, setNightLight] = useState(false);
    const [initialApp, setInitialApp] = useState(null);   // app to open right after unlock (lock-screen camera / notification)
    const [openRequest, setOpenRequest] = useState(null); // { id, params, key } → HomeScreen opens it

    const [showControlCenter, setShowControlCenter] = useState(false);
    const [showNotificationCenter, setShowNotificationCenter] = useState(false);

    const touch = useRef(null); // { x, y }
    const reqSeq = useRef(0);

    const flashlight   = useSystem((s) => s.flashlight);
    const reduceMotion = useSystem((s) => s.reduceMotion);
    const trueTone     = useSystem((s) => s.trueTone);
    const textSize     = useSystem((s) => s.textSize);

    useEffect(() => {
        const timer = setTimeout(() => setBooting(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    /* Welcome banners drop in shortly after the first unlock */
    useEffect(() => {
        if (!locked) scheduleWelcomeBanners();
    }, [locked]);

    const requestApp = (id, params = null) => {
        if (!id) return;
        setOpenRequest({ id, params, key: ++reqSeq.current });
    };

    const handleUnlock = (appId) => {
        setInitialApp(appId || null);
        setLocked(false);
    };
    const handleLock = () => { haptic('light'); setLocked(true); };

    /* ── Top-edge swipes: left/center → Notification Center, right → Control Center ── */
    const handleTouchStart = (e) => {
        const t = e.touches[0];
        if (t.clientY < 40 && !booting) touch.current = { x: t.clientX, y: t.clientY };
        else touch.current = null;
    };
    const handleTouchMove = (e) => {
        const s = touch.current;
        if (!s) return;
        const diff = e.touches[0].clientY - s.y;
        if (diff > 30) {
            const screenWidth = window.innerWidth;
            if (s.x > screenWidth * 0.7) {
                if (!showControlCenter && !locked) { haptic('light'); setShowControlCenter(true); }
            } else if (!showNotificationCenter) {
                haptic('light');
                setShowNotificationCenter(true);
            }
            touch.current = null;
        }
    };
    const handleTouchEnd = () => { touch.current = null; };

    const handleCCClose = (appId) => {
        setShowControlCenter(false);
        if (appId) requestApp(appId);
    };

    const shellClass = [
        'ios-shell w-screen overflow-hidden bg-black text-white select-none relative',
        reduceMotion ? 'ios-reduce-motion' : '',
        trueTone ? 'ios-true-tone' : '',
    ].join(' ');

    return (
        <div
            className={shellClass}
            style={{ '--ios-text-scale': textSize || 1 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {booting ? (
                <BootScreen />
            ) : locked ? (
                <LockScreen onUnlock={handleUnlock} />
            ) : (
                <HomeScreen
                    onLock={handleLock}
                    initialApp={initialApp}
                    openRequest={openRequest}
                    onRequestHandled={() => setOpenRequest(null)}
                />
            )}

            {/* Brightness dimmer */}
            <div
                className="absolute inset-0 bg-black pointer-events-none z-[50]"
                style={{ opacity: (1 - brightness / 100) * 0.9 }}
            />

            {nightLight && (
                <div
                    className="absolute inset-0 pointer-events-none z-[51]"
                    style={{ background: 'rgba(255, 140, 0, 0.18)', mixBlendMode: 'multiply' }}
                />
            )}

            {/* Flashlight — the phone's screen becomes the torch. Sits under the
                sheets (z-90/100) so Control Center stays usable to switch it off,
                and under the status bar/island (z-50 inside surfaces) visually. */}
            {flashlight && (
                <div
                    className="ios-flashlight"
                    style={{ pointerEvents: 'auto' }}
                    onClick={() => { haptic('medium'); setSystem({ flashlight: false }); }}
                >
                    <div className="absolute bottom-[88px] inset-x-0 flex justify-center">
                        <span className="text-[12px] font-medium text-black/45 bg-black/[0.06] rounded-full px-3.5 py-1.5">
                            Tap anywhere to turn off the flashlight
                        </span>
                    </div>
                </div>
            )}

            {!locked && !booting && (
                <NotificationBanner onOpen={(appId) => { setShowNotificationCenter(false); requestApp(appId); }} />
            )}

            {showControlCenter && (
                <ControlCenter
                    onClose={handleCCClose}
                    onBrightnessChange={setBrightness}
                    initialBrightness={brightness}
                    onNightLightChange={setNightLight}
                    initialNightLight={nightLight}
                />
            )}

            {showNotificationCenter && (
                <NotificationCenter
                    onClose={() => setShowNotificationCenter(false)}
                    onOpenApp={(appId) => {
                        setShowNotificationCenter(false);
                        if (locked) handleUnlock(appId); else requestApp(appId);
                    }}
                />
            )}
        </div>
    );
}
