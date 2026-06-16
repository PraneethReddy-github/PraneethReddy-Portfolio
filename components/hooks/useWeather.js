import { useState, useEffect } from 'react';

const LAT = 12.9716;
const LON = 77.5946;
const CITY = 'Bangalore';
const REFRESH_MS = 15 * 60 * 1000; // re-fetch every 15 minutes

const URL =
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day,wind_speed_10m` +
    `&hourly=temperature_2m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset` +
    `&timezone=auto&forecast_days=7`;

export function describe(code, isDay) {
    const c = Number(code);
    const d = !!isDay;
    if (c === 0) return { desc: 'Clear', emoji: d ? '☀️' : '🌙', key: 'clear' };
    if (c === 1) return { desc: 'Mainly Clear', emoji: d ? '🌤️' : '🌙', key: 'clear' };
    if (c === 2) return { desc: 'Partly Cloudy', emoji: d ? '⛅' : '☁️', key: 'clouds' };
    if (c === 3) return { desc: 'Overcast', emoji: '☁️', key: 'clouds' };
    if (c === 45 || c === 48) return { desc: 'Foggy', emoji: '🌫️', key: 'fog' };
    if (c >= 51 && c <= 57) return { desc: 'Drizzle', emoji: '🌦️', key: 'rain' };
    if (c >= 61 && c <= 67) return { desc: 'Rainy', emoji: '🌧️', key: 'rain' };
    if (c >= 71 && c <= 77) return { desc: 'Snow', emoji: '❄️', key: 'snow' };
    if (c >= 80 && c <= 82) return { desc: 'Showers', emoji: '🌦️', key: 'rain' };
    if (c >= 85 && c <= 86) return { desc: 'Snow Showers', emoji: '🌨️', key: 'snow' };
    if (c >= 95) return { desc: 'Thunderstorm', emoji: '⛈️', key: 'storm' };
    return { desc: 'Mostly Sunny', emoji: '☀️', key: 'clear' };
}

const hourLabel = (iso) => {
    const h = new Date(iso).getHours();
    const ap = h < 12 ? 'AM' : 'PM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}${ap}`;
};
const dayShort = (iso) => new Date(iso).toLocaleDateString('en-US', { weekday: 'short' });
const clockTime = (iso) =>
    new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

/* ---- Shared store: one fetch + one timer, broadcast to every consumer ---- */
const store = {
    data: {
        temp: 32, feelsLike: 33, humidity: 50, wind: 8,
        desc: 'Mostly Sunny', emoji: '☀️', key: 'clear', city: CITY,
        isDay: 1, hi: 33, lo: 22, hourly: [], daily: [],
        sunrise: null, sunset: null, loading: true, updatedAt: null,
    },
    subs: new Set(),
    timer: null,
    fetches: 0, // how many times we've hit the network this session
};

const emit = () => store.subs.forEach((fn) => fn(store.data));

async function load() {
    try {
        store.fetches += 1;
        const res = await fetch(URL);
        const d = await res.json();
        if (!d || !d.current) throw new Error('bad payload');

        const cur = d.current;
        const base = describe(cur.weather_code, cur.is_day);

        const H = d.hourly || {};
        const now = new Date(cur.time);
        let start = (H.time || []).findIndex((t) => new Date(t) >= now);
        if (start < 0) start = 0;
        const hourly = [];
        for (let i = start; i < start + 12 && i < (H.time || []).length; i++) {
            const h = new Date(H.time[i]).getHours();
            hourly.push({
                label: i === start ? 'Now' : hourLabel(H.time[i]),
                temp: Math.round(H.temperature_2m[i]),
                ...describe(H.weather_code[i], h >= 6 && h < 19),
            });
        }

        const D = d.daily || {};
        const daily = (D.time || []).map((t, i) => ({
            label: i === 0 ? 'Today' : dayShort(t),
            hi: Math.round(D.temperature_2m_max[i]),
            lo: Math.round(D.temperature_2m_min[i]),
            ...describe(D.weather_code[i], 1),
        }));

        store.data = {
            temp: Math.round(cur.temperature_2m),
            feelsLike: Math.round(cur.apparent_temperature ?? cur.temperature_2m),
            humidity: Math.round(cur.relative_humidity_2m ?? 0),
            wind: Math.round(cur.wind_speed_10m ?? 0),
            desc: base.desc, emoji: base.emoji, key: base.key, city: CITY,
            isDay: cur.is_day,
            hi: daily[0]?.hi ?? Math.round(cur.temperature_2m),
            lo: daily[0]?.lo ?? Math.round(cur.temperature_2m),
            hourly, daily,
            sunrise: D.sunrise ? clockTime(D.sunrise[0]) : null,
            sunset: D.sunset ? clockTime(D.sunset[0]) : null,
            loading: false,
            updatedAt: clockTime(cur.time),
        };
        emit();
    } catch {
        store.data = { ...store.data, loading: false };
        emit();
    }
}

function ensureRunning() {
    if (store.timer) return;
    load();
    store.timer = setInterval(load, REFRESH_MS);
}

/**
 * Live weather for Bangalore via the keyless Open-Meteo API.
 * All consumers share a single fetch + a 15-minute refresh timer, so mounting
 * the widget and the Weather app together still costs just one request.
 */
export default function useWeather() {
    const [data, setData] = useState(store.data);
    useEffect(() => {
        store.subs.add(setData);
        setData(store.data);
        ensureRunning();
        return () => { store.subs.delete(setData); };
    }, []);
    return data;
}
