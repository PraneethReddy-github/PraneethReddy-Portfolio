import React, { useState, useEffect, useRef } from 'react';
import { useSystem, setSystem, WALLPAPERS, wallpaperSrc } from './system';
import haptic from './haptics';

/*
 * iOS-style Settings app.
 * Grouped inset lists, animated toggles, a push/pop navigation stack and
 * live bindings to the shared system store (wallpaper, haptics, motion…).
 */

const BLUE = '#007aff';
const EASE = 'cubic-bezier(0.32,0.72,0,1)';

/* ---------- localStorage helpers (cc_* keys shared with ControlCenter) ---------- */
function loadCC(key, def) {
    if (typeof window === 'undefined') return def;
    try { const v = localStorage.getItem(`cc_${key}`); return v !== null ? JSON.parse(v) : def; }
    catch { return def; }
}
function saveCC(key, value) {
    try { localStorage.setItem(`cc_${key}`, JSON.stringify(value)); } catch {}
}

/* ---------- Glyphs ---------- */
const G = {
    airplane:  'M21 16v-2l-8-5V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
    wifi:      'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z',
    bluetooth: 'M17.71 7.71 12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z',
    cellular:  'M17 4h3v16h-3V4zm-4 4h3v12h-3V8zm-4 4h3v8H9v-8zm-4 4h3v4H5v-4z',
    gear:      'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z',
    display:   'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm-1-5h2v3h-2zm0 17h2v3h-2zM2 11h3v2H2zm17 0h3v2h-3zM5.6 4.2l1.4 1.4-2.1 2.1-1.4-1.4zm12.8 12.8 1.4 1.4-2.1 2.1-1.4-1.4zM4.9 17.6l1.4-1.4 2.1 2.1-1.4 1.4zM17.7 4.9l1.4 1.4-2.1 2.1-1.4-1.4z',
    wallpaper: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 12 4.5-6 3.5 4.5 2.5-3 5.5 4.5H4zM16 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z',
    sound:     'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
    battery:   'M16 4h-1V2h-4v2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-2 13H8v-4h6v4z',
    hand:      'M12 2a2 2 0 0 0-2 2v6H9V5a2 2 0 1 0-4 0v9a7 7 0 0 0 14 0V8a2 2 0 1 0-4 0v2h-1V4a2 2 0 0 0-2-2z',
    safari:    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4 6-2.5 5.5L8 16l2.5-5.5L16 8z',
    photos:    'M12 2a4 4 0 0 1 4 4 4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 4-4z',
    camera:    'M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z',
    games:     'M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 15h6l2.25 3.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H7v-2H5V9h2V7h2v2h2v2z',
    mail:      'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z',
    chat:      'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z',
    info:      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    update:    'M12 4V1L8 5l4 4V6a6 6 0 0 1 5.65 8H19.7A8 8 0 0 0 12 4zm0 14a6 6 0 0 1-5.65-8H4.3A8 8 0 0 0 12 20v3l4-4-4-4v3z',
    reset:     'M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    check:     'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
    github:    'M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.84c.85 0 1.71.11 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z',
    linkedin:  'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.5 18H6V9.5h2.5V18zM7.25 8.4a1.45 1.45 0 1 1 0-2.9 1.45 1.45 0 0 1 0 2.9zM18 18h-2.5v-4.2c0-2.5-3-2.3-3 0V18H10V9.5h2.5v1.3c1.1-2 5.5-2.2 5.5 1.9V18z',
    lock:      'M12 1.8a4.7 4.7 0 0 0-4.7 4.7V9H6.4A2.4 2.4 0 0 0 4 11.4v8.2A2.4 2.4 0 0 0 6.4 22h11.2a2.4 2.4 0 0 0 2.4-2.4v-8.2A2.4 2.4 0 0 0 17.6 9h-.9V6.5A4.7 4.7 0 0 0 12 1.8zm2.9 7.2H9.1V6.5a2.9 2.9 0 1 1 5.8 0V9z',
};

/* ---------- Primitives ---------- */

