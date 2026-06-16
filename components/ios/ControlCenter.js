import React, { useState, useRef } from 'react';
import StatusBar from './StatusBar';

function loadToggle(key, def) {
    try { const v = localStorage.getItem(`cc_${key}`); return v !== null ? JSON.parse(v) : def; }
    catch { return def; }
}
function saveToggle(key, value) {
    try { localStorage.setItem(`cc_${key}`, JSON.stringify(value)); } catch {}
}

const ICONS = {
    airplane:    'M21 16v-2l-8-5V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
    cellular:    'M17 4h3v16h-3V4zm-4 4h3v12h-3V8zm-4 4h3v8H9v-8zm-4 4h3v4H5v-4z',
    wifi:        'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z',
    bluetooth:   'M17.71 7.71 12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z',
    brightness:  'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z',
    volume:      'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
    flashlight:  'M7 2v11h2v9l7-12h-4l4-8H7z',
    rotate:      'M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z',
    silent:      'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z',
    dnd:         'M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3zm4 10H8v-2h8v2z',
    nightLight:  'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z',
    timer:       'M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61 1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z',
    weather:     'M6.5 20a4.5 4.5 0 0 1-.42-8.98 6 6 0 0 1 11.62-1.2A4 4 0 0 1 17.5 20h-11z',
    camera:      'M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z',
    play:        'M8 5v14l11-7z',
    pause:       'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
    skipPrev:    'M6 6h2v12H6zm3.5 6 8.5 6V6z',
    skipNext:    'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z',
};

