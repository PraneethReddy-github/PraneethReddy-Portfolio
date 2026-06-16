import React from 'react';

/* Background gradient per condition — used behind the scene layers. */
export function gradientFor(key, isDay) {
    if (!isDay) {
        if (key === 'storm') return 'linear-gradient(160deg,#1f2433 0%,#0c0e16 100%)';
        if (key === 'rain') return 'linear-gradient(160deg,#243240 0%,#10161d 100%)';
        if (key === 'snow') return 'linear-gradient(160deg,#2a3340 0%,#141a22 100%)';
        return 'linear-gradient(160deg,#1b2a4a 0%,#0a0f1e 100%)'; // clear / clouds / fog night
    }
    switch (key) {
        case 'clear':  return 'linear-gradient(160deg,#3aa0ec 0%,#1f6fd1 100%)';
        case 'clouds': return 'linear-gradient(160deg,#5a7a99 0%,#2f4a63 100%)';
        case 'rain':   return 'linear-gradient(160deg,#3f5366 0%,#222f3c 100%)';
        case 'snow':   return 'linear-gradient(160deg,#7d93a8 0%,#445566 100%)';
        case 'storm':  return 'linear-gradient(160deg,#3a4152 0%,#1c2230 100%)';
        case 'fog':    return 'linear-gradient(160deg,#8294a3 0%,#566570 100%)';
        default:       return 'linear-gradient(160deg,#3aa0ec 0%,#1f6fd1 100%)';
    }
}

const Cloud = ({ style, className }) => (
    <div className={`absolute rounded-full bg-white/70 blur-[2px] ${className || ''}`} style={style}>
        <div className="absolute rounded-full bg-white/70" style={{ width: '55%', height: '85%', left: '12%', top: '-45%' }} />
        <div className="absolute rounded-full bg-white/70" style={{ width: '45%', height: '75%', right: '14%', top: '-30%' }} />
    </div>
);

/**
 * Animated weather backdrop. `dense` turns up the particle count for the
 * full-screen app; the small widget stays light. Pure CSS — cheap to run.
 */
export default function WeatherScene({ weatherKey = 'clear', isDay = 1, dense = false }) {
    const day = !!isDay;
    const drops = dense ? 26 : 10;
    const flakes = dense ? 22 : 9;
    const stars = dense ? 26 : 12;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {weatherKey === 'clear' && day && (
                <div className="absolute" style={{ top: dense ? '14%' : '-18%', right: dense ? '16%' : '-12%' }}>
                    <div className="relative" style={{ width: dense ? 120 : 80, height: dense ? 120 : 80 }}>
                        <div className="wx-glow absolute inset-[10%] rounded-full bg-[#ffe98a]" style={{ filter: 'blur(12px)' }} />
                        <svg className="wx-rays absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <rect key={i} x="49" y="10" width="2" height="10" rx="1" fill="rgba(255,235,150,0.85)"
                                    transform={`rotate(${i * 30} 50 50)`} />
                            ))}
                        </svg>
                        <div className="absolute inset-[26%] rounded-full bg-[#fff3b0] shadow-[0_0_30px_rgba(255,230,120,0.9)]" />
                    </div>
                </div>
            )}

            {weatherKey === 'clear' && !day && (
                <>
                    <div className="absolute rounded-full bg-[#dfe7f5] shadow-[0_0_26px_rgba(200,215,245,0.7)]"
                        style={{ width: dense ? 86 : 58, height: dense ? 86 : 58, top: dense ? '14%' : '-14%', right: dense ? '18%' : '-8%' }} />
                    {Array.from({ length: stars }).map((_, i) => (
                        <span key={i} className="wx-star absolute rounded-full bg-white"
                            style={{
                                width: 2 + (i % 3), height: 2 + (i % 3),
                                left: `${(i * 37) % 100}%`, top: `${(i * 53) % 70}%`,
                                animationDuration: `${1.8 + (i % 5) * 0.4}s`, animationDelay: `${(i % 7) * 0.3}s`,
                            }} />
                    ))}
                </>
            )}

            {(weatherKey === 'clouds' || weatherKey === 'rain' || weatherKey === 'storm') &&
                Array.from({ length: dense ? 4 : 2 }).map((_, i) => (
                    <Cloud key={i} className="wx-cloud"
                        style={{
                            width: (dense ? 150 : 90) - i * 18, height: (dense ? 44 : 26) - i * 4,
                            top: `${10 + i * 22}%`, left: '-30%',
                            animationDuration: `${26 + i * 9}s`, animationDelay: `${i * 5}s`,
                            opacity: 0.8 - i * 0.15,
                        }} />
                ))}

            {weatherKey === 'rain' && Array.from({ length: drops }).map((_, i) => (
                <span key={i} className="wx-rain absolute bg-gradient-to-b from-white/0 via-white/60 to-white/70 rounded-full"
                    style={{
                        width: 2, height: dense ? 16 : 11, left: `${(i * 53) % 100}%`, top: `-${(i % 5) * 10}%`,
                        animationDuration: `${0.7 + (i % 4) * 0.18}s`, animationDelay: `${(i % 6) * 0.15}s`,
                    }} />
            ))}

            {weatherKey === 'snow' && Array.from({ length: flakes }).map((_, i) => (
                <span key={i} className="wx-snow absolute rounded-full bg-white"
                    style={{
                        width: 4 + (i % 3), height: 4 + (i % 3), left: `${(i * 47) % 100}%`, top: `-${(i % 4) * 10}%`,
                        animationDuration: `${2.6 + (i % 5) * 0.5}s`, animationDelay: `${(i % 6) * 0.3}s`, opacity: 0.85,
                    }} />
            ))}

            {weatherKey === 'storm' && (
                <div className="wx-flash absolute inset-0 bg-white" />
            )}

            {weatherKey === 'fog' && Array.from({ length: dense ? 5 : 3 }).map((_, i) => (
                <div key={i} className="wx-haze absolute left-0 right-0 h-5 bg-white/30 blur-md"
                    style={{ top: `${20 + i * 16}%`, animationDuration: `${8 + i * 2}s`, animationDelay: `${i * 0.8}s` }} />
            ))}
        </div>
    );
}