function IOSToggle({ on, onChange }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={(e) => { e.stopPropagation(); haptic('selection'); onChange(!on); }}
            className="relative flex-shrink-0 rounded-full"
            style={{
                width: 51, height: 31,
                background: on ? '#34c759' : 'rgba(120,120,128,0.16)',
                transition: `background 0.25s ${EASE}`,
            }}
        >
            <span
                className="absolute top-[2px] rounded-full bg-white"
                style={{
                    width: 27, height: 27,
                    left: on ? 22 : 2,
                    boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.16)',
                    transition: `left 0.28s ${EASE}`,
                }}
            />
        </button>
    );
}

function Slider({ value, min = 0, max = 100, step = 1, onChange }) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <>
            <style>{`
                .ios-slider { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px; outline: none; width: 100%; }
                .ios-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 28px; height: 28px; border-radius: 50%; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(0,0,0,0.05); cursor: pointer; }
                .ios-slider::-moz-range-thumb { width: 28px; height: 28px; border: none; border-radius: 50%; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.25); cursor: pointer; }
            `}</style>
            <input
                type="range"
                className="ios-slider"
                min={min} max={max} step={step} value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{ background: `linear-gradient(to right, ${BLUE} ${pct}%, rgba(120,120,128,0.2) ${pct}%)` }}
            />
        </>
    );
}

function Glyph({ d, color, size = 29 }) {
    return (
        <div className="flex-shrink-0 flex items-center justify-center rounded-[7px]" style={{ width: size, height: size, background: color }}>
            <svg viewBox="0 0 24 24" className="fill-white" style={{ width: size * 0.62, height: size * 0.62 }}><path d={d} /></svg>
        </div>
    );
}

