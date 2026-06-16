import React, { useState, useRef, useEffect } from 'react';
import { GALLERY } from './galleryPhotos';

const QUOTES = [
    "You look great today. Seriously. 😊",
    "Say cheese — you're officially a visitor of taste.",
    "404: bad vibes not found.",
    "Built with coffee, code & questionable sleep ☕️",
    "POV: you just found a dev who actually ships.",
    "This is your sign to hit that 'Contact' button.",
    "May your builds be green and your bugs be few 🐛",
    "Plot twist: the real project was the bugs we fixed along the way.",
    "Deploying good vibes… ✅",
    "If you're reading this, you have excellent taste.",
    "Warning: this portfolio may cause a sudden urge to collaborate.",
    "Ctrl + S this moment. ✨",
];

const MODES = ['TIME-LAPSE', 'SLO-MO', 'VIDEO', 'PHOTO', 'PORTRAIT', 'PANO'];

/**
 * iOS-style Camera. No real feed — the viewfinder is a black screen with a
 * friendly quote/meme for visitors; each shutter press surfaces a new one. The
 * gallery thumbnail opens the latest shot in the Photos app.
 */
export default function CameraApp({ onOpenPhotos }) {
    const [quote, setQuote] = useState(0);
    const [flash, setFlash] = useState(false);
    const [mode, setMode] = useState('PHOTO');
    const [flashOn, setFlashOn] = useState(false);
    const [live, setLive] = useState(true);
    const [offset, setOffset] = useState(0); // centers the active mode above the shutter
    const shot = GALLERY.length - 1;          // "recents" thumbnail

    const railRef = useRef(null);
    const btnRefs = useRef({});

    useEffect(() => {
        const rail = railRef.current;
        const btn = btnRefs.current[mode];
        if (!rail || !btn) return;
        setOffset(rail.clientWidth / 2 - (btn.offsetLeft + btn.offsetWidth / 2));
    }, [mode]);

    const newQuote = () => setQuote((q) => {
        let n = q;
        while (n === q) n = Math.floor(Math.random() * QUOTES.length);
        return n;
    });

    const capture = () => {
        setFlash(true);
        setTimeout(() => setFlash(false), 160);
        newQuote();
    };

    return (
        <div className="h-full w-full bg-black ios-font flex flex-col relative overflow-hidden select-none">
            <div className="absolute inset-0 bg-white pointer-events-none z-40 transition-opacity duration-150"
                style={{ opacity: flash ? 0.9 : 0 }} />

            <div className="flex items-center justify-between px-6 pt-12 pb-2 z-20">
                <button
                    onClick={() => setFlashOn((v) => !v)}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: flashOn ? '#ffd60a' : 'rgba(255,255,255,0.12)' }}
                    aria-label="Flash"
                >
                    <svg className="w-[18px] h-[18px]" style={{ fill: flashOn ? '#000' : '#fff' }} viewBox="0 0 24 24"><path d="M7 2h10l-1.2 5.2a2 2 0 0 1-.6 1.05l-.9.85a1.5 1.5 0 0 0-.47 1.1V20a2 2 0 0 1-2 2h-.66a2 2 0 0 1-2-2v-9.8a1.5 1.5 0 0 0-.47-1.1l-.9-.85a2 2 0 0 1-.6-1.05L7 2Z" /></svg>
                </button>

                <div className="w-7 h-[18px] flex items-center justify-center">
                    <svg className="w-4 h-4 fill-white/80" viewBox="0 0 24 24"><path d="M12 15.4 5.3 8.7 6.7 7.3 12 12.6l5.3-5.3 1.4 1.4z" /></svg>
                </div>

                <button
                    onClick={() => setLive((v) => !v)}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: live ? '#ffd60a' : 'rgba(255,255,255,0.12)' }}
                    aria-label="Live Photo"
                >
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke={live ? '#000' : '#fff'} strokeWidth="1.6">
                        <circle cx="12" cy="12" r="3.2" />
                        <circle cx="12" cy="12" r="7" strokeDasharray="2 3" />
                    </svg>
                </button>
            </div>

            <div
                className="flex-1 mx-2 rounded-[26px] relative overflow-hidden flex items-center justify-center px-8 cursor-pointer"
                style={{ background: 'radial-gradient(130% 130% at 50% 0%, #1e2a3a 0%, #11161f 55%, #07080c 100%)' }}
                onClick={newQuote}
            >
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-white/[0.06] blur-3xl pointer-events-none" />

                <div className="absolute inset-6 pointer-events-none">
                    {['top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
                      'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
                      'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
                      'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg'].map((c, i) => (
                        <div key={i} className={`absolute w-7 h-7 border-white/15 ${c}`} />
                    ))}
                </div>

                <p key={quote} className="relative text-white text-[24px] font-semibold leading-snug text-center drop-shadow-lg animate-ios-rise">
                    {QUOTES[quote]}
                </p>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-[11px] tracking-wide pointer-events-none">
                    tap the shutter for another
                </div>
            </div>

            <div ref={railRef} className="relative py-3 z-20 overflow-hidden">
                <div className="flex items-center gap-7 w-max transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(${offset}px)` }}>
                    {MODES.map((m) => (
                        <button
                            key={m}
                            ref={(el) => { btnRefs.current[m] = el; }}
                            onClick={() => setMode(m)}
                            className="text-[12px] font-semibold tracking-[0.6px] whitespace-nowrap transition-colors flex-shrink-0"
                            style={{ color: mode === m ? '#ffd60a' : 'rgba(255,255,255,0.5)' }}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between px-9 pb-7 pt-1 z-20">
                <button
                    onClick={() => onOpenPhotos && onOpenPhotos(shot)}
                    className="w-12 h-12 rounded-[10px] overflow-hidden ring-1 ring-white/25 active:scale-90 transition-transform"
                    aria-label="Open Photos"
                >
                    <img src={GALLERY[shot]} alt="" className="w-full h-full object-cover" />
                </button>

                <button onClick={capture}
                    className="w-[74px] h-[74px] rounded-full flex items-center justify-center active:scale-95 transition-transform"
                    style={{ boxShadow: '0 0 0 4px #fff inset' }}
                    aria-label="Shutter">
                    <div className="w-[60px] h-[60px] rounded-full bg-white" />
                </button>

                <button onClick={newQuote}
                    className="w-12 h-12 rounded-full flex items-center justify-center active:rotate-180 transition-transform duration-300"
                    style={{ background: 'rgba(255,255,255,0.14)' }}
                    aria-label="Flip camera">
                    <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M20 5h-3.2l-1.3-1.6a1 1 0 0 0-.8-.4H9.3a1 1 0 0 0-.8.4L7.2 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-8 12.5a4.5 4.5 0 0 1-4.4-3.5H6.1l2.4-2.6L10.9 14H9.2a2.8 2.8 0 0 0 5.3.4l1.4.8A4.5 4.5 0 0 1 12 17.5Zm3.5-5.9L13.1 10h1.7a2.8 2.8 0 0 0-5.3-.4l-1.4-.8A4.5 4.5 0 0 1 16.4 10h1.5l-2.4 2.6Z" /></svg>
                </button>
            </div>
        </div>
    );
}
