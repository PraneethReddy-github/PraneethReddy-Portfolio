import React, { useState, useEffect } from 'react';
import BootScreen from './BootScreen';
import LockScreen from './LockScreen';
import HomeScreen from './HomeScreen';
import ControlCenter from './ControlCenter';
import NotificationCenter from './NotificationCenter';
import AppWrapper from './AppWrapper';

export default function IOS() {
    const [booting, setBooting] = useState(true);
    const [locked, setLocked] = useState(true);
    const [brightness, setBrightness] = useState(100);
    const [nightLight, setNightLight] = useState(false);
    const [ccApp, setCcApp] = useState(null); // app opened from ControlCenter

    const [showControlCenter, setShowControlCenter] = useState(false);
    const [showNotificationCenter, setShowNotificationCenter] = useState(false);

    const [touchStartY, setTouchStartY] = useState(null);
    const [touchStartX, setTouchStartX] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setBooting(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleUnlock = () => setLocked(false);
    const handleLock   = () => setLocked(true);

    const handleTouchStart = (e) => {
        if (e.touches[0].clientY < 40 && !booting) {
            setTouchStartY(e.touches[0].clientY);
            setTouchStartX(e.touches[0].clientX);
        }
    };

    const handleTouchMove = (e) => {
        if (touchStartY === null) return;
        const diff = e.touches[0].clientY - touchStartY;
        if (diff > 30) {
            const screenWidth = window.innerWidth;
            if (touchStartX > screenWidth * 0.7) {
                if (!showControlCenter && !locked) setShowControlCenter(true);
            } else {
                if (!showNotificationCenter) setShowNotificationCenter(true);
            }
            setTouchStartY(null);
            setTouchStartX(null);
        }
    };

    const handleTouchEnd = () => {
        setTouchStartY(null);
        setTouchStartX(null);
    };

    const handleCCClose = (appId) => {
        setShowControlCenter(false);
        if (appId) setCcApp(appId);
    };

    return (
        <div
            className="w-screen h-screen overflow-hidden bg-black text-white select-none relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {booting ? (
                <BootScreen />
            ) : locked ? (
                <LockScreen onUnlock={handleUnlock} />
            ) : (
                <HomeScreen onLock={handleLock} />
            )}

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

            {ccApp && <AppWrapper appId={ccApp} onClose={() => setCcApp(null)} />}

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
                <NotificationCenter onClose={() => setShowNotificationCenter(false)} />
            )}
        </div>
    );
}