/* Round connectivity toggle */
function NetToggle({ on, onColor, onClick, d, label }) {
    return (
        <button onClick={onClick} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all duration-200"
                style={{ background: on ? onColor : 'rgba(120,120,128,0.32)', backdropFilter: 'blur(6px)' }}>
                <svg className="w-[18px] h-[18px] fill-white" style={{ opacity: on ? 1 : 0.7 }} viewBox="0 0 24 24">
                    <path d={d} />
                </svg>
            </div>
            <span className="text-[8px] font-medium" style={{ color: on ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)' }}>
                {label}
            </span>
        </button>
    );
}

/* Square tile — fills its grid cell */
function Tile({ on, onColor = '#FFFFFF', onClick, d, label }) {
    return (
        <button
            onClick={onClick}
            className="w-full h-full flex flex-col items-center justify-center gap-1.5 rounded-[22px] border border-white/[0.06] transition-all duration-200 active:scale-95"
            style={{
                background: on ? onColor : 'rgba(118,118,128,0.24)',
                backdropFilter: 'blur(6px)',
                boxShadow: on ? 'none' : 'inset 0 0.5px 0 rgba(255,255,255,0.12)',
            }}
        >
            <svg className="w-[19px] h-[19px]" style={{ fill: on ? 'rgba(0,0,0,0.78)' : 'white' }} viewBox="0 0 24 24">
                <path d={d} />
            </svg>
            <span className="text-[9px] font-semibold leading-none" style={{ color: on ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.5)' }}>
                {label}
            </span>
        </button>
    );
}

/* Vertical slider — fills its quadrant height */
function VerticalSlider({ value, setValue, icon }) {
    const ref = useRef(null);
    const set = (clientY) => {
        const rect = ref.current.getBoundingClientRect();
        setValue(Math.max(0, Math.min(100, 100 - ((clientY - rect.top) / rect.height) * 100)));
    };
    return (
        <div
            ref={ref}
            className="relative flex-1 h-full rounded-[22px] overflow-hidden border border-white/[0.06]"
            style={{ background: 'rgba(118,118,128,0.24)', touchAction: 'none', boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.12)' }}
            onTouchStart={(e) => { e.stopPropagation(); set(e.touches[0].clientY); }}
            onTouchMove={(e) => { e.stopPropagation(); set(e.touches[0].clientY); }}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); set(e.clientY); }}
            onPointerMove={(e) => { if (e.buttons === 1) set(e.clientY); }}
        >
            <div className="absolute inset-x-0 bottom-0 transition-[height] duration-75"
                style={{ height: `${value}%`, background: 'rgba(255,255,255,0.95)' }} />
            <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
                <svg className="w-[18px] h-[18px] transition-colors duration-75"
                    style={{ fill: value > 14 ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)' }}
                    viewBox="0 0 24 24">
                    <path d={icon} />
                </svg>
            </div>
        </div>
    );
}

export default function ControlCenter({ onClose, onBrightnessChange, initialBrightness = 100, onNightLightChange, initialNightLight = false }) {
    const [wifi,        setWifi]        = useState(() => loadToggle('wifi',      true));
    const [bluetooth,   setBluetooth]   = useState(() => loadToggle('bluetooth', true));
    const [airplane,    setAirplane]    = useState(() => loadToggle('airplane',  false));
    const [cellular,    setCellular]    = useState(() => loadToggle('cellular',  true));
    const [flashlight,  setFlashlight]  = useState(() => loadToggle('flashlight', false));
    const [rotate,      setRotate]      = useState(() => loadToggle('rotate',    false));
    const [silent,      setSilent]      = useState(() => loadToggle('silent',    false));
    const [dnd,         setDnd]         = useState(() => loadToggle('dnd',       false));
    const [nightLight,  setNightLight]  = useState(initialNightLight); // owned by parent
    const [playing,     setPlaying]     = useState(false);
    const [progress,    setProgress]    = useState(0);
    const [brightness,  setBrightness]  = useState(initialBrightness);
    const [volume,      setVolume]      = useState(() => loadToggle('volume', 55));
    const [startY,      setStartY]      = useState(null);
    const [translateY,  setTranslateY]  = useState(0);

    const audioRef = useRef(null);

    const toggleMusic = async () => {
        const a = audioRef.current;
        if (!a) return;
        if (playing) { a.pause(); setPlaying(false); }
        else { try { await a.play(); setPlaying(true); } catch {} }
    };
    const onTimeUpdate = () => {
        const a = audioRef.current;
        if (a && a.duration) setProgress((a.currentTime / a.duration) * 100);
    };
    const seek = (e) => {
        const a = audioRef.current;
        if (!a || !a.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        a.currentTime = Math.max(0, Math.min(1, x / rect.width)) * a.duration;
    };

    const toggle = (key, setter, val) => { setter(val); saveToggle(key, val); };

    const dispatchConnectivity = (wifiVal, cellularVal) => {
        window.dispatchEvent(new CustomEvent('cc-connectivity', { detail: { wifi: wifiVal, cellular: cellularVal } }));
    };

    const handleWifi = () => {
        const next = !wifi;
        toggle('wifi', setWifi, next);
        dispatchConnectivity(next, cellular);
    };

    const handleCellular = () => {
        const next = !cellular;
        toggle('cellular', setCellular, next);
        dispatchConnectivity(wifi, next);
    };

    const handleAirplane = () => {
        const next = !airplane;
        toggle('airplane', setAirplane, next);
        if (next) {
            toggle('wifi',      setWifi,      false);
            toggle('bluetooth', setBluetooth, false);
            toggle('cellular',  setCellular,  false);
            dispatchConnectivity(false, false);
        }
    };

    const handleBrightness = (val) => {
        setBrightness(val);
        if (onBrightnessChange) onBrightnessChange(val);
    };

    const handleNightLight = () => {
        const next = !nightLight;
        setNightLight(next);
        if (onNightLightChange) onNightLightChange(next);
    };

    const handleClose = (appId) => { if (onClose) onClose(appId); };

    const handleSwipeStart = (e) => setStartY(e.touches[0].clientY);
    const handleSwipeMove  = (e) => {
        if (!startY) return;
        const d = e.touches[0].clientY - startY;
        if (d < 0) setTranslateY(d);
    };
    const handleSwipeEnd = (e) => {
        if (!startY) return;
        if (startY - e.changedTouches[0].clientY > 50) handleClose();
        else setTranslateY(0);
        setStartY(null);
    };

    return (
        <div
            className={`absolute inset-0 z-[100] flex flex-col bg-black/30 backdrop-blur-[60px] overflow-hidden ios-font ${translateY === 0 ? 'animate-ios-slide-down' : ''}`}
            style={{ transform: `translateY(${translateY}px)`, transition: translateY === 0 ? 'transform 0.3s cubic-bezier(0.32,0.72,0,1)' : 'none' }}
            onTouchStart={handleSwipeStart}
            onTouchMove={handleSwipeMove}
            onTouchEnd={handleSwipeEnd}
        >
            <StatusBar />

            <div className="px-4 pt-16 pb-8 flex flex-col gap-3 select-none" onClick={(e) => e.stopPropagation()}>

                <div className="grid grid-cols-2 gap-3" style={{ gridTemplateRows: '150px 150px' }}>

                    <div className="rounded-[28px] p-3.5 flex flex-col justify-center gap-3 border border-white/[0.08]"
                        style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.14)' }}>
                        <div className="flex justify-around">
                            <NetToggle on={airplane}  onColor="#FF9500" onClick={handleAirplane}                                    d={ICONS.airplane}  label="Airplane"  />
                            <NetToggle on={cellular}  onColor="#34C759" onClick={handleCellular}                                    d={ICONS.cellular}  label="Cellular"  />
                        </div>
                        <div className="flex justify-around">
                            <NetToggle on={wifi}      onColor="#007AFF" onClick={handleWifi}                                        d={ICONS.wifi}      label="Wi-Fi"     />
                            <NetToggle on={bluetooth} onColor="#007AFF" onClick={() => toggle('bluetooth', setBluetooth, !bluetooth)} d={ICONS.bluetooth} label="Bluetooth" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 grid-rows-2 gap-2.5">
                        <Tile on={flashlight} onColor="#FFF8DC" onClick={() => toggle('flashlight', setFlashlight, !flashlight)} d={ICONS.flashlight} label="Flash"  />
                        <Tile on={rotate}     onColor="#FFFFFF" onClick={() => toggle('rotate', setRotate, !rotate)}         d={ICONS.rotate}     label="Rotate" />
                        <Tile on={false} onClick={() => handleClose('timer')}  d={ICONS.timer}  label="Timer"  />
                        <Tile on={false} onClick={() => handleClose('camera')} d={ICONS.camera} label="Camera" />
                    </div>

                    <div className="grid grid-cols-2 grid-rows-2 gap-2.5">
                        <Tile on={silent}     onColor="#FF9500" onClick={() => toggle('silent', setSilent, !silent)} d={ICONS.silent}     label="Silent" />
                        <Tile on={dnd}        onColor="#5E5CE6" onClick={() => toggle('dnd', setDnd, !dnd)}       d={ICONS.dnd}        label="DND"    />
                        <Tile on={nightLight} onColor="#FF9F0A" onClick={handleNightLight}          d={ICONS.nightLight} label="Night"  />
                        <Tile on={false} onClick={() => handleClose('weather')} d={ICONS.weather} label="Weather" />
                    </div>

                    <div className="flex gap-3">
                        <VerticalSlider value={brightness} setValue={handleBrightness} icon={ICONS.brightness} />
                        <VerticalSlider value={volume}     setValue={(v) => toggle('volume', setVolume, v)} icon={ICONS.volume} />
                    </div>
                </div>

                <div className="rounded-[26px] p-3 flex flex-col gap-2 border border-white/[0.08]"
                    style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.14)' }}>
                    <audio
                        ref={audioRef}
                        src="/audio/song.mp3"
                        preload="metadata"
                        onTimeUpdate={onTimeUpdate}
                        onEnded={() => { setPlaying(false); setProgress(0); }}
                    />
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-[10px] overflow-hidden flex-shrink-0 ring-1 ring-white/10">
                            <img src="/images/logos/song-cover.png" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-white text-[13px] font-semibold truncate leading-tight">God&apos;s Plan</div>
                            <div className="text-white/45 text-[11px] truncate mt-0.5">Drake · Scorpion</div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button className="p-1.5 active:opacity-50 transition-opacity">
                                <svg className="w-[20px] h-[20px] fill-white/70" viewBox="0 0 24 24"><path d={ICONS.skipPrev} /></svg>
                            </button>
                            <button onClick={toggleMusic} className="p-1.5 active:scale-90 transition-transform">
                                <svg className="fill-white" style={{ width: '22px', height: '22px' }} viewBox="0 0 24 24">
                                    <path d={playing ? ICONS.pause : ICONS.play} />
                                </svg>
                            </button>
                            <button className="p-1.5 active:opacity-50 transition-opacity">
                                <svg className="w-[20px] h-[20px] fill-white/70" viewBox="0 0 24 24"><path d={ICONS.skipNext} /></svg>
                            </button>
                        </div>
                    </div>
                    <div className="h-[3px] bg-white/15 rounded-full overflow-hidden mx-0.5 cursor-pointer" onPointerDown={seek}>
                        <div className="h-full bg-white/70 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
