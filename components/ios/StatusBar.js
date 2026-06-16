import React, { useState, useEffect } from 'react';

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

            {island && (
                <div className="flex justify-center flex-shrink-0">
                    <div className="w-[112px] h-[33px] bg-black rounded-full flex items-center justify-end pr-3 translate-y-[1px]">
                        <div className="w-[9px] h-[9px] rounded-full bg-[#0a0a0a] ring-1 ring-[#1c1c1e]" />
                    </div>
                </div>
            )}

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
