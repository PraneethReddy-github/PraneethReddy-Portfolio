import React, { useState, useEffect } from 'react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarApp() {
    const [today, setToday] = useState(null);
    const [view, setView] = useState({ y: 2026, m: 5 }); // fallback; corrected on mount

    useEffect(() => {
        const now = new Date();
        setToday(now);
        setView({ y: now.getFullYear(), m: now.getMonth() });
    }, []);

    const firstDow = new Date(view.y, view.m, 1).getDay();
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const isToday = (d) =>
        today && d === today.getDate() && view.m === today.getMonth() && view.y === today.getFullYear();

    const shift = (delta) => {
        setView((v) => {
            let m = v.m + delta, y = v.y;
            if (m < 0) { m = 11; y--; }
            if (m > 11) { m = 0; y++; }
            return { y, m };
        });
    };

    return (
        <div className="h-full bg-white ios-font flex flex-col animate-ios-rise">
            <div className="px-5 pt-4 pb-3 flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-bold tracking-[-0.5px]" style={{ color: '#ff3b30' }}>{MONTHS[view.m]}</h1>
                    <span className="text-[15px] font-medium text-black/40">{view.y}</span>
                </div>
                <div className="flex items-center gap-5">
                    <button onClick={() => shift(-1)} className="active:opacity-50">
                        <svg className="w-6 h-6 fill-[#ff3b30]" viewBox="0 0 24 24"><path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4-4.6-4.6 4.6-4.6Z" /></svg>
                    </button>
                    <button onClick={() => shift(1)} className="active:opacity-50">
                        <svg className="w-6 h-6 fill-[#ff3b30]" viewBox="0 0 24 24"><path d="M8.6 7.4 10 6l6 6-6 6-1.4-1.4 4.6-4.6-4.6-4.6Z" /></svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 px-3 pb-2 border-b border-black/[0.06]">
                {DOW.map((d, i) => (
                    <div key={i} className="text-center text-[12px] font-semibold text-black/35 py-1">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 px-3 pt-2 gap-y-1">
                {cells.map((d, i) => (
                    <div key={i} className="flex justify-center items-center h-12">
                        {d && (
                            <div className={`w-9 h-9 flex items-center justify-center rounded-full text-[16px] ${isToday(d) ? 'bg-[#ff3b30] text-white font-bold' : 'text-black/80'}`}>
                                {d}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-auto px-5 py-4 border-t border-black/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#ff3b30]" />
                    <span className="text-[14px] text-black/60">
                        {today ? today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''} · Today
                    </span>
                </div>
            </div>
        </div>
    );
}
