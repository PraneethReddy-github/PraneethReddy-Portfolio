import React from 'react';
import useWeather from '../hooks/useWeather';
import WeatherScene, { gradientFor } from './WeatherScene';

function DetailCard({ label, icon, children }) {
    return (
        <div className="rounded-[18px] bg-white/15 backdrop-blur-md border border-white/10 p-3.5 flex flex-col">
            <div className="flex items-center gap-1.5 text-white/60 text-[11px] font-semibold uppercase tracking-wide">
                {icon}<span>{label}</span>
            </div>
            <div className="mt-auto pt-2 text-white">{children}</div>
        </div>
    );
}

export default function WeatherApp() {
    const w = useWeather();

    const weekLo = w.daily.length ? Math.min(...w.daily.map((d) => d.lo)) : w.lo;
    const weekHi = w.daily.length ? Math.max(...w.daily.map((d) => d.hi)) : w.hi;
    const span = Math.max(1, weekHi - weekLo);

    return (
        <div className="relative h-full overflow-hidden ios-font" style={{ background: gradientFor(w.key, w.isDay) }}>
            <WeatherScene weatherKey={w.key} isDay={w.isDay} dense />

            <div className="relative z-10 h-full overflow-y-auto ios-scroll px-5 pt-6 pb-10">
                <div className="flex flex-col items-center text-center text-white">
                    <h1 className="text-[26px] font-semibold drop-shadow">{w.city}</h1>
                    <div className="text-[80px] font-thin leading-none tracking-[-3px] drop-shadow mt-1">{w.temp}°</div>
                    <div className="text-[17px] font-medium drop-shadow flex items-center gap-2">
                        <span>{w.emoji}</span><span>{w.desc}</span>
                    </div>
                    <div className="text-[15px] text-white/85 font-medium drop-shadow mt-0.5">H:{w.hi}°  L:{w.lo}°</div>
                    {w.loading && <div className="text-white/60 text-[12px] mt-2">Updating…</div>}
                </div>

                {w.hourly.length > 0 && (
                    <div className="mt-7 rounded-[20px] bg-white/15 backdrop-blur-md border border-white/10 p-3">
                        <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                            {w.hourly.map((h, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0 w-11">
                                    <span className="text-white/80 text-[12px] font-semibold">{h.label}</span>
                                    <span className="text-[20px]">{h.emoji}</span>
                                    <span className="text-white text-[15px] font-semibold">{h.temp}°</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {w.daily.length > 0 && (
                    <div className="mt-4 rounded-[20px] bg-white/15 backdrop-blur-md border border-white/10 px-4 py-1.5">
                        {w.daily.map((d, i) => {
                            const left = ((d.lo - weekLo) / span) * 100;
                            const width = ((d.hi - d.lo) / span) * 100;
                            return (
                                <div key={i} className="flex items-center py-2.5 border-b border-white/10 last:border-0">
                                    <span className="text-white text-[15px] font-semibold w-12">{d.label}</span>
                                    <span className="text-[19px] w-9 text-center">{d.emoji}</span>
                                    <span className="text-white/55 text-[14px] w-9 text-right">{d.lo}°</span>
                                    <div className="flex-1 mx-3 h-[5px] rounded-full bg-white/15 relative overflow-hidden">
                                        <div className="absolute h-full rounded-full bg-gradient-to-r from-[#ffd27a] to-[#ff8a5b]"
                                            style={{ left: `${left}%`, width: `${Math.max(8, width)}%` }} />
                                    </div>
                                    <span className="text-white text-[14px] w-9">{d.hi}°</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <DetailCard label="Feels Like" icon={<Glyph d="M12 3a4 4 0 0 0-4 4v6.5a5 5 0 1 0 8 0V7a4 4 0 0 0-4-4Z" />}>
                        <span className="text-[26px] font-light">{w.feelsLike}°</span>
                    </DetailCard>
                    <DetailCard label="Humidity" icon={<Glyph d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11Z" />}>
                        <span className="text-[26px] font-light">{w.humidity}%</span>
                    </DetailCard>
                    <DetailCard label="Wind" icon={<Glyph d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h9a2.5 2.5 0 1 1-2.5 2.5" />}>
                        <span className="text-[26px] font-light">{w.wind}<span className="text-[14px]"> km/h</span></span>
                    </DetailCard>
                    <DetailCard label="Sun" icon={<Glyph d="M12 17a5 5 0 0 1-5-5h10a5 5 0 0 1-5 5ZM4 20h16M12 3v3" />}>
                        <div className="flex flex-col text-[13px] font-medium leading-tight">
                            <span>↑ {w.sunrise || '—'}</span>
                            <span className="text-white/70 mt-0.5">↓ {w.sunset || '—'}</span>
                        </div>
                    </DetailCard>
                </div>

                {w.updatedAt && (
                    <div className="text-center text-white/55 text-[11px] mt-5">
                        Updated {w.updatedAt} · refreshes every 15 min · Open-Meteo
                    </div>
                )}
            </div>
        </div>
    );
}

const Glyph = ({ d }) => (
    <svg className="w-3.5 h-3.5 fill-none stroke-white/60" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d={d} />
    </svg>
);