function Chevron() {
    return (
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="ml-2 flex-shrink-0">
            <path d="M1 1l6 6-6 6" stroke="rgba(60,60,67,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function Group({ children, label, footer }) {
    return (
        <div className="mx-4 mt-5">
            {label && <div className="px-4 pb-1.5 text-[13px] uppercase text-black/45 tracking-wide">{label}</div>}
            <div className="bg-white rounded-[12px] overflow-hidden">{children}</div>
            {footer && <div className="px-4 pt-1.5 text-[13px] text-black/45 leading-snug">{footer}</div>}
        </div>
    );
}

function Row({ glyph, color, label, value, toggle, onToggle, onClick, chevron, destructive, badge, last, children }) {
    const clickable = !!onClick;
    return (
        <div
            onClick={clickable ? () => { haptic('selection'); onClick(); } : undefined}
            className={`relative flex items-center pl-4 min-h-[44px] ${clickable ? 'active:bg-black/[0.05] cursor-pointer' : ''}`}
        >
            {glyph && <div className="mr-3.5"><Glyph d={glyph} color={color} /></div>}
            <div className="flex-1 flex items-center min-w-0 pr-4 py-2.5" style={{ minHeight: 44 }}>
                <span className="flex-1 text-[17px] truncate" style={{ color: destructive ? '#ff3b30' : '#000' }}>{label}</span>
                {badge && <span className="ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-[#ff3b30] text-white text-[13px] font-medium flex items-center justify-center">{badge}</span>}
                {value !== undefined && <span className="ml-2 text-[17px] text-black/45 truncate max-w-[45%]">{value}</span>}
                {toggle !== undefined && <IOSToggle on={toggle} onChange={onToggle} />}
                {chevron && <Chevron />}
                {children}
            </div>
            {!last && <div className="absolute bottom-0 right-0 h-px bg-black/[0.12]" style={{ left: glyph ? 60 : 16 }} />}
        </div>
    );
}

/* ---------- Action sheet ---------- */
function ActionSheet({ title, actions, onClose }) {
    const [shown, setShown] = useState(false);
    useEffect(() => { const r = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(r); }, []);
    const close = (cb) => { setShown(false); setTimeout(() => { onClose(); if (cb) cb(); }, 260); };
    return (
        <div className="absolute inset-0 z-50 flex flex-col justify-end" onClick={() => close()}
            style={{ background: shown ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)', transition: 'background 0.26s ease' }}>
            <div className="px-2 pb-3" onClick={(e) => e.stopPropagation()}
                style={{ transform: shown ? 'translateY(0)' : 'translateY(110%)', transition: `transform 0.32s ${EASE}` }}>
                <div className="rounded-[14px] overflow-hidden" style={{ background: 'rgba(249,249,249,0.94)', backdropFilter: 'blur(20px)' }}>
                    <div className="px-4 py-3 text-center text-[13px] text-black/50 leading-snug border-b border-black/10">{title}</div>
                    {actions.map((a, i) => (
                        <button key={a.label} type="button" onClick={() => { haptic('warning'); close(a.onSelect); }}
                            className={`w-full py-[15px] text-[20px] active:bg-black/[0.06] ${i < actions.length - 1 ? 'border-b border-black/10' : ''}`}
                            style={{ color: a.destructive ? '#ff3b30' : BLUE }}>
                            {a.label}
                        </button>
                    ))}
                </div>
                <button type="button" onClick={() => close()} className="w-full mt-2 py-[15px] rounded-[14px] bg-white text-[20px] font-semibold active:bg-black/[0.06]" style={{ color: BLUE }}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

/* ---------- Page shells ---------- */
function SubPage({ title, back = 'Settings', onBack, children }) {
    return (
        <div className="h-full flex flex-col bg-[#f2f2f7]">
            <div className="relative flex items-center h-[44px] flex-shrink-0 px-2 bg-[#f2f2f7]/90 backdrop-blur-xl border-b border-black/[0.08] z-10">
                <button type="button" onClick={onBack} className="flex items-center text-[17px] active:opacity-50 pr-2" style={{ color: BLUE }}>
                    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" className="mr-1"><path d="M10 2 2 10l8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {back}
                </button>
                <span className="absolute left-1/2 -translate-x-1/2 text-[17px] font-semibold text-black">{title}</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto ios-scroll pb-12">{children}</div>
        </div>
    );
}

/* ---------- Sub pages ---------- */

function ProfilePage({ onBack, onOpenApp }) {
    return (
        <SubPage title="Apple ID" onBack={onBack}>
            <div className="flex flex-col items-center pt-6 pb-2">
                <div className="w-[96px] h-[96px] rounded-full overflow-hidden shadow-md ring-1 ring-black/5">
                    <img src="/images/logos/pfp.jpg" alt="Praneeth" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-[24px] font-bold text-black mt-3">P Praneeth Reddy</h2>
                <p className="text-[14px] text-black/45">connectwithpraneeth@gmail.com</p>
            </div>
            <Group>
                <Row label="Name" value="P Praneeth Reddy" />
                <Row label="Role" value="Software Developer @ Simnovus" />
                <Row label="Email" value="connectwithpraneeth@gmail.com" onClick={() => { window.location.href = 'mailto:connectwithpraneeth@gmail.com'; }} chevron last />
            </Group>
            <Group label="Profiles">
                <Row glyph={G.github} color="#1c1c1e" label="GitHub" value="PraneethReddy-github" chevron onClick={() => window.open('https://github.com/PraneethReddy-github', '_blank')} />
                <Row glyph={G.linkedin} color="#0a66c2" label="LinkedIn" value="connectwithpraneeth" chevron onClick={() => window.open('https://www.linkedin.com/in/connectwithpraneeth/', '_blank')} last />
            </Group>
        </SubPage>
    );
}

function AboutPage({ onBack }) {
    const segs = [
        { label: 'Projects', gb: 42, color: '#ff9f0a' },
        { label: 'Skills', gb: 23, color: '#5e5ce6' },
        { label: 'Coffee', gb: 18, color: '#8e5b3a' },
    ];
    const used = segs.reduce((a, s) => a + s.gb, 0);
    return (
        <SubPage title="About" back="General" onBack={onBack}>
            <Group>
                <Row label="Name" value="Praneeth's iPhone" />
                <Row label="Software Version" value="iOS 18 · Portfolio 2.0" />
                <Row label="Model Name" value="iPhone 16 Pro" />
                <Row label="Chip" value="A18 Pro" />
                <Row label="Serial Number" value="PRN33TH-DEV-0X42" last />
            </Group>
            <Group label="Storage" footer={`${used} GB of 128 GB used`}>
                <div className="px-4 pt-4 pb-3">
                    <div className="flex items-baseline justify-between mb-2">
                        <span className="text-[17px] text-black">iPhone</span>
                        <span className="text-[13px] text-black/45">128 GB</span>
                    </div>
                    <div className="h-[10px] rounded-full overflow-hidden flex bg-black/[0.08]">
                        {segs.map((s) => <div key={s.label} style={{ width: `${(s.gb / 128) * 100}%`, background: s.color }} />)}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
                        {segs.map((s) => (
                            <span key={s.label} className="flex items-center text-[12px] text-black/60">
                                <span className="w-2 h-2 rounded-full mr-1.5" style={{ background: s.color }} />{s.label} · {s.gb} GB
                            </span>
                        ))}
                        <span className="flex items-center text-[12px] text-black/60"><span className="w-2 h-2 rounded-full mr-1.5 bg-black/15" />Free · {128 - used} GB</span>
                    </div>
                </div>
            </Group>
        </SubPage>
    );
}

function UpdatePage({ onBack }) {
    return (
        <SubPage title="Software Update" back="General" onBack={onBack}>
            <div className="flex flex-col items-center pt-10 px-8 text-center">
                <div className="w-[72px] h-[72px] rounded-[18px] bg-gradient-to-br from-[#5ac8fa] to-[#007aff] flex items-center justify-center shadow-md">
                    <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white"><path d={G.check} /></svg>
                </div>
                <h2 className="text-[20px] font-semibold text-black mt-4">Portfolio is up to date</h2>
                <p className="text-[14px] text-black/50 mt-1.5 leading-snug">Portfolio 2.0 · iOS 18</p>
            </div>
            <Group footer="Try the desktop version on a laptop for the full Ubuntu experience — windows, a terminal and more.">
                <Row glyph={G.info} color="#8e8e93" label="Desktop Experience" value="Available" last />
            </Group>
        </SubPage>
    );
}

function GeneralPage({ onBack, push }) {
    const [sheet, setSheet] = useState(null);
    const wipe = () => {
        try {
            localStorage.removeItem('ios_system_v1');
            Object.keys(localStorage).filter((k) => k.startsWith('cc_')).forEach((k) => localStorage.removeItem(k));
        } catch {}
        window.location.reload();
    };
    return (
        <div className="relative h-full">
            <SubPage title="General" onBack={onBack}>
                <Group>
                    <Row label="About" chevron onClick={() => push('about')} />
                    <Row label="Software Update" badge="1" chevron onClick={() => push('update')} last />
                </Group>
                <Group>
                    <Row label="iPhone Storage" value="83 GB" chevron onClick={() => push('about')} />
                    <Row label="Background App Refresh" value="On" last />
                </Group>
                <Group>
                    <Row label="Reset Home Screen Layout" destructive onClick={() => setSheet('layout')} />
                    <Row label="Reset All Settings" destructive onClick={() => setSheet('all')} last />
                </Group>
            </SubPage>
            {sheet && (
                <ActionSheet
                    title={sheet === 'all' ? 'This will reset wallpaper, haptics, motion and connectivity settings to defaults.' : 'This will restore the default home screen layout.'}
                    actions={[{ label: sheet === 'all' ? 'Reset All Settings' : 'Reset Home Screen', destructive: true, onSelect: wipe }]}
                    onClose={() => setSheet(null)}
                />
            )}
        </div>
    );
}

function MiniPhone({ dark, label, selected, note, wallpaper, mode }) {
    return (
        <div className="flex flex-col items-center">
            <div
                className="relative w-[76px] rounded-[14px] overflow-hidden border"
                style={{
                    aspectRatio: '9 / 19.5',
                    background: wallpaper ? `url(${wallpaper}) center/cover` : dark ? '#1c1c1e' : '#f2f2f7',
                    borderColor: selected ? BLUE : 'rgba(0,0,0,0.1)',
                    boxShadow: selected ? `0 0 0 2px ${BLUE}` : 'none',
                }}
            >
                {mode === 'lock' && (
                    <div className="absolute inset-x-0 top-4 text-center text-white drop-shadow">
                        <div className="text-[7px] opacity-90">Wednesday</div>
                        <div className="text-[22px] font-bold leading-none">9:41</div>
                    </div>
                )}
                {mode === 'home' && (
                    <div className="absolute inset-x-2 top-5 grid grid-cols-4 gap-1.5">
                        {Array.from({ length: 16 }).map((_, i) => <div key={i} className="aspect-square rounded-[3px] bg-white/70" />)}
                    </div>
                )}
                {!mode && (
                    <div className="absolute inset-x-2 top-3 space-y-1.5">
                        {[0, 1, 2].map((i) => <div key={i} className="h-[9px] rounded-[3px]" style={{ background: dark ? '#2c2c2e' : '#fff' }} />)}
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-1 flex justify-center"><div className="w-6 h-[2px] rounded-full bg-white/80" /></div>
            </div>
            {label && (
                <div className="mt-2 flex items-center gap-1">
                    <span className="text-[13px] text-black">{label}</span>
                    {selected && <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: BLUE }}><svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d={G.check} /></svg></span>}
                </div>
            )}
            {note && <span className="text-[11px] text-black/40">{note}</span>}
        </div>
    );
}

function DisplayPage({ onBack }) {
    const trueTone = useSystem((s) => s.trueTone);
    const textSize = useSystem((s) => s.textSize);
    const reduceMotion = useSystem((s) => s.reduceMotion);
    return (
        <SubPage title="Display & Brightness" onBack={onBack}>
            <Group label="Appearance">
                <div className="flex justify-center gap-10 py-5">
                    <MiniPhone label="Light" selected />
                    <MiniPhone dark label="Dark" note="Coming soon" />
                </div>
            </Group>
            <Group footer="Automatically adapt the display based on ambient lighting conditions.">
                <Row label="True Tone" toggle={trueTone} onToggle={(v) => setSystem({ trueTone: v })} last />
            </Group>
            <Group label="Text Size">
                <div className="px-4 pt-4 pb-2">
                    <p className="text-black leading-snug mb-4" style={{ fontSize: `${17 * textSize}px`, transition: 'font-size 0.2s ease' }}>
                        The quick brown fox jumps over the lazy dog.
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-[13px] text-black">A</span>
                        <div className="flex-1"><Slider value={textSize} min={0.9} max={1.2} step={0.05} onChange={(v) => setSystem({ textSize: v })} /></div>
                        <span className="text-[22px] text-black">A</span>
                    </div>
                </div>
            </Group>
            <Group footer="Reduce the motion of the user interface, including app-open animations and parallax.">
                <Row label="Reduce Motion" toggle={reduceMotion} onToggle={(v) => setSystem({ reduceMotion: v })} last />
            </Group>
        </SubPage>
    );
}

function WallpaperPage({ onBack }) {
    const current = useSystem((s) => s.wallpaper);
    const src = wallpaperSrc(current);
    return (
        <SubPage title="Wallpaper" onBack={onBack}>
            <Group label="Current">
                <div className="flex justify-center gap-6 py-5">
                    <MiniPhone wallpaper={src} mode="lock" label="Lock Screen" />
                    <MiniPhone wallpaper={src} mode="home" label="Home Screen" />
                </div>
            </Group>
            <Group label="Choose a Wallpaper">
                <div className="grid grid-cols-3 gap-3 p-3">
                    {WALLPAPERS.map((w) => {
                        const sel = w.id === current;
                        return (
                            <button key={w.id} type="button" onClick={() => { haptic('selection'); setSystem({ wallpaper: w.id }); }} className="flex flex-col items-center active:scale-95 transition-transform">
                                <div className="relative w-full rounded-[12px] overflow-hidden bg-black/5"
                                    style={{ aspectRatio: '9 / 19', boxShadow: sel ? `0 0 0 2.5px ${BLUE}` : '0 0 0 0.5px rgba(0,0,0,0.1)' }}>
                                    <img src={w.src} alt={w.name} loading="lazy" className="w-full h-full object-cover" />
                                    {sel && (
                                        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center shadow" style={{ background: BLUE }}>
                                            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d={G.check} /></svg>
                                        </span>
                                    )}
                                </div>
                                <span className="text-[12px] mt-1.5" style={{ color: sel ? BLUE : 'rgba(0,0,0,0.6)' }}>{w.name}</span>
                            </button>
                        );
                    })}
                </div>
            </Group>
        </SubPage>
    );
}

function SoundsPage({ onBack }) {
    const haptics = useSystem((s) => s.haptics);
    const [silentVib, setSilentVib] = useState(() => loadCC('silent', false));
    return (
        <SubPage title="Sounds & Haptics" onBack={onBack}>
            <Group footer="Play haptics for system controls and interactions.">
                <Row label="System Haptics" toggle={haptics} onToggle={(v) => setSystem({ haptics: v })} />
                <Row label="Vibrate on Silent" toggle={silentVib} onToggle={(v) => { setSilentVib(v); saveCC('silent', v); }} last />
            </Group>
            <Group label="Sounds and Haptic Patterns">
                <Row label="Ringtone" value="Reflection" chevron onClick={() => {}} />
                <Row label="Text Tone" value="Note" chevron onClick={() => {}} last />
            </Group>
            <Group footer="Haptics work on Android browsers; iOS Safari doesn't expose vibration to websites.">
                <div onClick={() => haptic('success')} className="py-3 text-center text-[17px] active:bg-black/[0.05] cursor-pointer" style={{ color: BLUE }}>
                    Test Haptic
                </div>
            </Group>
        </SubPage>
    );
}

const USAGE = Array.from({ length: 24 }, (_, i) => 18 + Math.round(70 * Math.abs(Math.sin(i * 1.7 + 0.4)) * (i % 5 === 0 ? 0.5 : 1)));

function BatteryPage({ onBack }) {
    const lowPower = useSystem((s) => s.lowPower);
    const [level, setLevel] = useState(85);
    const [charging, setCharging] = useState(false);
    useEffect(() => {
        if (typeof navigator === 'undefined' || !navigator.getBattery) return;
        let b;
        const update = () => { setLevel(Math.round(b.level * 100)); setCharging(b.charging); };
        navigator.getBattery().then((bat) => {
            b = bat; update();
            b.addEventListener('levelchange', update);
            b.addEventListener('chargingchange', update);
        }).catch(() => {});
        return () => { if (b) { b.removeEventListener('levelchange', update); b.removeEventListener('chargingchange', update); } };
    }, []);
    const color = lowPower ? '#ff9f0a' : level <= 20 ? '#ff3b30' : '#34c759';
    return (
        <SubPage title="Battery" onBack={onBack}>
            <Group>
                <div className="px-4 py-4 flex items-center gap-4">
                    <div className="relative w-[64px] h-[30px] rounded-[8px] border-2 border-black/25 p-[2px]">
                        <div className="h-full rounded-[4px]" style={{ width: `${level}%`, background: color, transition: 'width 0.4s ease' }} />
                        <div className="absolute -right-[6px] top-1/2 -translate-y-1/2 w-[3px] h-[10px] rounded-r bg-black/25" />
                    </div>
                    <div>
                        <div className="text-[28px] font-semibold text-black leading-none">{level}%</div>
                        <div className="text-[13px] text-black/45 mt-1">{charging ? 'Charging' : 'Not charging'}</div>
                    </div>
                </div>
            </Group>
            <Group footer="Low Power Mode temporarily reduces background activity like wallpaper motion until you can fully charge your iPhone.">
                <Row label="Low Power Mode" toggle={lowPower} onToggle={(v) => setSystem({ lowPower: v })} last />
            </Group>
            <Group label="Last 24 Hours">
                <div className="px-4 pt-4 pb-3">
                    <div className="flex items-end gap-[3px] h-[80px]">
                        {USAGE.map((h, i) => <div key={i} className="flex-1 rounded-[2px]" style={{ height: `${h}%`, background: i > 19 ? color : 'rgba(0,0,0,0.12)' }} />)}
                    </div>
                    <div className="flex justify-between text-[11px] text-black/40 mt-1.5">
                        <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
                    </div>
                </div>
            </Group>
        </SubPage>
    );
}

function PrivacyPage({ onBack }) {
    return (
        <SubPage title="Privacy & Security" onBack={onBack}>
            <Group>
                <Row glyph={G.info} color="#007aff" label="Location" value="Bangalore, IN" />
                <Row glyph={G.hand} color="#ff9500" label="Tracking" value="Off" />
                <Row glyph={G.update} color="#5e5ce6" label="Analytics" value="react-ga4" last />
            </Group>
            <Group footer="This portfolio stores only your UI preferences (wallpaper, toggles) in your browser's localStorage. Nothing is sent anywhere — except the odd page view to Google Analytics, so I know someone visited.">
                <Row glyph={G.lock} color="#34c759" label="Data Collected" value="Practically none" last />
            </Group>
        </SubPage>
    );
}

/* ---------- Root ---------- */

function RootPage({ push, onOpenApp }) {
    const [airplane, setAirplane] = useState(() => loadCC('airplane', false));
    const [wifi, setWifi] = useState(() => loadCC('wifi', true));
    const [bluetooth, setBluetooth] = useState(() => loadCC('bluetooth', true));
    const [cellular, setCellular] = useState(() => loadCC('cellular', true));

    const dispatch = (w, c) => window.dispatchEvent(new CustomEvent('cc-connectivity', { detail: { wifi: w, cellular: c } }));
    const setAir = (v) => {
        setAirplane(v); saveCC('airplane', v);
        if (v) {
            setWifi(false); setBluetooth(false); setCellular(false);
            saveCC('wifi', false); saveCC('bluetooth', false); saveCC('cellular', false);
            dispatch(false, false);
        }
    };
    const setW = (v) => { setWifi(v); saveCC('wifi', v); dispatch(v, cellular); };
    const setC = (v) => { setCellular(v); saveCC('cellular', v); dispatch(wifi, v); };
    const setB = (v) => { setBluetooth(v); saveCC('bluetooth', v); };

    const apps = [
        { id: 'safari', label: 'Safari', d: G.safari, color: '#1e90ff' },
        { id: 'photos', label: 'Photos', d: G.photos, color: '#ff2d55' },
        { id: 'camera', label: 'Camera', d: G.camera, color: '#8e8e93' },
        { id: 'games', label: 'Arcade', d: G.games, color: '#af52de' },
        { id: 'mail', label: 'Mail', d: G.mail, color: '#007aff' },
        { id: 'varshion', label: 'Varshion', d: G.chat, color: '#0a84ff' },
    ];

    return (
        <div className="h-full overflow-y-auto ios-scroll bg-[#f2f2f7] pb-10">
            <div className="px-5 pt-4 pb-1">
                <h1 className="text-[34px] font-bold text-black tracking-[-0.6px]">Settings</h1>
            </div>

            <div className="mx-4 mt-3 bg-white rounded-[12px] overflow-hidden">
                <div onClick={() => { haptic('selection'); push('profile'); }} className="flex items-center px-4 py-3 active:bg-black/[0.05] cursor-pointer">
                    <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex-shrink-0 ring-1 ring-black/5">
                        <img src="/images/logos/pfp.jpg" alt="Praneeth" className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-3.5 flex-1 min-w-0">
                        <div className="text-[21px] text-black leading-tight truncate">P Praneeth Reddy</div>
                        <div className="text-[13px] text-black/50 mt-0.5 truncate">Apple ID, iCloud, Portfolio</div>
                    </div>
                    <Chevron />
                </div>
            </div>

            <Group>
                <Row glyph={G.airplane} color="#ff9500" label="Airplane Mode" toggle={airplane} onToggle={setAir} />
                <Row glyph={G.wifi} color="#007aff" label="Wi-Fi" value={wifi ? 'Praneeth_5G' : 'Off'} chevron onClick={() => setW(!wifi)} />
                <Row glyph={G.bluetooth} color="#007aff" label="Bluetooth" value={bluetooth ? 'On' : 'Off'} chevron onClick={() => setB(!bluetooth)} />
                <Row glyph={G.cellular} color="#34c759" label="Cellular" toggle={cellular} onToggle={setC} last />
            </Group>

            <Group>
                <Row glyph={G.gear} color="#8e8e93" label="General" badge="1" chevron onClick={() => push('general')} last />
            </Group>

            <Group>
                <Row glyph={G.display} color="#007aff" label="Display & Brightness" chevron onClick={() => push('display')} />
                <Row glyph={G.wallpaper} color="#32ade6" label="Wallpaper" chevron onClick={() => push('wallpaper')} />
                <Row glyph={G.sound} color="#ff2d55" label="Sounds & Haptics" chevron onClick={() => push('sounds')} last />
            </Group>

            <Group>
                <Row glyph={G.battery} color="#34c759" label="Battery" chevron onClick={() => push('battery')} />
                <Row glyph={G.hand} color="#007aff" label="Privacy & Security" chevron onClick={() => push('privacy')} last />
            </Group>

            <Group label="Apps">
                {apps.map((a, i) => (
                    <Row key={a.id} glyph={a.d} color={a.color} label={a.label} chevron onClick={() => onOpenApp && onOpenApp(a.id)} last={i === apps.length - 1} />
                ))}
            </Group>

            <p className="text-center text-[12px] text-black/35 mt-8">Made with ♥ by Praneeth · Built with Next.js</p>
        </div>
    );
}

const PAGES = {
    profile: ProfilePage, general: GeneralPage, about: AboutPage, update: UpdatePage,
    display: DisplayPage, wallpaper: WallpaperPage, sounds: SoundsPage, battery: BatteryPage, privacy: PrivacyPage,
};
const BACK_LABEL = { about: 'General', update: 'General' };

/* ---------- Navigation stack ---------- */
export default function SettingsApp({ onOpenApp }) {
    const [stack, setStack] = useState([]);          // page keys, root implicit
    const [entering, setEntering] = useState(null);  // key currently sliding in
    const [leaving, setLeaving] = useState(null);    // key currently sliding out
    const timer = useRef(null);

    useEffect(() => () => clearTimeout(timer.current), []);

    const push = (key) => {
        haptic('selection');
        setStack((s) => [...s, key]);
        setEntering(key);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setEntering(null), 340);
    };
    const pop = () => {
        haptic('selection');
        const top = stack[stack.length - 1];
        if (!top) return;
        setLeaving(top);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => { setStack((s) => s.slice(0, -1)); setLeaving(null); }, 320);
    };

    const visible = leaving ? stack.length - 1 : stack.length; // depth of the active page (0 = root)

    const layerStyle = (depth) => {
        const isTop = depth === visible;
        const behind = depth < visible;
        return {
            transform: behind ? 'translateX(-30%)' : 'translateX(0)',
            filter: behind ? 'brightness(0.86)' : 'none',
            transition: `transform 0.32s ${EASE}, filter 0.32s ${EASE}`,
            pointerEvents: isTop ? 'auto' : 'none',
        };
    };

    return (
        <div className="relative h-full w-full overflow-hidden ios-font bg-[#f2f2f7]">
            <style>{`
                @keyframes ios-settings-push { from { transform: translateX(100%); } to { transform: translateX(0); } }
                @keyframes ios-settings-pop  { from { transform: translateX(0); }    to { transform: translateX(100%); } }
            `}</style>

            <div className="absolute inset-0" style={layerStyle(0)}>
                <RootPage push={push} onOpenApp={onOpenApp} />
            </div>

            {stack.map((key, i) => {
                const Page = PAGES[key];
                const depth = i + 1;
                const anim = key === entering ? `ios-settings-push 0.32s ${EASE} both`
                    : key === leaving ? `ios-settings-pop 0.32s ${EASE} both` : 'none';
                const base = layerStyle(depth);
                return (
                    <div key={`${key}-${i}`} className="absolute inset-0 bg-[#f2f2f7]"
                        style={{ ...base, animation: anim, boxShadow: '-6px 0 20px rgba(0,0,0,0.12)' }}>
                        <Page onBack={pop} push={push} onOpenApp={onOpenApp} back={BACK_LABEL[key]} />
                    </div>
                );
            })}
        </div>
    );
}
